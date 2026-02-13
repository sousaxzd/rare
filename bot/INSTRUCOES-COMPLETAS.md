# 📚 Instruções Completas - Bot Discord Rare

## 🎯 O que o Bot Faz?

Este bot permite gerenciar os cards de usuários que aparecem na página inicial do site através de comandos do Discord. Quando você usa um comando, o bot:

1. Modifica o arquivo `components/home/founders-section.tsx`
2. Adiciona ou remove o ID do usuário
3. Faz commit automático no git
4. Faz push para o repositório
5. O site é atualizado automaticamente

## 📋 Pré-requisitos

- Node.js instalado
- Git configurado (user.name e user.email)
- Permissões de push no repositório
- Bot adicionado ao servidor Discord (ID: 1464288982627127358)

## 🚀 Como Iniciar

### Primeira vez:
```bash
cd bot
npm install
npm start
```

### Próximas vezes:
```bash
cd bot
npm start
```

Ou simplesmente clique duas vezes em `start.bat` (Windows)

## 💬 Comandos Disponíveis

### 1. Adicionar Card de Usuário
```
/add_card_rare iduser:274968360306081794
```

**O que acontece:**
- ✅ Verifica se o ID é válido
- ✅ Verifica se o ID já não existe
- ✅ Adiciona o ID ao arquivo
- ✅ Faz commit: "feat: adicionar card de usuário [ID]"
- ✅ Faz push para o repositório
- ✅ Confirma no Discord

### 2. Remover Card de Usuário
```
/remove_card_rare id:274968360306081794
```

**O que acontece:**
- ✅ Verifica se o ID existe
- ✅ Remove o ID do arquivo
- ✅ Faz commit: "feat: remover card de usuário [ID]"
- ✅ Faz push para o repositório
- ✅ Confirma no Discord

## 🔍 Como Pegar o ID de um Usuário

1. No Discord, vá em **Configurações** → **Avançado**
2. Ative o **Modo Desenvolvedor**
3. Clique com botão direito no usuário
4. Clique em **Copiar ID**

## 📊 Status do Bot

Quando o bot está rodando, você verá:
```
✅ Bot conectado como [Nome do Bot]
🎮 Comandos disponíveis:
   /add_card_rare iduser:<ID>
   /remove_card_rare id:<ID>
```

## 🛠️ Testar Antes de Usar

Para testar se tudo está funcionando:
```bash
cd bot
node test-bot.js
```

Isso vai mostrar todos os IDs atualmente cadastrados.

## ⚙️ Configuração Técnica

- **Token:** Configurado via arquivo `.env` (não commitado no git)
- **Client ID:** 1464378642871357624
- **Guild ID:** 1464288982627127358
- **Arquivo modificado:** `components/home/founders-section.tsx`

### Configurar o Token:

1. Crie um arquivo `.env` na pasta `bot/`
2. Adicione:
```
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=1464378642871357624
DISCORD_GUILD_ID=1464288982627127358
```

## 🐛 Solução de Problemas

### Bot não inicia
```bash
cd bot
npm install
npm start
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

### Erro de permissão no git
- Verifique se você tem permissões de push
- Verifique se o git está autenticado

## 📝 Exemplo de Uso Completo

1. **Iniciar o bot:**
   ```bash
   cd bot
   npm start
   ```

2. **No Discord, adicionar um usuário:**
   ```
   /add_card_rare iduser:1234567890
   ```

3. **Bot responde:**
   ```
   ✅ Card do usuário `1234567890` adicionado com sucesso!
   📝 Commit realizado e enviado para o repositório.
   🌐 O site será atualizado em breve.
   ```

4. **Verificar no site:**
   - Aguarde alguns minutos
   - Recarregue a página inicial
   - O novo card aparecerá

## 🔒 Segurança

- O token está hardcoded no arquivo (considere usar variáveis de ambiente em produção)
- Apenas usuários com permissões no servidor podem usar os comandos
- O bot valida todos os inputs antes de modificar arquivos

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs do bot no terminal
2. Execute `node test-bot.js` para testar
3. Verifique se o git está configurado corretamente
4. Certifique-se de que o bot está online

## 🎉 Pronto!

Agora você pode gerenciar os cards de usuários diretamente do Discord!
