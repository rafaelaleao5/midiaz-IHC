import jwt
import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os
from database import SessionLocal, User

# Configurações de JWT
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "midiaz-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica se a senha está correta"""
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

def get_user(email: str) -> Optional[Dict[str, Any]]:
    """Busca usuário por email no banco de dados"""
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            return {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "cpf": user.cpf,
                "phone": user.phone,
                "password_hash": user.password_hash,
                "type": user.user_type,
                "avatar": user.avatar
            }
        return None
    finally:
        db.close()

def authenticate_user(email: str, password: str) -> Optional[Dict[str, Any]]:
    """Autentica usuário com email e senha"""
    user = get_user(email)
    if not user:
        return None
    if not verify_password(password, user["password_hash"]):
        return None
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Cria token JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verifica e decodifica token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return get_user(email)
    except jwt.PyJWTError:
        return None

def create_user(name: str, email: str, password: str, user_type: str, cpf: str, phone: str) -> Dict[str, Any]:
    """Cria novo usuário no banco de dados"""
    db = SessionLocal()
    try:
        # Verificar se email já existe
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            raise ValueError("Email já cadastrado")
        
        # Verificar se CPF já existe
        existing_cpf = db.query(User).filter(User.cpf == cpf).first()
        if existing_cpf:
            raise ValueError("CPF já cadastrado")
        
        # Criar hash da senha
        password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        
        # Criar novo usuário
        new_user = User(
            name=name,
            email=email,
            cpf=cpf,
            phone=phone,
            password_hash=password_hash,
            user_type=user_type
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Retornar dados do usuário criado
        return {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "cpf": new_user.cpf,
            "phone": new_user.phone,
            "password_hash": new_user.password_hash,
            "type": new_user.user_type,
            "avatar": new_user.avatar
        }
        
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

# Manter dados mock para compatibilidade (será removido depois)
users_db = {
    "admin@midiaz.com": {
        "id": "admin-1",
        "name": "Admin Midiaz",
        "email": "admin@midiaz.com",
        "cpf": "123.456.789-00",
        "phone": "(11) 99999-9999",
        "password_hash": bcrypt.hashpw("senha123".encode(), bcrypt.gensalt()).decode(),
        "type": "admin",
        "avatar": "/placeholder.svg?height=80&width=80"
    },
    "fotografo@midiaz.com": {
        "id": "photographer-1", 
        "name": "João Silva",
        "email": "fotografo@midiaz.com",
        "cpf": "987.654.321-00",
        "phone": "(11) 88888-8888",
        "password_hash": bcrypt.hashpw("senha123".encode(), bcrypt.gensalt()).decode(),
        "type": "photographer",
        "avatar": "/placeholder.svg?height=80&width=80"
    }
} 