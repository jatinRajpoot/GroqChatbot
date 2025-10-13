# 🚀 Groq AI Chatbot - Production Ready

A production-ready, ChatGPT-like web application powered by Groq's API. Features text-to-speech, persistent chat history, multiple AI models, and optimized for deployment on Coolify, Railway, or any Docker-compatible platform.

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Production](https://img.shields.io/badge/Production-Ready-green.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## ✨ Features

### User Features
- 🎨 **Modern Dark UI** - ChatGPT-inspired interface
- 🤖 **20+ AI Models** - LLaMA 3/4, Mixtral, Qwen, and more
- 🔊 **Text-to-Speech** - 23 voices (PlayAI integration)
- 💬 **Session Management** - Multiple chat sessions
- 📝 **Rich Formatting** - Markdown, code blocks, tables
- 📱 **Fully Responsive** - Desktop, tablet, mobile
- 💾 **Persistent History** - SQLite with WAL mode

### Production Features
- 🐳 **Docker Ready** - Multi-stage optimized build
- 🚀 **One-Click Deploy** - Coolify, Railway, Render compatible
- 🔒 **Security Hardened** - Non-root user, env variables
- 💪 **Gunicorn + Gevent** - High-performance WSGI server
- 🏥 **Health Checks** - Container orchestration ready
- 📊 **Monitoring** - Health endpoint, detailed logging
- ⚡ **Optimized** - Connection pooling, retry logic, caching

---

## 🎯 Demo

**Try it out:**
- Chat with 20+ open-source AI models
- Generate audio with 23 different voices
- Create multiple chat sessions
- Export/import chat history
- Rich markdown formatting

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/groq-ai-chatbot.git
cd groq-ai-chatbot

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Build and run
docker-compose up -d

# Access at http://localhost:5000
```

### Option 2: Local Development

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/groq-ai-chatbot.git
cd groq-ai-chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Run application
python app.py

# Access at http://localhost:5000
```

### Option 3: Deploy to Coolify

[![Deploy to Coolify](https://img.shields.io/badge/Deploy%20to-Coolify-blue)](https://coolify.io)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📋 Prerequisites

- **Groq API Key**: Get one free at [console.groq.com/keys](https://console.groq.com/keys)
- **TTS Setup** (optional): Accept terms at [console.groq.com/playground?model=playai-tts](https://console.groq.com/playground?model=playai-tts)
- **Docker** (for containerized deployment)
- **Python 3.11+** (for local development)

---

## 🛠️ Tech Stack

### Backend
- **Flask 3.0.0** - Web framework
- **Gunicorn 21.2.0** - WSGI server
- **Gevent 24.2.1** - Async worker
- **SQLite 3** - Database with WAL mode
- **Groq API 0.11.0** - LLM provider

### Frontend
- **Vanilla JavaScript** - No frameworks
- **HTML5 + CSS3** - Modern web standards
- **Markdown Parser** - Custom implementation
- **Web Audio API** - For TTS playback

### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Coolify** - Deployment platform

---

## 📁 Project Structure

```
groq-ai-chatbot/
├── app.py                  # Flask application
├── groq_client.py          # Groq API wrapper
├── database.py             # SQLite database layer
├── gunicorn_config.py      # Production server config
├── Dockerfile              # Docker build config
├── docker-compose.yml      # Local Docker setup
├── requirements.txt        # Python dependencies
├── .env.example            # Environment template
├── static/
│   ├── css/
│   │   └── style.css       # Application styles
│   └── js/
│       └── app.js          # Frontend logic
├── templates/
│   ├── index.html          # Main chat interface
│   └── debug.html          # Debug page
└── docs/
    ├── DEPLOYMENT.md       # Deployment guide
    ├── TTS_README.md       # TTS documentation
    └── PRODUCTION_CHECKLIST.md
```

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | - | Your Groq API key |
| `PORT` | ❌ No | `5000` | Application port |
| `DATABASE_PATH` | ❌ No | `chatbot.db` | Database file path |
| `GUNICORN_WORKERS` | ❌ No | `auto` | Number of workers |
| `LOG_LEVEL` | ❌ No | `info` | Logging level |

### Example .env

```bash
GROQ_API_KEY=gsk_xxxxx...
PORT=5000
LOG_LEVEL=info
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main chat interface |
| `/health` | GET | Health check |
| `/api/models` | GET | List available models |
| `/api/chat` | POST | Send chat message |
| `/api/tts` | POST | Text-to-speech |
| `/api/sessions` | GET | List chat sessions |
| `/api/history` | GET | Get chat history |
| `/api/stats` | GET | Database statistics |

---

## 🚀 Deployment

### Deploy to Coolify

1. **Connect GitHub Repository**
   ```
   - Go to Coolify dashboard
   - New Project → From Source → GitHub
   - Select repository
   ```

2. **Configure Environment**
   ```
   GROQ_API_KEY=your_key_here
   PORT=5000
   ```

3. **Deploy**
   ```
   - Click Deploy
   - Wait 2-3 minutes
   - Access your app!
   ```

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

### Deploy to Render

1. New Web Service
2. Connect GitHub
3. Dockerfile detected automatically
4. Add environment variables
5. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides.

---

## 🏥 Health & Monitoring

### Health Check

```bash
curl https://your-app.com/health
```

Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "api": "connected",
  "sessions": 10,
  "messages": 142
}
```

### Logs

```bash
# Docker
docker logs -f CONTAINER_ID

# Coolify
# View in Logs tab

# Local
# Stdout/stderr
```

---

## 🔒 Security

### Implemented
- ✅ Non-root Docker user
- ✅ Environment variables for secrets
- ✅ No secrets in Git
- ✅ WAL mode for database
- ✅ HTTPS via Let's Encrypt (Coolify)
- ✅ Input sanitization

### Recommended
- Rate limiting (optional)
- Authentication (if needed)
- CORS configuration (if separate frontend)
- Regular security updates

---

## 📈 Performance

### Benchmarks
- **Response Time**: 200-500ms
- **TTS Generation**: 1-3 seconds
- **Concurrent Users**: 50-100 (4 workers)
- **Memory Usage**: ~200-400 MB
- **CPU Usage**: Low (I/O bound)

### Scaling
| Users | Workers | Memory | CPU |
|-------|---------|--------|-----|
| 1-50 | 4 | 512MB | 1 core |
| 50-500 | 8 | 2GB | 4 cores |
| 500+ | 12 | 4GB | 8 cores |

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Groq** - For blazing-fast LLM inference
- **PlayAI** - For high-quality TTS voices
- **Coolify** - For easy self-hosting
- **Open Source Community** - For amazing tools

---

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [TTS Documentation](TTS_README.md)
- [Production Checklist](PRODUCTION_CHECKLIST.md)
- [Groq API Docs](https://console.groq.com/docs)

---

## 🐛 Troubleshooting

### TTS Not Working
- Accept terms: https://console.groq.com/playground?model=playai-tts
- Check API key in environment
- View logs for errors

### Database Locked
- Already handled with WAL mode
- Ensure single instance running
- Check persistent volume

### Build Fails
- Check requirements.txt
- Verify Python version (3.11+)
- Review Docker logs

More help: See [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/groq-ai-chatbot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/groq-ai-chatbot/discussions)
- **Email**: your-email@example.com

---

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Made with ❤️ using Groq AI**

