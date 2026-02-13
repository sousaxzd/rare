# 🚀 Configuração do Bot Discord no Vercel

## 📋 Variáveis de Ambiente no Vercel

Para o bot funcionar no Vercel, você precisa adicionar estas variáveis de ambiente:

### 1. Acesse o Painel do Vercel
- Vá para: https://vercel.com/seu-projeto/settings/environment-variables

### 2. Adicione as Variáveis

```
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=1464378642871357624
DISCORD_GUILD_ID=1464288982627127358
```

### 3. Selecione os Ambientes
- ✅ Production
- ✅ Preview
- ✅ Development

### 4. Salve e Redeploy

Após adicionar as variáveis, faça um novo deploy do projeto.

## 🔧 Como Funciona

1. **Inicialização Automática:**
   - O bot é inicializado automaticamente quando o site carrega
   - O componente `BotInitializer` faz uma requisição para `/api/bot`
   - A API route inicializa o bot e sincroniza os comandos

2. **Comandos Discord:**
   - `/add_card_rare iduser:<ID>` - Adiciona um card
   - `/remove_card_rare id:<ID>` - Remove um card

3. **Fluxo de Atualização:**
   ```
   Comando Discord → Bot processa → Modifica arquivo → Git commit/push → Vercel redeploy
   ```

## ⚠️ Limitações do Vercel

O Vercel tem algumas limitações para bots Discord:

1. **Serverless Functions:**
   - Timeout de 10 segundos (Hobby) ou 60 segundos (Pro)
   - O bot pode desconectar após inatividade

2. **Solução Alternativa:**
   - O bot se reconecta automaticamente quando alguém acessa o site
   - Para manter o bot sempre online, considere usar:
     - Railway.app
     - Render.com
     - Heroku
     - VPS próprio

## 🔄 Manter o Bot Online

### Opção 1: Ping Automático (Recomendado)
Adicione um serviço de ping como:
- UptimeRobot (https://uptimerobot.com)
- Cron-job.org (https://cron-job.org)

Configure para fazer ping em: `https://seu-site.vercel.app/api/bot` a cada 5 minutos

### Opção 2: Usar Railway/Render
Se precisar de um bot 24/7, considere hospedar o bot separadamente:

1. Crie um projeto no Railway/Render
2. Use o código da pasta `bot/`
3. Configure as variáveis de ambiente
4. O bot rodará independentemente do site

## 📝 Testando Localmente

```bash
npm run dev
```

O bot será inicializado automaticamente quando você acessar http://localhost:3000

## 🐛 Troubleshooting

### Bot não conecta
- Verifique se as variáveis de ambiente estão configuradas
- Verifique os logs no Vercel Dashboard
- Acesse `/api/bot` diretamente para ver o status

### Comandos não aparecem
- Aguarde 1-2 minutos para sincronização
- Reinicie o Discord
- Verifique se está no servidor correto (ID: 1464288982627127358)

### Erro de timeout
- Normal no Vercel após 10 segundos de inatividade
- O bot se reconectará na próxima requisição

## ✅ Verificação

Para verificar se o bot está funcionando:

1. Acesse: `https://seu-site.vercel.app/api/bot`
2. Você deve ver:
```json
{
  "success": true,
  "message": "Bot inicializado e comandos sincronizados com sucesso!",
  "commands": ["add_card_rare", "remove_card_rare"]
}
```

## 🎉 Pronto!

Agora o bot está integrado ao site e funcionará automaticamente no Vercel!
