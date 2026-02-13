# 🤖 Bot Discord Integrado ao Site

## 🎯 O que foi feito?

O bot Discord agora está **integrado ao site Next.js** e roda automaticamente quando o site é acessado!

## 📁 Arquivos Criados/Modificados

### Novos Arquivos:
- `app/api/bot/route.ts` - API route que gerencia o bot
- `components/bot-initializer.tsx` - Componente que inicializa o bot
- `VERCEL-BOT-CONFIG.md` - Guia de configuração no Vercel

### Modificados:
- `app/layout.tsx` - Adicionado o BotInitializer
- `package.json` - Adicionado discord.js
- `.env.local` - Adicionadas variáveis do bot

## 🚀 Como Funciona

### 1. Inicialização Automática
Quando alguém acessa o site:
```
Usuário acessa site → BotInitializer carrega → Chama /api/bot → Bot conecta → Comandos sincronizados
```

### 2. Comandos Discord
No servidor Discord (ID: 1464288982627127358):

**Adicionar usuário:**
```
/add_card_rare iduser:1234567890
```

**Remover usuário:**
```
/remove_card_rare id:1234567890
```

### 3. Fluxo Completo
```
1. Usuário usa comando no Discord
2. Bot processa o comando
3. Modifica o arquivo founders-section.tsx
4. Faz git add, commit e push
5. Vercel detecta mudança e redeploy
6. Site atualizado com novo card
```

## 💻 Desenvolvimento Local

### 1. Instalar dependências:
```bash
npm install
```

### 2. Configurar .env.local:
Já está configurado! As variáveis já estão no arquivo.

### 3. Iniciar o servidor:
```bash
npm run dev
```

### 4. Testar:
- Acesse: http://localhost:3000
- O bot será inicializado automaticamente
- Use os comandos no Discord

## 🌐 Deploy no Vercel

### 1. Adicionar Variáveis de Ambiente

No painel do Vercel, adicione:

```
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=1464378642871357624
DISCORD_GUILD_ID=1464288982627127358
```

### 2. Deploy
```bash
git add .
git commit -m "feat: adicionar bot discord integrado"
git push
```

O Vercel fará o deploy automaticamente.

### 3. Verificar
Acesse: `https://seu-site.vercel.app/api/bot`

Deve retornar:
```json
{
  "success": true,
  "message": "Bot inicializado e comandos sincronizados com sucesso!",
  "commands": ["add_card_rare", "remove_card_rare"]
}
```

## 🔧 API Endpoints

### GET /api/bot
Inicializa o bot e sincroniza comandos.

**Resposta:**
```json
{
  "success": true,
  "message": "Bot inicializado e comandos sincronizados com sucesso!",
  "commands": ["add_card_rare", "remove_card_rare"]
}
```

### POST /api/bot
Gerencia usuários manualmente (opcional).

**Adicionar:**
```json
{
  "action": "add",
  "userId": "1234567890"
}
```

**Remover:**
```json
{
  "action": "remove",
  "userId": "1234567890"
}
```

## ⚠️ Importante

### Limitações do Vercel:
- Serverless functions têm timeout de 10-60 segundos
- O bot pode desconectar após inatividade
- Solução: O bot se reconecta quando alguém acessa o site

### Para Bot 24/7:
Se precisar que o bot fique online 24/7, considere:
1. **UptimeRobot** - Fazer ping a cada 5 minutos em `/api/bot`
2. **Railway/Render** - Hospedar o bot separadamente
3. **VPS** - Servidor próprio

## 🎮 Comandos Discord

### /add_card_rare
Adiciona um card de usuário na página inicial.

**Uso:**
```
/add_card_rare iduser:274968360306081794
```

**O que faz:**
1. ✅ Valida o ID
2. ✅ Verifica se já não existe
3. ✅ Adiciona ao arquivo
4. ✅ Faz commit e push
5. ✅ Confirma no Discord

### /remove_card_rare
Remove um card de usuário da página inicial.

**Uso:**
```
/remove_card_rare id:274968360306081794
```

**O que faz:**
1. ✅ Verifica se o ID existe
2. ✅ Remove do arquivo
3. ✅ Faz commit e push
4. ✅ Confirma no Discord

## 🐛 Troubleshooting

### Bot não conecta
```bash
# Verificar logs
npm run dev

# Acessar diretamente
curl http://localhost:3000/api/bot
```

### Comandos não aparecem
- Aguarde 1-2 minutos
- Reinicie o Discord
- Verifique se está no servidor correto

### Erro ao fazer commit
```bash
git config user.name "Seu Nome"
git config user.email "seu@email.com"
```

## 📊 Status do Bot

Para verificar o status do bot:

**Local:**
```
http://localhost:3000/api/bot
```

**Produção:**
```
https://seu-site.vercel.app/api/bot
```

## ✅ Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Git configurado (user.name e user.email)
- [ ] Bot adicionado ao servidor Discord
- [ ] Permissões de push no repositório
- [ ] Deploy realizado com sucesso
- [ ] Teste dos comandos no Discord

## 🎉 Pronto!

O bot está integrado ao site e funcionará automaticamente!

**Próximos passos:**
1. Faça o deploy no Vercel
2. Configure as variáveis de ambiente
3. Teste os comandos no Discord
4. Aproveite! 🚀
