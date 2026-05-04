@echo off
echo ============================================
echo  S-Fitness — Generate SSL Certificate
echo ============================================
echo.

REM Check mkcert
where mkcert >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] mkcert tidak ditemukan!
    echo.
    echo Download mkcert dari:
    echo https://github.com/FiloSottile/mkcert/releases/latest
    echo.
    echo Download file: mkcert-v*-windows-amd64.exe
    echo Rename jadi: mkcert.exe
    echo Taruh di folder yang ada di PATH, contoh: D:\laragon\bin\
    echo.
    pause
    exit /b 1
)

echo [OK] mkcert ditemukan
echo.

REM Install local CA
echo [1/2] Install local CA...
mkcert -install

echo.
echo [2/2] Generate certificate untuk 192.168.43.130...
cd /d "%~dp0certs"
mkcert -cert-file cert.pem -key-file key.pem 192.168.43.130 localhost 127.0.0.1

echo.
echo ============================================
echo  SELESAI! Certificate tersimpan di:
echo  frontend/certs/cert.pem
echo  frontend/certs/key.pem
echo.
echo  Sekarang jalankan: npm run dev
echo  Akses via: https://192.168.43.130:5173
echo ============================================
pause
