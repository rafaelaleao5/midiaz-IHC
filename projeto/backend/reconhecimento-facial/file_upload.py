#!/usr/bin/env python3
"""
Sistema de upload e gerenciamento de arquivos para o Midiaz
"""

import os
import uuid
import shutil
from datetime import datetime
from typing import Optional, Tuple
from fastapi import UploadFile
from database import SessionLocal, Photo, User

# Configurações de diretórios
UPLOAD_DIR = "midiaz_uploads"
REFERENCE_FACES_DIR = "midiaz_reference_faces"

def ensure_directories():
    """Cria os diretórios necessários se não existirem"""
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    os.makedirs(REFERENCE_FACES_DIR, exist_ok=True)
    print(f"✅ Diretórios criados: {UPLOAD_DIR}, {REFERENCE_FACES_DIR}")

def save_uploaded_file(file: UploadFile, user_id: int, is_reference: bool = False) -> Tuple[bool, str, Optional[Photo]]:
    """
    Salva um arquivo enviado e registra no banco de dados
    
    Args:
        file: Arquivo enviado via FastAPI
        user_id: ID do usuário que fez o upload
        is_reference: Se é uma foto de referência para reconhecimento facial
    
    Returns:
        Tuple[bool, str, Optional[Photo]]: (sucesso, mensagem, objeto_photo)
    """
    try:
        # Verificar se o arquivo é uma imagem
        if not file.content_type.startswith('image/'):
            return False, "Arquivo deve ser uma imagem", None
        
        # Gerar nome único para o arquivo
        file_extension = os.path.splitext(file.filename)[1] if file.filename else '.jpg'
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Determinar diretório de destino
        if is_reference:
            dest_dir = REFERENCE_FACES_DIR
        else:
            dest_dir = UPLOAD_DIR
        
        # Caminho completo do arquivo
        file_path = os.path.join(dest_dir, unique_filename)
        
        # Salvar arquivo no sistema de arquivos
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Obter tamanho do arquivo
        file_size = os.path.getsize(file_path)
        
        # Salvar no banco de dados
        db = SessionLocal()
        try:
            photo = Photo(
                user_id=user_id,
                filename=unique_filename,
                file_path=file_path,
                file_size=file_size,
                mime_type=file.content_type,
                is_reference_photo=is_reference,
                face_detected=False  # Será atualizado pelo reconhecimento facial
            )
            
            db.add(photo)
            db.commit()
            db.refresh(photo)
            
            print(f"✅ Foto salva: {unique_filename} ({file_size} bytes)")
            return True, "Foto salva com sucesso", photo
            
        except Exception as e:
            db.rollback()
            # Remover arquivo se falhou no banco
            if os.path.exists(file_path):
                os.remove(file_path)
            return False, f"Erro ao salvar no banco: {str(e)}", None
            
        finally:
            db.close()
            
    except Exception as e:
        return False, f"Erro ao processar arquivo: {str(e)}", None

def get_user_photos(user_id: int) -> list:
    """Retorna todas as fotos de um usuário"""
    db = SessionLocal()
    try:
        photos = db.query(Photo).filter(Photo.user_id == user_id).all()
        return photos
    finally:
        db.close()

def get_photo_by_id(photo_id: int) -> Optional[Photo]:
    """Retorna uma foto específica por ID"""
    db = SessionLocal()
    try:
        photo = db.query(Photo).filter(Photo.id == photo_id).first()
        return photo
    finally:
        db.close()

def delete_photo(photo_id: int, user_id: int) -> Tuple[bool, str]:
    """Deleta uma foto (apenas se pertencer ao usuário)"""
    db = SessionLocal()
    try:
        photo = db.query(Photo).filter(
            Photo.id == photo_id,
            Photo.user_id == user_id
        ).first()
        
        if not photo:
            return False, "Foto não encontrada ou não pertence ao usuário"
        
        # Remover arquivo do sistema
        if os.path.exists(photo.file_path):
            os.remove(photo.file_path)
        
        # Remover do banco
        db.delete(photo)
        db.commit()
        
        return True, "Foto deletada com sucesso"
        
    except Exception as e:
        db.rollback()
        return False, f"Erro ao deletar foto: {str(e)}"
    finally:
        db.close()

def get_upload_stats() -> dict:
    """Retorna estatísticas dos uploads"""
    db = SessionLocal()
    try:
        total_photos = db.query(Photo).count()
        total_size = db.query(Photo.file_size).all()
        total_size_bytes = sum(size[0] for size in total_size if size[0])
        
        reference_photos = db.query(Photo).filter(Photo.is_reference_photo == True).count()
        
        return {
            "total_photos": total_photos,
            "total_size_mb": round(total_size_bytes / (1024 * 1024), 2),
            "reference_photos": reference_photos
        }
    finally:
        db.close()

# Inicializar diretórios quando o módulo for importado
ensure_directories() 