# Projetao

## Como rodar o projeto

### 1. **Instalar as dependências**
Como o projeto usa `pnpm`, você precisa instalar as dependências primeiro:

```bash
pnpm install
```

Se você não tiver o `pnpm` instalado, pode instalá-lo com:
```bash
npm install -g pnpm
```

### 2. **Rodar o projeto em modo de desenvolvimento**
```bash
pnpm dev
```

### 3. **Acessar a aplicação**
Após executar o comando acima, a aplicação estará disponível em:
```
http://localhost:3000
```

## Scripts disponíveis

O `package.json` define os seguintes scripts:

- **`pnpm dev`** - Inicia o servidor de desenvolvimento
- **`pnpm build`** - Cria a build de produção
- **`pnpm start`** - Inicia o servidor de produção (após fazer build)
- **`pnpm lint`** - Executa o linter do código

## Resumo dos comandos

```bash
# 1. Instalar dependências
pnpm install

# 2. Rodar em desenvolvimento
pnpm dev

# 3. Acessar http://localhost:3000
```

## Sobre o projeto

Aplicação de galeria de fotos com funcionalidades para fotógrafos, eventos, carrinho de compras, desenvolvida com Next.js 15, React 19 e Tailwind CSS.