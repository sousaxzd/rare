# Troubleshooting - Erro de Chunks do Next.js

## Problema
Erro: `Failed to load chunk /_next/static/chunks/...`

Este erro geralmente ocorre quando:
- O cache do Next.js está corrompido
- Há problemas com o Turbopack
- Caminhos com espaços no nome do projeto

## Soluções

### 1. Limpar Cache (Recomendado)
Execute um dos seguintes comandos:

**Windows (PowerShell):**
```powershell
cd frontend
.\clean-cache.ps1
```

**Windows (CMD):**
```cmd
cd frontend
clean-cache.bat
```

**NPM Script (Cross-platform):**
```bash
cd frontend
npm run clean
```

Depois, reinicie o servidor:
```bash
npm run dev
```

### 2. Usar Next.js sem Turbopack
Se o problema persistir, tente executar sem o Turbopack:

```bash
npm run dev:no-turbo
```

### 3. Limpar Manualmente
Se os scripts não funcionarem, delete manualmente:
- Pasta `.next` na raiz do projeto `frontend`
- Pasta `node_modules/.cache` (se existir)

### 4. Reinstalar Dependências (Último Recurso)
```bash
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

## Prevenção

- Sempre pare o servidor (Ctrl+C) antes de fazer mudanças grandes
- Evite editar arquivos enquanto o servidor está rodando
- Se o erro ocorrer frequentemente, considere usar `npm run dev:no-turbo` permanentemente

## Error Boundary

O projeto agora inclui um Error Boundary que detecta erros de chunks e recarrega a página automaticamente. Se você ver a mensagem "Erro ao carregar recursos. Recarregando...", aguarde alguns segundos que a página será recarregada automaticamente.

