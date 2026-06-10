@echo off
title Portaria CEPE - Servidor
cd /d "%~dp0"
echo ============================================
echo   Portaria CEPE - iniciando o servidor...
echo ============================================
echo.
echo  Acesse neste PC:   http://localhost:8080
echo  Acesse pela rede:  http://IP-DESTE-SERVIDOR:8080
echo.
echo  (Feche esta janela para parar o servidor)
echo ============================================
node server.js 8080
echo.
echo  O servidor parou. Verifique se o Node.js esta instalado (https://nodejs.org).
pause
