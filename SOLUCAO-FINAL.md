# 🎯 Solução Final - Bot Discord + Vercel

## 📋 Arquitetura

O bot Discord agora funciona em **duas partes**:

1. **API no Vercel** (`/api/bot`) - Gerencia os arquivos
2. **Bot Standalone** (`bot/discord-bot-api.js`) - Roda localmente e se comunica com a API

## 🚀 Como Funciona

```
Discord → Bot Local → API Vercel → Modifica Arquivo → Vercel Redeploy
```

## ⚙️ Configuração

### 1. Configurar Vercel

Adicione no painel do Vercel (Settings → Environment Variables):

```
API_SECRET_KEY=sua_chave_secreta_aqui
```

### 2. Configurar Bot Local

Crie o arquivo `bot/.env`:

```env
DISCORD_TOKEN=seu_token_discord
DISCORD_CLIENT_ID=1464378642871357624
DISCORD_GUILD_ID=1464288982627127358
API_URL=https://seu-site.vercel.app
API_SECRET_KEY=mesma_chave_do_vercel
```

### 3. Iniciar o Bot

```bash
cd bot
npm install
node discord-bot-api.js
```

## 💬 Comandos Discord

### Adicionar Usuário
```
/add_card_rare iduser:1234567890
```

### Remover Usuário
```
/remove_card_rare id:1234567890
```

## 🔄 Fluxo Completo

1. Usuário usa comando no Discord
2. Bot local recebe o comando
3. Bot faz requisição POST para `/api/bot`
4. API valida a chave secreta
5. API modifica o arquivo `founders-section.tsx`
6. Vercel detecta mudança e faz redeploy
7. Site atualizado com novo card

## 🌐 API Endpoints

### GET /api/bot
Lista todos os usuários atuais.

**Resposta:**
```json
{
  "success": true,
  "totalUsers": 10,
  "users": ["274968360306081794", "..."]
}
```

### POST /api/bot
Adiciona ou remove usuários.

**Adicionar:**
```json
{
  "action": "add",
  "userId": "1234567890",
  "apiKey": "sua_chave_secreta"
}
```

**Remover:**
```json
{
  "action": "remove",
  "userId": "1234567890",
  "apiKey": "sua_chave_secreta"
}
```

## 🔒 Segurança

- API protegida por chave secreta
- Token do Discord não está no código
- Validação de IDs
- Não permite remover todos os usuários

## ✅ Vantagens desta Solução

1. ✅ Funciona no Vercel (sem limitações serverless)
2. ✅ Bot roda localmente (sempre online)
3. ✅ API simples e segura
4. ✅ Não precisa de git no Vercel
5. ✅ Atualização automática do site

## 🐛 Troubleshooting

### Bot não conecta
```bash
# Verificar variáveis de ambiente
cat bot/.env

# Testar conexão
node discord-bot-api.js
```

### API retorna erro 401
- Verifique se a `API_SECRET_KEY` é a mesma no bot e no Vercel

### Comandos não aparecem
- Aguarde 1-2 minutos
- Reinicie o Discord

## 📝 Checklist

- [ ] Variável `API_SECRET_KEY` configurada no Vercel
- [ ] Arquivo `bot/.env` criado e configurado
- [ ] Bot iniciado com `node discord-bot-api.js`
- [ ] Comandos testados no Discord
- [ ] Site atualizado corretamente

## 🎉 Pronto!

Agora o bot funciona perfeitamente com o Vercel!
