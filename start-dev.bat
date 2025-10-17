@echo off
REM Start development servers for both Flask backend and Next.js frontend

echo.
echo Starting Flask Backend and Next.js Frontend...
echo.

REM Check if Python is available
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo Python is not installed. Please install Python 3.8+
    exit /b 1
)

REM Check if Node.js is available
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing Node.js dependencies...
    call npm install
    echo.
)

REM Start Flask backend in a new window
echo Starting Flask backend on port 5000...
start "Flask Backend" cmd /k python app.py
echo.

REM Wait for Flask to start
timeout /t 2 /nobreak >nul

REM Start Next.js frontend in a new window
echo Starting Next.js frontend on port 3000...
start "Next.js Frontend" cmd /k npm run dev
echo.

echo Both servers are running!
echo.
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Close the command windows to stop the servers
echo.

pause
