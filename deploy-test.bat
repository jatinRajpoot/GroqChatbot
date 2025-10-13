@echo off
REM Quick deployment test script for Windows

echo ====================================
echo Groq AI Chatbot - Local Docker Test
echo ====================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo [1/5] Docker detected...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [2/5] Creating .env file...
    copy .env.example .env
    echo.
    echo WARNING: Please edit .env and add your GROQ_API_KEY
    echo Get your key from: https://console.groq.com/keys
    echo.
    notepad .env
    echo.
    echo Press any key after saving your API key...
    pause >nul
) else (
    echo [2/5] .env file exists...
)
echo.

REM Build Docker image
echo [3/5] Building Docker image...
echo This may take 2-3 minutes on first run...
echo.
docker build -t groq-chatbot:test .
if errorlevel 1 (
    echo.
    echo ERROR: Docker build failed
    echo Check the output above for errors
    pause
    exit /b 1
)
echo.

REM Stop existing container if running
echo [4/5] Stopping existing container...
docker stop groq-chatbot-test >nul 2>&1
docker rm groq-chatbot-test >nul 2>&1
echo.

REM Run container
echo [5/5] Starting container...
docker run -d ^
    -p 5000:5000 ^
    --env-file .env ^
    --name groq-chatbot-test ^
    groq-chatbot:test

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start container
    echo Check Docker logs for details
    pause
    exit /b 1
)

echo.
echo ====================================
echo SUCCESS! Container is running
echo ====================================
echo.
echo Access your chatbot at: http://localhost:5000
echo.
echo Useful commands:
echo   View logs:    docker logs -f groq-chatbot-test
echo   Stop:         docker stop groq-chatbot-test
echo   Restart:      docker restart groq-chatbot-test
echo   Remove:       docker rm -f groq-chatbot-test
echo.
echo Opening browser in 3 seconds...
timeout /t 3 >nul
start http://localhost:5000

echo.
echo Press any key to view container logs...
pause >nul
docker logs -f groq-chatbot-test
