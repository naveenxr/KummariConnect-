@echo off
echo ========================================================
echo  Kummari Connect - MERN Stack Startup Script
echo ========================================================
echo.

REM ---- STEP 1: Install Frontend (React) Dependencies ----
echo [1/4] Installing Frontend dependencies (React + Vite + Lucide)...
cd /d e:\KummariConnect
call npm install
echo      Frontend dependencies installed!
echo.

REM ---- STEP 2: Install Backend (Express) Dependencies ----
echo [2/4] Installing Backend dependencies (Express + MongoDB + JWT)...
cd /d e:\KummariConnect\server
call npm install
echo      Backend dependencies installed!
echo.

REM ---- STEP 3: Start Express Backend Server (port 5000) ----
echo [3/4] Launching Express + MongoDB Backend on http://localhost:5000 ...
start cmd /k "title Kummari Connect - Express Backend && cd /d e:\KummariConnect\server && npm start"
timeout /t 3 > nul

REM ---- STEP 4: Start Vite React Frontend (port 3000) ----
echo [4/4] Launching React Frontend on http://localhost:3000 ...
start cmd /k "title Kummari Connect - React Frontend && cd /d e:\KummariConnect && npm run dev"
timeout /t 3 > nul

echo.
echo ========================================================
echo  App is starting up!
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   Health:    http://localhost:5000/api/health
echo ========================================================
pause
