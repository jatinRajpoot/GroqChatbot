@echo off
echo ============================================
echo Groq AI Chatbot - Quick Setup Script
echo ============================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo Error: Failed to create virtual environment
    pause
    exit /b 1
)
echo Virtual environment created successfully!
echo.

echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Error: Failed to activate virtual environment
    pause
    exit /b 1
)
echo Virtual environment activated!
echo.

echo Step 3: Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo Step 4: Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo.
    echo ============================================
    echo IMPORTANT: Please edit .env file and add your Groq API key!
    echo Get your API key from: https://console.groq.com/keys
    echo ============================================
) else (
    echo .env file already exists
)
echo.

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Edit .env file and add your GROQ_API_KEY
echo 2. Run: python app.py
echo 3. Open browser: http://localhost:5000
echo.
pause
