# Sistema de Reconhecimento Facial - Backend Python

Este é o backend Python que fornece APIs para reconhecimento facial integrado à aplicação Next.js.

## 🚀 Funcionalidades

- **Registro de Rostos**: Cadastra fotos de referência dos usuários
- **Detecção em Lote**: Processa múltiplas fotos de eventos
- **Busca Inteligente**: Encontra fotos onde usuários específicos aparecem
- **API REST**: Interface completa para integração com frontend

## 📋 Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)
- Sistema operacional: Linux, macOS ou Windows

### Dependências do Sistema (Linux)

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3-dev python3-pip
sudo apt-get install cmake
sudo apt-get install libopenblas-dev liblapack-dev
sudo apt-get install libx11-dev libgtk-3-dev
sudo apt-get install libboost-python-dev

# CentOS/RHEL/Fedora
sudo yum install python3-devel
sudo yum install cmake
sudo yum install openblas-devel lapack-devel
sudo yum install libX11-devel gtk3-devel
sudo yum install boost-devel
```

## 🛠️ Instalação

### 1. Configuração Automática (Recomendado)

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### 2. Configuração Manual

```bash
# Criar ambiente virtual
python3 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate     # Windows

# Instalar dependências
pip install --upgrade pip
pip install -r requirements.txt
```

## 🚀 Executando a API

```bash
cd backend
source venv/bin/activate
python main.py
```

A API estará disponível em: **http://localhost:8000**

## 📖 Documentação da API

Acesse a documentação interativa em: **http://localhost:8000/docs**

### Endpoints Principais

#### 1. Registrar Rosto do Usuário
```
POST /api/register-face
```
- **Parâmetros**: `user_id` (string), `file` (imagem)
- **Retorna**: Confirmação do registro

#### 2. Detectar Rostos em Fotos
```
POST /api/detect-faces
```
- **Parâmetros**: `event_id` (string), `files` (array de imagens)
- **Retorna**: Resultados da detecção para cada foto

#### 3. Buscar Fotos do Usuário
```
GET /api/search-user-photos/{user_id}
```
- **Parâmetros**: `user_id` (path), `event_id` (query, opcional)
- **Retorna**: Lista de fotos onde o usuário aparece

#### 4. Estatísticas do Sistema
```
GET /api/stats
```
- **Retorna**: Estatísticas gerais do sistema

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend`:

```env
# Configurações da API
API_HOST=0.0.0.0
API_PORT=8000

# Configurações de CORS (frontend)
FRONTEND_URL=http://localhost:3000

# Configurações de armazenamento
UPLOAD_DIR=uploads
REFERENCE_DIR=reference_faces

# Configurações de IA
FACE_RECOGNITION_TOLERANCE=0.6
```

### Configurações de Performance

No arquivo `main.py`, você pode ajustar:

```python
# Tolerância para reconhecimento facial (0.0 = muito restritivo, 1.0 = muito permissivo)
FACE_RECOGNITION_TOLERANCE = 0.6

# Número máximo de rostos por foto
MAX_FACES_PER_PHOTO = 10

# Tamanho máximo do arquivo (em bytes)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
```

## 🧪 Testando a API

### Teste Básico

```bash
# Verificar se a API está rodando
curl http://localhost:8000/

# Verificar estatísticas
curl http://localhost:8000/api/stats
```

### Teste com Python

```python
import requests

# Teste de registro de rosto
with open('test_face.jpg', 'rb') as f:
    files = {'file': f}
    data = {'user_id': 'test_user_123'}
    response = requests.post('http://localhost:8000/api/register-face', files=files, data=data)
    print(response.json())
```

## 🔍 Solução de Problemas

### Erro: "No module named 'face_recognition'"

```bash
# Reinstalar face_recognition
pip uninstall face_recognition
pip install face_recognition
```

### Erro: "dlib not found"

```bash
# Instalar dlib primeiro
pip install dlib
pip install face_recognition
```

### Erro: "Permission denied" no Linux

```bash
# Dar permissões de execução
chmod +x setup.sh
```

### Performance Lenta

1. **Reduzir qualidade das imagens** antes do envio
2. **Ajustar tolerância** de reconhecimento
3. **Usar GPU** (se disponível) com CUDA

## 📊 Monitoramento

### Logs

A API gera logs automáticos. Para logs mais detalhados:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Métricas

Acesse `/api/stats` para métricas em tempo real:

```json
{
  "total_users_registered": 150,
  "total_photos_processed": 1250,
  "total_detections": 3400
}
```

## 🔒 Segurança

### Recomendações para Produção

1. **Autenticação**: Implementar JWT ou OAuth2
2. **HTTPS**: Usar certificados SSL
3. **Rate Limiting**: Limitar requisições por IP
4. **Validação**: Validar tipos de arquivo e tamanhos
5. **Backup**: Fazer backup regular dos dados

### Exemplo de Middleware de Segurança

```python
from fastapi import HTTPException, Request
import time

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Implementar rate limiting aqui
    response = await call_next(request)
    return response
```

## 🤝 Integração com Frontend

O frontend Next.js já está configurado para se comunicar com esta API através do serviço `FaceRecognitionService`.

### Configuração no Frontend

```typescript
// lib/face-recognition-service.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

### Variável de Ambiente

No arquivo `.env.local` do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📈 Próximos Passos

1. **Banco de Dados**: Migrar para PostgreSQL
2. **Cache**: Implementar Redis para performance
3. **Queue**: Usar Celery para processamento assíncrono
4. **Docker**: Containerizar a aplicação
5. **ML Pipeline**: Implementar treinamento contínuo

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique os logs da API
2. Consulte a documentação em `/docs`
3. Teste com imagens de exemplo
4. Verifique a conectividade entre frontend e backend 