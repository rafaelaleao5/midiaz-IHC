# Midiaz - Plataforma de Reconhecimento Facial

Plataforma web para venda e descoberta de fotos profissionais em eventos

## 🚀 Tecnologias

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **pnpm** - Gerenciador de pacotes

### Backend
- **FastAPI** - API Python
- **SQLite** - Banco de dados (desenvolvimento)
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **SQLAlchemy** - ORM

## 📁 Estrutura do Projeto

```
midiaz/
├── projeto/                    # Frontend Next.js
│   ├── app/                   # Páginas da aplicação
│   ├── components/            # Componentes React
│   ├── contexts/              # Contextos (Auth, Cart)
│   ├── lib/                   # Serviços (Auth, Face Recognition)
│   ├── hooks/                 # Hooks customizados
│   └── public/                # Assets estáticos
└── projeto/backend/reconhecimento-facial/  # Backend Python
    ├── main_simple.py         # API FastAPI
    ├── auth.py               # Autenticação JWT
    ├── database.py           # Modelos SQLAlchemy
    ├── file_upload.py        # Upload de arquivos
    ├── requirements_simple.txt # Dependências Python
    └── midiaz.db            # Banco SQLite
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js 18+
- Python 3.8+
- pnpm

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd midiaz
```

### 2. Instale as dependências do Frontend
```bash
cd projeto
pnpm install
```

### 3. Instale as dependências do Backend
```bash
cd backend/reconhecimento-facial
pip3 install -r requirements_simple.txt
```

### 4. Inicialize o banco de dados
```bash
python3 init_db.py
```

## 🚀 Executando o Projeto

### 1. Inicie o Backend (Terminal 1)
```bash
cd projeto/backend/reconhecimento-facial
python3 main_simple.py
```
O backend estará disponível em: http://localhost:8000

### 2. Inicie o Frontend (Terminal 2)
```bash
cd projeto
pnpm dev
```
O frontend estará disponível em: http://localhost:3000

## 📝 Funcionalidades Implementadas

### ✅ Autenticação
- Login com JWT
- Registro de usuários
- Diferentes tipos de usuário (consumer, photographer, admin)

### ✅ Upload de Fotos
- Upload de fotos normais
- Upload de fotos de referência para reconhecimento facial
- Armazenamento em sistema de arquivos
- Metadados salvos no banco SQLite

### ✅ Banco de Dados
- Modelos SQLAlchemy (User, Photo, FaceEncoding)
- Migração de dados mock
- Scripts de visualização e teste

### ✅ API Endpoints
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Informações do usuário
- `POST /api/upload-photo` - Upload de foto
- `POST /api/register-face` - Registro facial
- `GET /api/user/photos` - Listar fotos do usuário
- `GET /api/stats` - Estatísticas do sistema

## 🧪 Testando

### Teste de Upload de Fotos
```bash
cd projeto/backend/reconhecimento-facial
python3 test_photo_upload.py
```

### Visualizar Banco de Dados
```bash
python3 view_database.py
```

### Verificar Uploads
```bash
python3 check_uploads.py
```

## 📊 Dados de Teste

### Usuários Mock
- **Admin**: admin@midiaz.com / senha123
- **Fotógrafo**: fotografo@midiaz.com / senha123

## 🔧 Scripts Úteis

- `init_db.py` - Inicializa banco e migra dados mock
- `view_database.py` - Visualiza conteúdo do banco
- `check_uploads.py` - Verifica arquivos de upload
- `test_photo_upload.py` - Testa upload de fotos
- `test_integration.py` - Testa integração frontend/backend

## 🚀 Próximos Passos

- [ ] Implementar reconhecimento facial real (IA)
- [ ] Interface para upload de fotos no frontend
- [ ] Busca de fotos por pessoa
- [ ] Dashboard com estatísticas
- [ ] Migração para AWS (S3 + RDS)

## 📝 Notas

- O projeto usa SQLite para desenvolvimento
- Fotos são salvas em sistema de arquivos local
- Para produção, será migrado para AWS (S3 + PostgreSQL)
- Reconhecimento facial está simulado (será implementado com IA real)

## 🤝 Contribuição

1. Clone o repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request para a develop
