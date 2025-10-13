# Groq AI Chatbot 🤖

A modern, ChatGPT-like web application built with Flask and powered by Groq's API for accessing open-source AI models. Features a sleek dark interface, text-to-speech support, and optimized for production deployment.

![Groq Chatbot](https://img.shields.io/badge/Python-3.11+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features ✨

- 🎨 **Modern UI** - ChatGPT-inspired dark theme interface
- 🤖 **20+ AI Models** - Access to various open-source models via Groq API:
  - Mixtral 8x7B
  - LLaMA 3/4 (8B/70B)
  - Qwen 2.5
  - Gemma 7B/9B
  - And more!
- 🔊 **Text-to-Speech** - 23 voices with PlayAI integration (English & Arabic)
- 💬 **In-Memory Chat** - Session-based conversation history (no database)
- 📝 **Rich Markdown Formatting** - Full support for:
  - Headers (# ## ###)
  - Bold (**text** or __text__)
  - Italic (*text* or _text_)
  - Code blocks with syntax highlighting
  - Inline code
  - Lists (ordered and unordered)
  - Tables
  - Links and blockquotes
-  **Real-time Responses** - Fast responses from Groq API
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **Example Prompts** - Quick-start conversation templates
- � **Docker Ready** - Production-optimized containerization
- ⚡ **High Performance** - Gunicorn + Gevent for concurrent requests

## Screenshots 📸

The application features:
- Clean, dark-themed interface
- Model selection dropdown with 20+ models
- Voice selection with 23 TTS voices
- Typing indicators
- Formatted code blocks in responses
- Mobile-responsive design
- Text-to-speech playback

## Prerequisites 📋

- Python 3.11 or higher
- Groq API key (free tier available)
- Docker (optional, for containerized deployment)

## Quick Start 🚀

### Option 1: Docker (Recommended for Production)

```bash
# Clone the repository
cd AIoutputs

# Create .env file
echo "GROQ_API_KEY=your_actual_groq_api_key" > .env

# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:5000
```

### Option 2: Local Development

#### 1. Create a Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 3. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

#### 4. Configure Environment Variables

Create a `.env` file:
```bash
GROQ_API_KEY=your_actual_groq_api_key_here
PORT=5000
```

#### 5. Run the Application

```bash
# Development mode
python app.py

# Production mode with Gunicorn
gunicorn -c gunicorn_config.py app:app
```

The application will start on `http://localhost:5000`

## Text-to-Speech Setup 🔊

To use the TTS feature:

1. Visit [Groq Playground TTS](https://console.groq.com/playground?model=playai-tts)
2. Accept PlayAI TTS terms
3. Select a voice from the dropdown in the app
4. Click the speaker button on any assistant message

## Usage 🎯

### Using the Chatbot

1. **Open your browser** and navigate to `http://localhost:5000`
2. **Select a model** from the dropdown in the header
3. **Type your message** in the input box at the bottom
4. **Press Enter** or click the send button
5. **View responses** in real-time
6. **Click speaker button** to hear responses (if TTS voice selected)

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line in message input

### Features to Explore

- **New Chat** - Clear current chat and start fresh
- **Model Selection** - Switch between 20+ AI models
- **Voice Selection** - Choose from 23 TTS voices
- **Example Prompts** - Click on suggested prompts to get started

## Project Structure 📁

```
AIoutputs/
├── app.py                 # Main Flask application
├── groq_client.py         # Groq API integration with TTS
├── gunicorn_config.py     # Production server configuration
├── requirements.txt       # Python dependencies
├── Dockerfile             # Docker image configuration
├── docker-compose.yml     # Docker Compose setup
├── .env.example          # Environment variables template
├── .env                  # Your API keys (not in repo)
├── .gitignore            # Git ignore file
├── .dockerignore         # Docker ignore file
├── deploy-test.bat       # Windows deployment script
├── deploy-test.sh        # Linux deployment script
├── README.md             # This file
├── DEPLOYMENT.md         # Production deployment guide
├── templates/
│   ├── index.html        # Main HTML template
│   └── debug.html        # Debug page
└── static/
    ├── css/
    │   └── style.css     # Application styles (merged & optimized)
    └── js/
        └── app.js        # Frontend JavaScript
```

## API Endpoints 🔌

- `GET /` - Main chat interface
- `GET /health` - Health check endpoint (for Docker/monitoring)
- `GET /api/models` - List available AI models
- `POST /api/chat` - Send chat message
- `POST /api/tts` - Text-to-speech conversion
- `GET /api/history` - Get current session chat history
- `POST /api/clear` - Clear current session messages

## Available Models 🎭

The application supports 20+ open-source models through Groq:

- **Mixtral 8x7B** - Powerful mixture of experts model
- **LLaMA 3/4** - Meta's latest large language models (8B/70B variants)
- **Qwen 2.5** - Alibaba's instruction-tuned models
- **Gemma 7B/9B** - Google's instruction-tuned models
- **Llama Guard** - Content moderation models

Models are dynamically loaded from the Groq API.

## Configuration ⚙️

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | - | Your Groq API key |
| `PORT` | ❌ No | `5000` | Application port |
| `LOG_LEVEL` | ❌ No | `info` | Logging level (debug/info/warning/error) |

### Customizing the Application

**Change Default Port:**
Edit `.env` file:
```bash
PORT=8080
```

**Modify Response Parameters:**
Edit `groq_client.py`:
```python
def chat(self, messages, model='mixtral-8x7b-32768', temperature=0.7, max_tokens=1024):
```

## Deployment 🚀

### Docker Deployment

The app includes production-ready Docker configuration:

```bash
# Build image
docker build -t groq-chatbot .

# Run container
docker run -d \
  -p 5000:5000 \
  -e GROQ_API_KEY=your_key \
  --name groq-chatbot \
  groq-chatbot
```

### Deploy to Cloud Platforms

- **Coolify**: See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guide
- **Railway**: Connect GitHub repo, add env vars, deploy
- **Render**: Auto-detects Dockerfile, add env vars, deploy
- **DigitalOcean**: Use App Platform with Docker

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Troubleshooting 🔧

### Common Issues

**Import Error: groq module not found**
```bash
pip install groq
```

**API Key Error**
- Ensure `.env` file exists with valid `GROQ_API_KEY`
- Check that API key is active in Groq Console

**Port Already in Use**
- Change `PORT` in `.env` file
- Or stop other application using the port

**Models Not Loading**
- Check internet connection
- Verify API key is valid
- Check Groq API status at console.groq.com

**TTS Not Working**
- Accept terms at https://console.groq.com/playground?model=playai-tts
- Verify API key has TTS access
- Check browser console for errors

**Docker Build Fails**
- Ensure Docker is running
- Check requirements.txt for version conflicts
- Verify Python 3.11+ in Dockerfile

## Performance 📈

### Expected Performance
- **Response Time**: 200-500ms (chat)
- **TTS Generation**: 1-3 seconds
- **Concurrent Users**: 50-100 (with 4 Gunicorn workers)
- **Memory Usage**: ~200-400 MB
- **CPU Usage**: Low (I/O bound)

### Optimization Tips
- Use Docker for production
- Increase Gunicorn workers for more traffic
- Enable HTTP/2 with reverse proxy (Nginx/Caddy)
- Use CDN for static files (optional)

## Security Notes 🔐

- ✅ Never commit `.env` file to version control
- ✅ Keep your Groq API key secure
- ✅ Use environment variables for sensitive data
- ✅ Non-root user in Docker container
- ✅ Multi-stage Docker build for smaller attack surface
- ⚠️ In-memory chat history (no persistence)
- 💡 Implement rate limiting for production use
- 💡 Add authentication for multi-user deployments

## Contributing 🤝

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- **Groq** - For providing fast inference API for open-source models
- **PlayAI** - For high-quality text-to-speech voices
- **Flask** - Micro web framework
- **OpenAI** - For the ChatGPT interface inspiration

## Support 💬

For issues and questions:
- Check the troubleshooting section
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Review Groq API documentation at console.groq.com
- Open an issue in the repository

## Changelog �

### Latest Version
- ✅ Production-ready Docker configuration
- ✅ Gunicorn + Gevent for high performance
- ✅ Text-to-speech with 23 voices
- ✅ Merged and optimized CSS (single file)
- ✅ In-memory chat (no database dependency)
- ✅ Health check endpoint for monitoring
- ✅ Responsive mobile design
- ✅ 20+ AI models support

---

**Built with ❤️ using Flask and Groq API**
