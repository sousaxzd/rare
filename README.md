# Vision Wallet Frontend

Frontend Next.js para o Vision Wallet.

## 🚀 Instalação

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env.local` na raiz do frontend com as seguintes variáveis:

```env
# URL do Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

**Importante**: Em produção, altere para a URL do seu backend em produção.

## 📦 Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start
```

## 🔗 Integração com Backend

O frontend está configurado para se comunicar com o backend através da variável `NEXT_PUBLIC_BACKEND_URL`.

### Estrutura de API

- **Configuração**: `lib/api.ts` - Funções genéricas para requisições HTTP
- **Autenticação**: `lib/auth.ts` - Funções específicas de autenticação

### Fluxo de Autenticação

1. **Cadastro**: Usuário preenche formulário → API cria conta → Redireciona para login
2. **Login**: 
   - Usuário insere e-mail e senha
   - Sistema solicita código por e-mail
   - Usuário insere código de 6 dígitos
   - Sistema valida código e retorna token JWT
   - Token é salvo no localStorage

### Endpoints Utilizados

- `POST /api/auth/signup` - Cadastro
- `POST /api/auth/login/request-code` - Solicitar código
- `POST /api/auth/login/verify-code` - Verificar código e fazer login
- `GET /api/auth/me` - Obter dados do usuário autenticado
- `POST /api/auth/logout` - Logout

## 📝 Estrutura

```
frontend/
├── app/              # Rotas Next.js (App Router)
│   ├── login/       # Página de login
│   └── signup/      # Página de cadastro
├── components/       # Componentes React
├── lib/             # Utilitários e configurações
│   ├── api.ts       # Configuração da API
│   └── auth.ts      # Funções de autenticação
└── config/          # Configurações
```

