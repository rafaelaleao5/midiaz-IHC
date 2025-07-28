#!/usr/bin/env python3
"""
Script para inicializar o banco de dados SQLite
"""

from database import create_tables, SessionLocal, User
from auth import users_db
import bcrypt

def init_database():
    """Inicializa o banco de dados e migra dados do mock"""
    print("🗄️ INICIALIZANDO BANCO DE DADOS SQLITE")
    print("=" * 50)
    
    try:
        # Criar tabelas
        create_tables()
        print("✅ Tabelas criadas com sucesso")
        
        # Migrar dados do mock
        db = SessionLocal()
        
        # Contar usuários existentes
        existing_users = db.query(User).count()
        print(f"📊 Usuários existentes no banco: {existing_users}")
        
        if existing_users == 0:
            # Inserir usuários do mock
            for email, user_data in users_db.items():
                new_user = User(
                    name=user_data['name'],
                    email=user_data['email'],
                    cpf=user_data['cpf'],
                    phone=user_data['phone'],
                    password_hash=user_data['password_hash'],
                    user_type=user_data['type']
                )
                db.add(new_user)
                print(f"✅ Usuário '{user_data['name']}' migrado")
            
            db.commit()
            print("✅ Migração de dados concluída")
        else:
            print("⚠️ Banco já possui dados, pulando migração")
        
        # Mostrar estatísticas
        total_users = db.query(User).count()
        print(f"\n📈 Estatísticas do banco:")
        print(f"   👥 Total de usuários: {total_users}")
        
        # Mostrar usuários
        users = db.query(User).all()
        for user in users:
            print(f"   📧 {user.email} ({user.name}) - {user.user_type}")
        
        db.close()
        print("\n🎉 Banco de dados inicializado com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao inicializar banco: {e}")
        db.rollback()
        db.close()

if __name__ == "__main__":
    init_database() 