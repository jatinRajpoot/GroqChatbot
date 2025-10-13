# Production Deployment Guide

## 🚀 Deploy to Coolify via GitHub

This guide will help you deploy the Groq AI Chatbot to Coolify using GitHub.

---

## Prerequisites

- ✅ GitHub account
- ✅ Coolify instance running
- ✅ Groq API key (from https://console.groq.com/keys)
- ✅ PlayAI TTS terms accepted (for TTS feature)

---

## Step 1: Prepare GitHub Repository

### 1.1 Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready Groq AI Chatbot"

# Add remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/groq-ai-chatbot.git

# Push to GitHub
git push -u origin main
```

### 1.2 Verify Files

Make sure these files are in your repository:
- ✅ `Dockerfile`
- ✅ `docker-compose.yml`
- ✅ `requirements.txt`
- ✅ `gunicorn_config.py`
- ✅ `app.py`
- ✅ `groq_client.py`
- ✅ `database.py`
- ✅ `static/` folder
- ✅ `templates/` folder

**Do NOT commit:**
- ❌ `.env` (contains secrets)
- ❌ `venv/` (large, unnecessary)
- ❌ `*.db` files (will be created on deployment)
- ❌ `__pycache__/`

---

## Step 2: Configure Coolify

### 2.1 Create New Project

1. Log into your Coolify dashboard
2. Click **"+ New Project"**
3. Select **"From Source"** → **"GitHub"**
4. Authorize Coolify to access your GitHub account
5. Select your `groq-ai-chatbot` repository

### 2.2 Configure Build Settings

**General Settings:**
- **Name**: `groq-ai-chatbot`
- **Branch**: `main`
- **Build Pack**: `Dockerfile`
- **Port**: `5000`

**Environment Variables** (Add these in Coolify):

| Variable | Value | Description |
|----------|-------|-------------|
| `GROQ_API_KEY` | `gsk_xxxxx...` | Your Groq API key |
| `PORT` | `5000` | Application port |
| `GUNICORN_WORKERS` | `4` | Number of workers (auto-calculated if omitted) |
| `LOG_LEVEL` | `info` | Logging level (debug/info/warning/error) |

### 2.3 Configure Storage (Optional)

To persist your chat database across deployments:

1. Go to **Storage** section
2. Add **Persistent Volume**:
   - **Mount Path**: `/app/chatbot.db`
   - **Size**: `100MB` (or more if needed)

---

## Step 3: Deploy

### 3.1 Start Deployment

1. Click **"Deploy"** button
2. Coolify will:
   - ✅ Clone your repository
   - ✅ Build Docker image
   - ✅ Run health checks
   - ✅ Start the container
   - ✅ Expose on your domain

### 3.2 Monitor Build

Watch the build logs in Coolify:
```
Building...
[+] Building 45.3s
=> [builder 1/4] FROM docker.io/library/python:3.11-slim
=> [builder 2/4] WORKDIR /app
=> [builder 3/4] COPY requirements.txt .
=> [builder 4/4] RUN pip install --no-cache-dir --user -r requirements.txt
=> [stage-1 1/5] FROM docker.io/library/python:3.11-slim
=> [stage-1 2/5] RUN useradd -m -u 1000 appuser
=> [stage-1 3/5] COPY --from=builder /root/.local /home/appuser/.local
=> [stage-1 4/5] COPY --chown=appuser:appuser . .
=> [stage-1 5/5] USER appuser
Successfully built!
```

### 3.3 Verify Health

Once deployed, check:
- ✅ Application is running: `https://your-app.coolify.app`
- ✅ Health endpoint: `https://your-app.coolify.app/health`
- ✅ Chat interface loads
- ✅ Can send messages

---

## Step 4: Configure Domain (Optional)

### 4.1 Add Custom Domain

1. In Coolify, go to **Domains** section
2. Click **"Add Domain"**
3. Enter your domain: `chat.yourdomain.com`
4. Coolify will automatically:
   - ✅ Configure SSL/TLS (Let's Encrypt)
   - ✅ Set up reverse proxy
   - ✅ Enable HTTPS

### 4.2 Update DNS

In your domain registrar, add:
```
Type: A
Name: chat (or @)
Value: YOUR_COOLIFY_SERVER_IP
TTL: 300
```

---

## Step 5: Post-Deployment Setup

### 5.1 Accept TTS Terms

For text-to-speech to work:
1. Visit: https://console.groq.com/playground?model=playai-tts
2. Accept PlayAI TTS terms
3. TTS will work immediately (no redeploy needed)

### 5.2 Test All Features

- ✅ Send chat messages
- ✅ Switch between AI models
- ✅ Create new chat sessions
- ✅ Click speaker icons (TTS)
- ✅ View chat history in sidebar
- ✅ Responsive design on mobile

---

## Monitoring & Maintenance

### Check Application Logs

In Coolify:
1. Go to your application
2. Click **"Logs"** tab
3. View real-time logs

### Monitor Health

```bash
# Check health endpoint
curl https://your-app.coolify.app/health

# Response:
{
  "status": "healthy",
  "database": "connected",
  "api": "connected",
  "sessions": 10,
  "messages": 142
}
```

### Database Backup

If using persistent storage:

```bash
# SSH into Coolify server
ssh user@your-coolify-server

# Find container
docker ps | grep groq-chatbot

# Backup database
docker cp CONTAINER_ID:/app/chatbot.db ./backup-$(date +%Y%m%d).db
```

---

## Scaling

### Horizontal Scaling

In `gunicorn_config.py`, adjust:
```python
workers = 8  # Increase workers
threads = 4  # Increase threads
```

Then redeploy:
```bash
git commit -am "Scale up workers"
git push
# Coolify auto-deploys
```

### Vertical Scaling

In Coolify:
1. Go to **Resources**
2. Adjust:
   - **CPU**: 2-4 cores
   - **Memory**: 1-2 GB
3. Restart application

---

## Troubleshooting

### Build Fails

**Issue**: `ERROR: Could not find a version that satisfies the requirement...`

**Fix**: Check `requirements.txt` for typos or version conflicts

### Health Check Failing

**Issue**: Container starts but health check fails

**Fix**: Check logs for database or API connection issues
```bash
# In Coolify logs, look for:
ERROR: Database connection failed
ERROR: Groq API key invalid
```

### TTS Not Working

**Issue**: Speaker buttons give errors

**Fix**: 
1. Verify `GROQ_API_KEY` is set in Coolify environment
2. Accept terms at https://console.groq.com/playground?model=playai-tts
3. Check logs for specific error

### Database Locked

**Issue**: `Database is locked` errors

**Fix**: Already handled with WAL mode, but if persistent:
1. Ensure only one container is running
2. Check persistent volume is properly mounted
3. Restart container

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | - | Your Groq API key |
| `PORT` | ❌ No | `5000` | Application port |
| `GUNICORN_WORKERS` | ❌ No | `auto` | Number of worker processes |
| `GUNICORN_THREADS` | ❌ No | `2` | Threads per worker |
| `LOG_LEVEL` | ❌ No | `info` | Logging level |

---

## Security Best Practices

### ✅ Implemented

- ✅ Non-root user in Docker
- ✅ Multi-stage build (smaller image)
- ✅ Secret management via env vars
- ✅ Health checks
- ✅ Automatic SSL via Coolify
- ✅ No sensitive files in Git

### 🔒 Recommended

1. **Rate Limiting**: Add rate limiting to prevent abuse
2. **Authentication**: Add user authentication if needed
3. **CORS**: Configure CORS if using separate frontend
4. **Monitoring**: Set up monitoring (Sentry, Datadog, etc.)

---

## Alternative Deployment Options

### Deploy with Docker Compose (Manual)

```bash
# On your server
git clone https://github.com/YOUR_USERNAME/groq-ai-chatbot.git
cd groq-ai-chatbot

# Create .env file
echo "GROQ_API_KEY=your_key_here" > .env

# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Deploy to Railway

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub"**
3. Select your repository
4. Add `GROQ_API_KEY` environment variable
5. Railway auto-detects Dockerfile and deploys

### Deploy to Render

1. Go to https://render.com
2. Click **"New"** → **"Web Service"**
3. Connect GitHub repository
4. Render auto-detects Dockerfile
5. Add environment variables
6. Deploy

---

## Performance Benchmarks

### Expected Performance

- **Response Time**: 200-500ms (chat)
- **TTS Generation**: 1-3 seconds
- **Concurrent Users**: 50-100 (with 4 workers)
- **Memory Usage**: ~200-400 MB
- **CPU Usage**: Low (mostly I/O bound)

### Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test
ab -n 1000 -c 10 https://your-app.coolify.app/health

# Results should show:
# - 99% requests < 100ms
# - No failed requests
```

---

## Update & Rollback

### Push Updates

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Coolify auto-deploys
```

### Rollback

In Coolify:
1. Go to **Deployments**
2. Find previous successful deployment
3. Click **"Redeploy"**

---

## Cost Estimation

### Coolify Server

- **VPS**: $5-20/month (Hetzner, DigitalOcean)
- **Domain**: $10/year (optional)
- **SSL**: Free (Let's Encrypt)

### Groq API

- **Chat**: Free tier + pay-as-you-go
- **TTS**: Check https://console.groq.com/pricing

### Total

- **Development**: Free (localhost)
- **Production**: $5-20/month + API usage

---

## Support & Resources

- **Coolify Docs**: https://coolify.io/docs
- **Groq API Docs**: https://console.groq.com/docs
- **Docker Docs**: https://docs.docker.com
- **Issues**: GitHub Issues in your repo

---

## 🎉 You're Ready!

Your Groq AI Chatbot is now production-ready and deployed on Coolify!

**Quick Start:**
1. Push to GitHub
2. Connect to Coolify
3. Add `GROQ_API_KEY`
4. Deploy
5. Share your chatbot! 🚀
