#!/bin/bash

# Quick deployment test script for Linux/Mac

echo "===================================="
echo "Groq AI Chatbot - Local Docker Test"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}ERROR: Docker is not installed${NC}"
    echo "Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

echo -e "${GREEN}[1/5] Docker detected...${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}[2/5] Creating .env file...${NC}"
    cp .env.example .env
    echo ""
    echo -e "${YELLOW}WARNING: Please edit .env and add your GROQ_API_KEY${NC}"
    echo "Get your key from: https://console.groq.com/keys"
    echo ""
    echo "Opening .env in default editor..."
    ${EDITOR:-nano} .env
    echo ""
    read -p "Press Enter after saving your API key..."
else
    echo -e "${GREEN}[2/5] .env file exists...${NC}"
fi
echo ""

# Build Docker image
echo -e "${GREEN}[3/5] Building Docker image...${NC}"
echo "This may take 2-3 minutes on first run..."
echo ""
if ! docker build -t groq-chatbot:test .; then
    echo ""
    echo -e "${RED}ERROR: Docker build failed${NC}"
    echo "Check the output above for errors"
    exit 1
fi
echo ""

# Stop existing container if running
echo -e "${GREEN}[4/5] Stopping existing container...${NC}"
docker stop groq-chatbot-test 2>/dev/null || true
docker rm groq-chatbot-test 2>/dev/null || true
echo ""

# Run container
echo -e "${GREEN}[5/5] Starting container...${NC}"
if ! docker run -d \
    -p 5000:5000 \
    --env-file .env \
    --name groq-chatbot-test \
    groq-chatbot:test; then
    echo ""
    echo -e "${RED}ERROR: Failed to start container${NC}"
    echo "Check Docker logs for details"
    exit 1
fi

echo ""
echo "===================================="
echo -e "${GREEN}SUCCESS! Container is running${NC}"
echo "===================================="
echo ""
echo "Access your chatbot at: http://localhost:5000"
echo ""
echo "Useful commands:"
echo "  View logs:    docker logs -f groq-chatbot-test"
echo "  Stop:         docker stop groq-chatbot-test"
echo "  Restart:      docker restart groq-chatbot-test"
echo "  Remove:       docker rm -f groq-chatbot-test"
echo ""
echo -e "${YELLOW}Opening browser in 3 seconds...${NC}"
sleep 3

# Open browser (cross-platform)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:5000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:5000 2>/dev/null || echo "Please open http://localhost:5000 in your browser"
fi

echo ""
echo "Press Ctrl+C to exit log viewer..."
sleep 2
docker logs -f groq-chatbot-test
