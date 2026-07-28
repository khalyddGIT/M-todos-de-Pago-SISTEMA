@echo off
echo Iniciando Backend...
start "Backend" /B node "%~dp0backend\src\app.js"

echo Iniciando Frontend...
start "Frontend" /B npm --prefix "%~dp0frontend" run dev

echo.
echo Sistema iniciado!
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
pause
