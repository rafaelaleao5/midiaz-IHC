from fastapi import FastAPI, HTTPException, Depends, Form, Header, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from auth import authenticate_user, create_access_token, verify_token, create_user
from database import SessionLocal, User, Photo, create_tables
from file_upload import save_uploaded_file, get_user_photos, get_upload_stats
import io
import uuid

app = FastAPI(title="Midiaz Auth API", version="1.0.0")

# Configurar CORS para permitir comunicação com o frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar autenticação
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Dependency para obter usuário atual"""
    token = credentials.credentials
    user = verify_token(token)
    if user is None:
        raise HTTPException(status_code=401, detail="Token inválido")
    return user

@app.get("/")
async def root():
    return {"message": "Midiaz Auth API is running!"}

@app.post("/api/auth/login")
async def login(email: str = Form(...), password: str = Form(...)):
    """
    Endpoint de login
    """
    user = authenticate_user(email, password)
    if not user:
        raise HTTPException(status_code=401, detail="Email ou senha incorretos")
    
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "cpf": user.get("cpf", ""),
            "phone": user.get("phone", ""),
            "type": user["type"],
            "avatar": user["avatar"]
        }
    }

@app.post("/api/auth/register")
async def register(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    user_type: str = Form(...),
    cpf: str = Form(...),
    phone: str = Form(...)
):
    """
    Endpoint de registro
    """
    try:
        user = create_user(name, email, password, user_type, cpf, phone)
        access_token_expires = timedelta(minutes=30)
        access_token = create_access_token(
            data={"sub": user["email"]}, expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "cpf": user["cpf"],
                "phone": user["phone"],
                "type": user["type"],
                "avatar": user["avatar"]
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/auth/me")
async def get_current_user_info(current_user: Dict = Depends(get_current_user)):
    """
    Retorna informações do usuário atual
    """
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "cpf": current_user.get("cpf", ""),
        "phone": current_user.get("phone", ""),
        "type": current_user["type"],
        "avatar": current_user["avatar"]
    }

@app.post("/api/register-face")
async def register_face(
    file: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """
    Registra uma foto de referência do usuário para reconhecimento facial
    """
    try:
        # Salvar foto no sistema de arquivos e banco
        success, message, photo = save_uploaded_file(
            file=file,
            user_id=current_user["id"],
            is_reference=True
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        # Simular processamento de reconhecimento facial
        # Em produção, aqui seria usado face_recognition e opencv
        
        # Atualizar flag de face detectada
        db = SessionLocal()
        try:
            photo.face_detected = True
            db.commit()
        finally:
            db.close()
        
        return {
            "success": True,
            "message": "Rosto registrado com sucesso",
            "user_id": current_user["id"],
            "face_detected": True,
            "photo_id": photo.id
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")

@app.post("/api/upload-photo")
async def upload_photo(
    file: UploadFile = File(...),
    current_user: Dict = Depends(get_current_user)
):
    """
    Faz upload de uma foto do usuário
    """
    try:
        success, message, photo = save_uploaded_file(
            file=file,
            user_id=current_user["id"],
            is_reference=False
        )
        
        if not success:
            raise HTTPException(status_code=400, detail=message)
        
        return {
            "success": True,
            "message": "Foto enviada com sucesso",
            "photo": {
                "id": photo.id,
                "filename": photo.filename,
                "file_size": photo.file_size,
                "created_at": photo.created_at.isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao fazer upload: {str(e)}")

@app.get("/api/user/photos")
async def get_photos(current_user: Dict = Depends(get_current_user)):
    """
    Retorna todas as fotos do usuário
    """
    try:
        photos = get_user_photos(current_user["id"])
        
        return {
            "success": True,
            "photos": [
                {
                    "id": photo.id,
                    "filename": photo.filename,
                    "file_size": photo.file_size,
                    "is_reference": photo.is_reference_photo,
                    "face_detected": photo.face_detected,
                    "created_at": photo.created_at.isoformat()
                }
                for photo in photos
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar fotos: {str(e)}")

@app.get("/api/stats")
async def get_stats():
    """
    Retorna estatísticas do sistema
    """
    try:
        # Estatísticas de upload
        upload_stats = get_upload_stats()
        
        # Estatísticas de usuários
        db = SessionLocal()
        try:
            total_users = db.query(User).count()
            consumer_count = db.query(User).filter(User.user_type == "consumer").count()
            photographer_count = db.query(User).filter(User.user_type == "photographer").count()
            admin_count = db.query(User).filter(User.user_type == "admin").count()
        finally:
            db.close()
        
        return {
            "users": {
                "total": total_users,
                "consumers": consumer_count,
                "photographers": photographer_count,
                "admins": admin_count
            },
            "photos": upload_stats,
            "system": {
                "uptime": "running",
                "version": "1.0.0"
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar estatísticas: {str(e)}")

if __name__ == "__main__":
    # Criar tabelas se não existirem
    create_tables()
    print("✅ Tabelas do banco criadas/verificadas")
    
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 