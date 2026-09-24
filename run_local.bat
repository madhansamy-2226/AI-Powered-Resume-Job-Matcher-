@echo off
title AI Resume-Job Matcher
echo ========================================================
echo       Starting AI Resume-Job Matcher Full Stack
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Django Backend API (Port 8000)...
start "AI Matcher Backend" cmd /k "cd backend && .\venv\Scripts\activate && python manage.py runserver 127.0.0.1:8000"

timeout /t 2 /nobreak > nul

echo [2/2] Launching Vite React Frontend (Port 5173)...
start "AI Matcher Frontend" cmd /k "cd frontend && npm run dev"

timeout /t 3 /nobreak > nul

echo.
echo ========================================================
echo  Ready! Opening Frontend in default browser...
echo  Local URL: http://localhost:5173/
echo ========================================================
start http://localhost:5173/

exit
