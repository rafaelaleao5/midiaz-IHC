#!/usr/bin/env python3
"""
Script para verificar arquivos de upload salvos
"""

import os
import json
from datetime import datetime

def check_uploads():
    """Verifica arquivos de upload salvos"""
    
    # Diretórios onde as fotos são salvas
    upload_dirs = [
        "midiaz_uploads",
        "midiaz_reference_faces"
    ]
    
    print("🔍 VERIFICANDO ARQUIVOS DE UPLOAD")
    print("=" * 50)
    
    for dir_name in upload_dirs:
        if os.path.exists(dir_name):
            files = os.listdir(dir_name)
            print(f"\n📁 Diretório: {dir_name}")
            print(f"📊 Total de arquivos: {len(files)}")
            
            if files:
                print("📋 Arquivos encontrados:")
                for file in files:
                    file_path = os.path.join(dir_name, file)
                    file_size = os.path.getsize(file_path)
                    file_date = datetime.fromtimestamp(os.path.getctime(file_path))
                    
                    print(f"  • {file}")
                    print(f"    Tamanho: {file_size} bytes")
                    print(f"    Data: {file_date.strftime('%d/%m/%Y %H:%M:%S')}")
            else:
                print("  ❌ Nenhum arquivo encontrado")
        else:
            print(f"\n📁 Diretório: {dir_name}")
            print("  ❌ Diretório não existe")
    
    # Verificar banco de dados simulado
    print("\n" + "=" * 50)
    print("🗄️ BANCO DE DADOS SIMULADO")
    print("=" * 50)
    
    try:
        from auth import users_db
        print(f"👥 Total de usuários: {len(users_db)}")
        
        for email, user in users_db.items():
            print(f"\n📧 Email: {email}")
            print(f"   Nome: {user['name']}")
            print(f"   ID: {user['id']}")
            print(f"   Tipo: {user['type']}")
            print(f"   CPF: {user.get('cpf', 'N/A')}")
            print(f"   Telefone: {user.get('phone', 'N/A')}")
    except ImportError:
        print("❌ Não foi possível acessar o banco de dados simulado")

if __name__ == "__main__":
    check_uploads() 