# 🚀 Guia Rápido - Bot Discord Rare

## Como Iniciar o Bot

### Opção 1: Usando o arquivo .bat (Windows)
Simplesmente clique duas vezes no arquivo `start.bat`

### Opção 2: Via terminal
```bash
cd bot
npm start
```

## 📱 Como Usar os Comandos no Discord

### Adicionar um Card de Usuário
```
/add_card_rare iduser:1234567890
```
- Substitua `1234567890` pelo ID do usuário do Discord
- O bot vai adicionar o ID no arquivo e fazer commit automaticamente

### Remover um Card de Usuário
```
/remove_card_rare id:1234567890
```
- Substitua `1234567890` pelo ID do usuário que deseja remover
- O bot vai remover o ID do arquivo e fazer commit automaticamente

## 🔍 Como Pegar o ID de um Usuário no Discord

1. Ative o Modo Desenvolvedor no Discord:
   - Configurações → Avançado → Modo Desenvolvedor (ativar)

2. Clique com botão direito no usuário
3. Clique em "Copiar ID"

## ✅ O que o Bot Faz Automaticamente

1. ✏️ Edita o arquivo `components/home/founders-section.tsx`
2. 💾 Salva as alterações
3. 📦 Executa `git add .`
4. 📝 Executa `git commit -m "mensagem"`
5. 🚀 Executa `git push`
6. 🌐 O site é atualizado automaticamente

## ⚠️ Importante

- O bot precisa estar rodando para os comandos funcionarem
- Certifique-se de que o git está configurado corretamente
- Os comandos só funcionam no servidor: **1464288982627127358**

## 🐛 Problemas Comuns

### "Erro ao fazer commit"
- Verifique se você tem permissões de push no repositório
- Certifique-se de que o git está configurado (git config user.name e user.email)

### "Comandos não aparecem no Discord"
- Aguarde alguns minutos, os comandos podem demorar para sincronizar
- Reinicie o Discord

### "Bot não responde"
- Verifique se o bot está online (rodando)
- Verifique se você está no servidor correto
