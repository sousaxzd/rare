# Bot Discord - Gerenciador de Cards Rare

Bot Discord que gerencia automaticamente os cards de usuários na página inicial do site Rare.

## 🚀 Funcionalidades

- `/add_card_rare iduser:<ID>` - Adiciona um card de usuário na página Início
- `/remove_card_rare id:<ID>` - Remove um card de usuário da página Início

## 📦 Instalação

1. Entre na pasta do bot:
```bash
cd bot
```

2. Instale as dependências:
```bash
npm install
```

## ▶️ Executar o Bot

```bash
npm start
```

Ou para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 🔧 Como Funciona

1. O bot recebe um comando via Discord
2. Lê o arquivo `components/home/founders-section.tsx`
3. Adiciona ou remove o ID do usuário no array `FOUNDERS`
4. Salva o arquivo modificado
5. Executa `git add .`, `git commit` e `git push` automaticamente
6. O site é atualizado com as mudanças

## ⚙️ Configuração

1. Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione seu token do Discord:
```
DISCORD_TOKEN=seu_token_aqui
DISCORD_CLIENT_ID=1464378642871357624
DISCORD_GUILD_ID=1464288982627127358
```

O bot está configurado para:
- **Servidor:** 1464288982627127358
- **Token:** Configurado via arquivo .env (não commitado)
- **Client ID:** 1464378642871357624

## 📝 Notas

- Os comandos são sincronizados automaticamente no servidor especificado
- Apenas IDs numéricos válidos são aceitos
- Não é possível remover todos os usuários (deve haver pelo menos 1)
- O bot faz commit e push automático para o repositório git

## 🛡️ Permissões Necessárias

Certifique-se de que:
1. O bot tem permissões de administrador no servidor
2. O repositório git está configurado corretamente
3. Você tem permissões de push no repositório
