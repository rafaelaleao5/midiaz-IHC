from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import face_recognition
import cv2
import numpy as np
from PIL import Image
import io
import os
from typing import List, Dict, Any
import json
from datetime import datetime
import uuid

app = FastAPI(title="Midiaz Face Recognition API", version="1.0.0")

# Configurar CORS para permitir comunicação com o frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diretório para armazenar fotos de referência dos usuários
UPLOAD_DIR = "midiaz_uploads"
REFERENCE_DIR = "midiaz_reference_faces"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(REFERENCE_DIR, exist_ok=True)

# Simular banco de dados em memória (em produção, use PostgreSQL)
user_faces_db = {}  # {user_id: face_encoding}
photo_results_db = {}  # {photo_id: detection_results}

@app.get("/")
async def root():
    return {"message": "Face Recognition API is running!"}

@app.get("/api/stats")
async def get_stats():
    """
    Retorna estatísticas do sistema
    """
    return {
        "total_users_registered": len(user_faces_db),
        "total_photos_processed": len(photo_results_db),
        "total_detections": sum(len(result["detections"]) for result in photo_results_db.values())
    }

# Rota para registrar um rosto de referência do usuário durante o cadastro.
@app.post("/api/register-face")
async def register_face(user_id: str = Form(...), file: UploadFile = File(...)):
    """
    Registra uma foto de referência do usuário para reconhecimento facial
    """
    try:
        # Ler e processar a imagem
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        image_array = np.array(image)
        
        # Detectar rostos na imagem
        face_locations = face_recognition.face_locations(image_array)
        
        if not face_locations:
            raise HTTPException(status_code=400, detail="Nenhum rosto detectado na imagem")
        
        if len(face_locations) > 1:
            raise HTTPException(status_code=400, detail="Múltiplos rostos detectados. Use uma foto com apenas um rosto")
        
        # Extrair encoding do rosto
        face_encoding = face_recognition.face_encodings(image_array)[0]
        
        # Salvar encoding no "banco de dados"
        user_faces_db[user_id] = face_encoding.tolist()
        
        # Salvar imagem de referência
        reference_path = os.path.join(REFERENCE_DIR, f"{user_id}.jpg")
        image.save(reference_path)
        
        return {
            "success": True,
            "message": "Rosto registrado com sucesso",
            "user_id": user_id,
            "face_detected": True
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar imagem: {str(e)}")

# Esta rota serve para detectar todas as ocorrências de um rosto específico(primeira imagem) em uma imagem de grupo(segunda imagem).
# Pra consultar esta rota, usar o postman e enviar uma imagem de referência e uma imagem qualquer, com as tags reference_image e target_image respectivamente, em form-data.
@app.post("/api/detect-face")
async def detect_face(
    reference_image: UploadFile = File(..., description="Imagem de referência com UM rosto"),
    target_image: UploadFile = File(..., description="Imagem alvo onde buscar múltiplas ocorrências do rosto")
):
    try:
        # Processar imagem de referência (mesmo código)
        ref_contents = await reference_image.read()
        ref_array = face_recognition.load_image_file(io.BytesIO(ref_contents))
        ref_encodings = face_recognition.face_encodings(ref_array)
        
        if not ref_encodings:
            raise HTTPException(status_code=400, detail="Nenhum rosto detectado na imagem de referência")
        
        ref_encoding = ref_encodings[0]

        # Processar imagem alvo (mesmo código)
        target_contents = await target_image.read()
        target_array = face_recognition.load_image_file(io.BytesIO(target_contents))
        target_face_locations = face_recognition.face_locations(target_array)
        target_encodings = face_recognition.face_encodings(target_array, target_face_locations)
        
        if not target_encodings:
            raise HTTPException(status_code=400, detail="Nenhum rosto detectado na imagem alvo")

        # CORREÇÃO: Comparar com CADA rosto na imagem alvo individualmente
        results = []
        for i, target_encoding in enumerate(target_encodings):
            match = face_recognition.compare_faces([ref_encoding], target_encoding)[0]
            
            if match:
                top, right, bottom, left = target_face_locations[i]
                results.append({
                    "match": True,
                    "location": {
                        "top": top,
                        "right": right,
                        "bottom": bottom,
                        "left": left
                    }
                })

        return JSONResponse(content={
            "found_matches": len(results),
            "matches": results
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

# Esta rota serve para comparar um rosto de referência com um rosto em uma imagem alvo.
# Pra consultar esta rota, usar o postman e enviar a imgem de referência e a imgem alvo, com as tags reference_image e target_image respectivamente, em form-data.
@app.post("/api/compare-faces")
async def compare_faces(
    reference_image: UploadFile = File(..., description="Imagem de referência com UM rosto"),
    target_image: UploadFile = File(..., description="Imagem alvo onde buscar o rosto")
):
    try:
        # Processar imagem de referência
        ref_contents = await reference_image.read()
        ref_array = face_recognition.load_image_file(io.BytesIO(ref_contents))  # Corrigido: usa loader nativo
        ref_encodings = face_recognition.face_encodings(ref_array)
        if not ref_encodings:
            raise HTTPException(status_code=400, detail="Nenhum rosto detectado na imagem de referência")
        ref_encoding = ref_encodings[0]

        # Processar imagem alvo
        target_contents = await target_image.read()
        target_array = face_recognition.load_image_file(io.BytesIO(target_contents))  # Corrigido: usa loader nativo
        target_encodings = face_recognition.face_encodings(target_array)
        if not target_encodings:
            raise HTTPException(status_code=400, detail="Nenhum rosto detectado na imagem alvo")

        # Comparar com TODOS os rostos na imagem alvo
        matches = face_recognition.compare_faces([ref_encoding], target_encodings[0])  # Comparação direta
        result = bool(matches[0]) if matches else False

        return JSONResponse(content={"match": result})
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

@app.get("/api/search-user-photos/{user_id}")
async def search_user_photos(user_id: str, event_id: str = None):
    """
    Busca fotos onde um usuário específico aparece
    """
    try:
        if user_id not in user_faces_db:
            raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
        matching_photos = []
        
        for photo_id, result in photo_results_db.items():
            if event_id and result["event_id"] != event_id:
                continue
                
            for detection in result["detections"]:
                if detection["user_id"] == user_id:
                    matching_photos.append({
                        "photo_id": photo_id,
                        "event_id": result["event_id"],
                        "confidence": detection["confidence"],
                        "processed_at": result["processed_at"]
                    })
                    break
        
        # Ordenar por confiança
        matching_photos.sort(key=lambda x: x["confidence"], reverse=True)
        
        return {
            "success": True,
            "user_id": user_id,
            "photos_found": len(matching_photos),
            "photos": matching_photos
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na busca: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 