# 🔧 Configuração do Bot Discord

## ⚠️ IMPORTANTE: Configuração de Segurança

O token do Discord NÃO está mais no código por segurança. Você precisa configurá-lo manualmente.

## 📝 Passo a Passo

### 1. Criar arquivo .env

Na pasta `bot/`, crie um arquivo chamado `.env` (sem extensão antes do ponto)

### 2. Adicionar as credenciais

Copie e cole no arquivo `.env`:

```env
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=1464378642871357624
DISCORD_GUILD_ID=1464288982627127358
```

### 3. Salvar o arquivo

Salve o arquivo `.env` na pasta `bot/`

### 4. Instalar dependências

```bash
cd bot
npm install
```

### 5. Iniciar o bot

```bash
npm start
```

## ✅ Verificação

Se tudo estiver correto, você verá:

```
🔄 Registrando comandos slash...
✅ Comandos registrados com sucesso!
✅ Bot conectado como [Nome do Bot]
🎮 Comandos disponíveis:
   /add_card_rare iduser:<ID>
   /remove_card_rare id:<ID>
```

## 🔒 Segurança

- O arquivo `.env` está no `.gitignore` e NÃO será commitado
- Nunca compartilhe seu token do Discord
- Se o token vazar, regenere-o no Discord Developer Portal

## 🐛 Problemas?

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "TOKEN is undefined"
- Verifique se o arquivo `.env` existe na pasta `bot/`
- Verifique se o arquivo tem o formato correto
- Certifique-se de que não há espaços extras

### Bot não conecta
- Verifique se o token está correto
- Verifique se o bot está adicionado ao servidor
- Verifique sua conexão com a internet

## 📂 Estrutura de Arquivos

```
bot/
├── .env                    ← VOCÊ PRECISA CRIAR ESTE ARQUIVO
├── .env.example           ← Exemplo de como deve ser
├── discord-bot.js         ← Código principal
├── package.json
└── ...
```

## 🎯 Pronto!

Após configurar o `.env`, o bot estará pronto para uso!
