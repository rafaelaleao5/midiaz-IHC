#!/usr/bin/env python3
"""
Script para testar a integração entre o frontend Next.js e o backend Python
"""

import requests
import os
from PIL import Image

# Configurações
API_BASE_URL = "http://localhost:8000"
TEST_USER_ID = "test_user_123"
TEST_EVENT_ID = "test_event_456"

def create_test_image():
    """Cria uma imagem de teste simples"""
    # Criar uma imagem 200x200 com um quadrado colorido
    img = Image.new('RGB', (200, 200), color='red')
    
    # Salvar temporariamente
    test_image_path = "test_image.jpg"
    img.save(test_image_path)
    return test_image_path

def test_api_health():
    """Testa se a API está funcionando"""
    print("🔍 Testando saúde da API...")
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            print("✅ API está funcionando!")
            return True
        else:
            print(f"❌ API retornou status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar à API. Verifique se ela está rodando em http://localhost:8000")
        return False

def test_register_face():
    """Testa o registro de rosto"""
    print("\n📸 Testando registro de rosto...")
    
    # Criar imagem de teste
    test_image_path = create_test_image()
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'file': f}
            data = {'user_id': TEST_USER_ID}
            
            response = requests.post(f"{API_BASE_URL}/api/register-face", files=files, data=data)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Rosto registrado com sucesso!")
                print(f"   Resultado: {result}")
                return True
            else:
                print(f"❌ Erro no registro: {response.status_code}")
                print(f"   Resposta: {response.text}")
                return False
                
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        return False
    finally:
        # Limpar arquivo temporário
        if os.path.exists(test_image_path):
            os.remove(test_image_path)

def test_detect_faces():
    """Testa a detecção de rostos"""
    print("\n🔍 Testando detecção de rostos...")
    
    # Criar algumas imagens de teste
    test_images = []
    for i in range(3):
        img = Image.new('RGB', (300, 300), color=f'rgb({i*100}, {i*50}, {i*75})')
        path = f"test_image_{i}.jpg"
        img.save(path)
        test_images.append(path)
    
    try:
        files = []
        for path in test_images:
            files.append(('files', open(path, 'rb')))
        
        data = {'event_id': TEST_EVENT_ID}
        
        response = requests.post(f"{API_BASE_URL}/api/detect-faces", files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Detecção de rostos funcionando!")
            print(f"   Fotos processadas: {result.get('total_photos_processed', 0)}")
            return True
        else:
            print(f"❌ Erro na detecção: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        return False
    finally:
        # Limpar arquivos temporários
        for path in test_images:
            if os.path.exists(path):
                os.remove(path)

def test_search_user_photos():
    """Testa a busca de fotos do usuário"""
    print("\n🔎 Testando busca de fotos do usuário...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/search-user-photos/{TEST_USER_ID}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Busca de fotos funcionando!")
            print(f"   Fotos encontradas: {result.get('photos_found', 0)}")
            return True
        else:
            print(f"❌ Erro na busca: {response.status_code}")
            print(f"   Resposta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        return False

def test_stats():
    """Testa as estatísticas da API"""
    print("\n📊 Testando estatísticas...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/stats")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Estatísticas funcionando!")
            print(f"   Usuários registrados: {result.get('total_users_registered', 0)}")
            print(f"   Fotos processadas: {result.get('total_photos_processed', 0)}")
            print(f"   Detecções totais: {result.get('total_detections', 0)}")
            return True
        else:
            print(f"❌ Erro nas estatísticas: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Erro durante o teste: {e}")
        return False

def test_frontend_integration():
    """Simula chamadas do frontend"""
    print("\n🌐 Testando integração com frontend...")
    
    # Simular chamada do FaceRecognitionService
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    try:
        # Teste de health check
        response = requests.get(f"{API_BASE_URL}/", headers=headers)
        if response.status_code == 200:
            print("✅ Health check funcionando!")
        else:
            print("❌ Health check falhou")
            return False
        
        # Teste de CORS
        response = requests.options(f"{API_BASE_URL}/api/stats", headers=headers)
        if response.status_code in [200, 204]:
            print("✅ CORS configurado corretamente!")
        else:
            print("❌ CORS pode ter problemas")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na integração: {e}")
        return False

def main():
    """Executa todos os testes"""
    print("🚀 Iniciando testes de integração...")
    print("=" * 50)
    
    tests = [
        ("Saúde da API", test_api_health),
        ("Registro de Rosto", test_register_face),
        ("Detecção de Rostos", test_detect_faces),
        ("Busca de Fotos", test_search_user_photos),
        ("Estatísticas", test_stats),
        ("Integração Frontend", test_frontend_integration),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ Erro inesperado em {test_name}: {e}")
            results.append((test_name, False))
    
    # Resumo dos resultados
    print("\n" + "=" * 50)
    print("📋 RESUMO DOS TESTES")
    print("=" * 50)
    
    passed = 0
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"{test_name}: {status}")
        if success:
            passed += 1
    
    print(f"\n🎯 Resultado: {passed}/{total} testes passaram")
    
    if passed == total:
        print("🎉 Todos os testes passaram! A integração está funcionando perfeitamente.")
    elif passed > total / 2:
        print("⚠️  Alguns testes falharam, mas a integração básica está funcionando.")
    else:
        print("❌ Muitos testes falharam. Verifique a configuração da API.")
    
    print("\n💡 Próximos passos:")
    print("1. Inicie o frontend: npm run dev")
    print("2. Teste o registro de usuário")
    print("3. Teste o upload de fotos")
    print("4. Teste a busca por reconhecimento facial")

if __name__ == "__main__":
    main() 