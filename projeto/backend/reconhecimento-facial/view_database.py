#!/usr/bin/env python3
"""
Script para visualizar o conteúdo do banco de dados SQLite
"""

from database import SessionLocal, User
import os

def view_database():
    """Visualiza o conteúdo do banco de dados"""
    print("🗄️ VISUALIZANDO BANCO DE DADOS SQLITE")
    print("=" * 50)
    
    # Verificar se o arquivo existe
    if not os.path.exists("midiaz.db"):
        print("❌ Arquivo midiaz.db não encontrado")
        return
    
    # Informações do arquivo
    file_size = os.path.getsize("midiaz.db")
    print(f"📁 Arquivo: midiaz.db")
    print(f"📊 Tamanho: {file_size} bytes ({file_size/1024:.1f} KB)")
    
    try:
        db = SessionLocal()
        
        # Contar usuários
        total_users = db.query(User).count()
        print(f"\n👥 Total de usuários: {total_users}")
        
        if total_users > 0:
            print("\n📋 Lista de usuários:")
            print("-" * 50)
            
            users = db.query(User).all()
            for i, user in enumerate(users, 1):
                print(f"\n{i}. 📧 {user.email}")
                print(f"   👤 Nome: {user.name}")
                print(f"   🆔 ID: {user.id}")
                print(f"   📱 CPF: {user.cpf}")
                print(f"   📞 Telefone: {user.phone}")
                print(f"   🏷️ Tipo: {user.user_type}")
                print(f"   🖼️ Avatar: {user.avatar}")
                print(f"   🔐 Senha hashada: {user.password_hash[:20]}...")
        
        # Estatísticas por tipo
        print(f"\n📈 Estatísticas por tipo:")
        consumer_count = db.query(User).filter(User.user_type == "consumer").count()
        photographer_count = db.query(User).filter(User.user_type == "photographer").count()
        admin_count = db.query(User).filter(User.user_type == "admin").count()
        
        print(f"   👤 Consumidores: {consumer_count}")
        print(f"   📸 Fotógrafos: {photographer_count}")
        print(f"   👨‍💼 Admins: {admin_count}")
        
        db.close()
        print(f"\n✅ Banco visualizado com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro ao visualizar banco: {e}")

if __name__ == "__main__":
    view_database() 