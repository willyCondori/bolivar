@echo off
setlocal enabledelayedexpansion

:: Detectar IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set LOCAL_IP=%%a
    goto :found
)
:found
set LOCAL_IP=%LOCAL_IP: =%

echo.
echo ========================================
echo   IP local: %LOCAL_IP%
echo ========================================
echo.

:: Crear carpeta ssl si no existe
if not exist ssl mkdir ssl

:: Generar certificados con mkcert para Vite
echo Generando certificados para Vite...
mkcert -cert-file ssl\cert.pem -key-file ssl\key.pem %LOCAL_IP% localhost 127.0.0.1

:: Actualizar .env - APP_URL se actualizara luego con la URL de Cloudflare
powershell -Command "(Get-Content .env) -replace 'APP_URL=.*', 'APP_URL=http://127.0.0.1:8000' | Set-Content .env"

echo .env actualizado

:: Limpiar cache Laravel
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo Iniciando servicios...
echo.

:: 1. Laravel HTTP interno en 8000
start "Laravel" php artisan serve --host=127.0.0.1 --port=8000

:: Esperar que Laravel arranque
timeout /t 3 /nobreak >nul

:: 2. Cloudflare Tunnel - guarda output en log
echo Iniciando Cloudflare Tunnel...
if exist cloudflare-url.log del cloudflare-url.log
start "Cloudflare-Tunnel" cmd /k "cloudflared tunnel --url http://127.0.0.1:8000 2>&1 & cloudflared tunnel --url http://127.0.0.1:8000"
:: Esperar que Cloudflare genere la URL (puede tardar unos segundos)
echo Esperando URL de Cloudflare...
timeout /t 8 /nobreak >nul

:: Extraer URL del log
for /f "tokens=*" %%a in ('powershell -Command "if (Test-Path cloudflare-url.log) { Get-Content cloudflare-url.log | Select-String 'trycloudflare.com' | ForEach-Object { if ($_ -match 'https://[a-z0-9\-]+\.trycloudflare\.com') { $matches[0] } } | Select-Object -First 1 }"') do (
    set CF_URL=%%a
)

if not "!CF_URL!"=="" (
    :: Actualizar APP_URL con la URL publica de Cloudflare
    powershell -Command "(Get-Content .env) -replace 'APP_URL=.*', 'APP_URL=!CF_URL!' | Set-Content .env"
    php artisan config:clear
    echo.
    echo ========================================
    echo   URL PUBLICA HTTPS:
    echo   !CF_URL!
    echo.
    echo   Comparte este enlace - funciona en
    echo   cualquier dispositivo sin instalar nada
    echo ========================================
    echo.
) else (
    echo.
    echo ========================================
    echo   Busca la URL en la ventana
    echo   "Cloudflare-Tunnel" que se abrio
    echo   Ejemplo: https://xxxx.trycloudflare.com
    echo   Y actualiza APP_URL en .env con esa URL
    echo ========================================
    echo.
)

:: 3. Vite con HTTPS (usa certificados de mkcert)
npm run dev