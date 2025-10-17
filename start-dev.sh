#!/bin/bash

# Start development servers for both Flask backend and Next.js frontend

echo "🚀 Starting Flask Backend and Next.js Frontend..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null
then
    echo "❌ Python is not installed. Please install Python 3.8+"
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $FLASK_PID $NEXT_PID 2>/dev/null
    exit 0
}

trap cleanup INT TERM

# Start Flask backend
echo "🐍 Starting Flask backend on port 5000..."
if command -v python3 &> /dev/null; then
    python3 app.py &
else
    python app.py &
fi
FLASK_PID=$!
echo "   Flask PID: $FLASK_PID"
echo ""

# Wait for Flask to start
sleep 2

# Start Next.js frontend
echo "⚛️  Starting Next.js frontend on port 3000..."
npm run dev &
NEXT_PID=$!
echo "   Next.js PID: $NEXT_PID"
echo ""

echo "✅ Both servers are running!"
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for background processes
wait
