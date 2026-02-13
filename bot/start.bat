@echo off
echo ========================================
echo   Bot Discord - Gerenciador Rare
echo ========================================
echo.

if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando o bot...
echo.
node discord-bot.js

pause
