#!/usr/bin/env python3
"""
Script para testar o upload de fotos e verificar o banco de dados
"""

import requests
import os
from datetime import datetime

def test_photo_upload():
    """Testa o upload de fotos via API"""
    print("📸 TESTANDO UPLOAD DE FOTOS")
    print("=" * 50)
    
    # URL base da API
    base_url = "http://localhost:8000"
    
    # 1. Fazer login para obter token
    print("\n1️⃣ Fazendo login...")
    login_data = {
        "email": "admin@midiaz.com",
        "password": "senha123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/auth/login", data=login_data)
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
            user_id = token_data["user"]["id"]
            print(f"✅ Login realizado - User ID: {user_id}")
        else:
            print(f"❌ Erro no login: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Erro ao conectar com API: {e}")
        return
    
    # 2. Testar upload de foto
    print("\n2️⃣ Testando upload de foto...")
    
    # Criar um arquivo de teste (simulado)
    test_file_path = "test_photo.jpg"
    with open(test_file_path, "wb") as f:
        # Criar um arquivo JPEG simples
        f.write(b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x01\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x08\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00\x3f\x00\xaa\xff\xd9')
    
    try:
        with open(test_file_path, "rb") as f:
            files = {"file": ("test_photo.jpg", f, "image/jpeg")}
            headers = {"Authorization": f"Bearer {token}"}
            
            response = requests.post(f"{base_url}/api/upload-photo", files=files, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Upload realizado com sucesso!")
                print(f"   📁 Arquivo: {result['photo']['filename']}")
                print(f"   📊 Tamanho: {result['photo']['file_size']} bytes")
                print(f"   🆔 ID: {result['photo']['id']}")
            else:
                print(f"❌ Erro no upload: {response.status_code}")
                print(f"   Resposta: {response.text}")
                
    except Exception as e:
        print(f"❌ Erro ao fazer upload: {e}")
    finally:
        # Limpar arquivo de teste
        if os.path.exists(test_file_path):
            os.remove(test_file_path)
    
    # 3. Buscar fotos do usuário
    print("\n3️⃣ Buscando fotos do usuário...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{base_url}/api/user/photos", headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            photos = result["photos"]
            print(f"✅ Encontradas {len(photos)} fotos:")
            
            for photo in photos:
                print(f"   📸 ID: {photo['id']}")
                print(f"      📁 Arquivo: {photo['filename']}")
                print(f"      📊 Tamanho: {photo['file_size']} bytes")
                print(f"      🔍 Face detectada: {photo['face_detected']}")
                print(f"      📅 Criada em: {photo['created_at']}")
                print()
        else:
            print(f"❌ Erro ao buscar fotos: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao buscar fotos: {e}")
    
    # 4. Verificar estatísticas
    print("\n4️⃣ Verificando estatísticas...")
    try:
        response = requests.get(f"{base_url}/api/stats")
        
        if response.status_code == 200:
            stats = response.json()
            print("✅ Estatísticas do sistema:")
            print(f"   👥 Usuários: {stats['users']['total']}")
            print(f"   📸 Fotos: {stats['photos']['total_photos']}")
            print(f"   💾 Tamanho total: {stats['photos']['total_size_mb']} MB")
            print(f"   🔍 Fotos de referência: {stats['photos']['reference_photos']}")
        else:
            print(f"❌ Erro ao buscar estatísticas: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erro ao buscar estatísticas: {e}")
    
    print("\n🎉 Teste concluído!")

if __name__ == "__main__":
    test_photo_upload() 