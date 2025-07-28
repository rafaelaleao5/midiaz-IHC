from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Configuração do banco de dados SQLite (mais simples para começar)
DATABASE_URL = "sqlite:///./midiaz.db"

# Criar engine do SQLAlchemy
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Criar sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()

# Modelo de Usuário
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    cpf = Column(String(14), unique=True, nullable=False)
    phone = Column(String(15), nullable=False)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(String(20), nullable=False)  # consumer, photographer, admin
    avatar = Column(String(255), default="/placeholder.svg?height=80&width=80")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relacionamento com fotos
    photos = relationship("Photo", back_populates="user")

# Modelo de Foto
class Photo(Base):
    __tablename__ = "photos"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    is_reference_photo = Column(Boolean, default=False)  # True se for foto de referência
    face_detected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relacionamento com usuário
    user = relationship("User", back_populates="photos")

# Modelo de Encoding Facial
class FaceEncoding(Base):
    __tablename__ = "face_encodings"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    photo_id = Column(Integer, ForeignKey("photos.id"), nullable=False)
    encoding_data = Column(Text, nullable=False)  # Dados do encoding em JSON
    confidence = Column(Integer, nullable=False)  # Confiança do reconhecimento (0-100)
    created_at = Column(DateTime, default=datetime.utcnow)

# Função para criar todas as tabelas
def create_tables():
    Base.metadata.create_all(bind=engine)

# Função para obter sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 