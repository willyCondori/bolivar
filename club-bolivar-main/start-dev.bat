@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   INICIANDO SISTEMA COMPLETO
echo ========================================
echo.

:: Detectar IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set LOCAL_IP=%%a
    goto :found
)

:found
set LOCAL_IP=%LOCAL_IP: =%

echo IP local: %LOCAL_IP%
echo.

:: Crear SSL si no existe
if not exist ssl mkdir ssl

echo Generando certificados...
mkcert -cert-file ssl\cert.pem -key-file ssl\key.pem %LOCAL_IP% localhost 127.0.0.1

:: Laravel base URL LOCAL (NO túnel todavía)
powershell -Command "(Get-Content .env) -replace 'APP_URL=.*', 'APP_URL=http://127.0.0.1:8000' | Set-Content .env"

echo Limpiando cache Laravel...
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo.
echo ========================================
echo   INICIANDO SERVIDORES
echo ========================================
echo.

:: Laravel backend
start "Laravel" php artisan serve --host=127.0.0.1 --port=8000

timeout /t 3 >nul

:: Cloudflare Tunnel (SOLO UNO)
start "Cloudflare" cmd /k "cloudflared tunnel --url http://127.0.0.1:8000"

echo.
echo ========================================
echo   IMPORTANTE
echo ========================================
echo 1. Espera que aparezca la URL:
echo    https://xxxx.trycloudflare.com
echo.
echo 2. Copia esa URL y reemplaza en .env:
echo    APP_URL=https://xxxx.trycloudflare.com
echo.
echo ========================================
echo.

:: Vite accesible en red local
npm run build