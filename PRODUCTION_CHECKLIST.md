# 🚀 Production Deployment Checklist

## Pre-Deployment

### ✅ Code Ready
- [x] All features working locally
- [x] Database optimized with WAL mode
- [x] Error handling implemented
- [x] Health check endpoint added
- [x] Production WSGI server (Gunicorn) configured

### ✅ Docker Ready
- [x] `Dockerfile` created (multi-stage build)
- [x] `.dockerignore` configured
- [x] `docker-compose.yml` for testing
- [x] `gunicorn_config.py` optimized
- [x] Health checks configured

### ✅ Security
- [x] Non-root user in Docker
- [x] `.env` in .gitignore
- [x] `.env.example` with template
- [x] No secrets in code
- [x] Database permissions configured

### ✅ Documentation
- [x] `DEPLOYMENT.md` - Full deployment guide
- [x] `README.md` - Project overview
- [x] `TTS_README.md` - TTS feature docs
- [x] Environment variables documented

---

## Deployment Steps

### 1. Test Locally with Docker

```bash
# Build image
docker build -t groq-chatbot:test .

# Run container
docker run -d \
  -p 5000:5000 \
  -e GROQ_API_KEY=your_key \
  --name groq-chatbot-test \
  groq-chatbot:test

# Check health
curl http://localhost:5000/health

# View logs
docker logs -f groq-chatbot-test

# Test application
open http://localhost:5000

# Cleanup
docker stop groq-chatbot-test
docker rm groq-chatbot-test
```

### 2. Push to GitHub

```bash
# Add files
git add .

# Commit
git commit -m "Production ready - Docker + Coolify deployment"

# Push
git push origin main
```

### 3. Deploy to Coolify

1. **Create Project in Coolify**
   - Go to Coolify dashboard
   - Click "New Project"
   - Select "From Source" → "GitHub"
   - Choose your repository

2. **Configure Environment**
   ```
   GROQ_API_KEY=gsk_xxxxx...
   PORT=5000
   LOG_LEVEL=info
   ```

3. **Deploy**
   - Click "Deploy"
   - Wait for build (2-3 minutes)
   - Check health endpoint
   - Test application

### 4. Post-Deployment

1. **Accept TTS Terms**
   - Visit: https://console.groq.com/playground?model=playai-tts
   - Accept terms

2. **Test All Features**
   - Chat functionality
   - Model selection
   - Session management
   - TTS (speaker buttons)
   - Responsive design

3. **Monitor**
   - Check Coolify logs
   - Monitor `/health` endpoint
   - Test from different devices

---

## Environment Variables

### Required
| Variable | Description | Example |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your Groq API key | `gsk_xxxxx...` |

### Optional
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Application port |
| `DATABASE_PATH` | `chatbot.db` | Database file path |
| `GUNICORN_WORKERS` | `auto` | Number of workers |
| `GUNICORN_THREADS` | `2` | Threads per worker |
| `LOG_LEVEL` | `info` | Logging level |

---

## Performance Optimization

### Current Configuration

**Gunicorn Workers:**
- Auto-calculated based on CPU cores
- Formula: `(2 * cpu_cores) + 1`
- Example: 4 cores = 9 workers

**Worker Class:**
- `gevent` for async I/O
- Better for API-heavy workloads
- Handles 1000 concurrent connections

**Timeouts:**
- Request timeout: 120s
- Graceful shutdown: 30s
- Keep-alive: 5s

### Scaling Guidelines

| Users | Workers | Memory | CPU |
|-------|---------|--------|-----|
| 1-50 | 4 | 512MB | 1 core |
| 50-100 | 6 | 1GB | 2 cores |
| 100-500 | 8 | 2GB | 4 cores |
| 500+ | 12 | 4GB | 8 cores |

---

## Monitoring

### Health Check

```bash
# Check application health
curl https://your-app.com/health

# Expected response:
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
# In Coolify
# Go to Logs tab

# Look for:
# ✅ [INFO] Booting worker
# ✅ [INFO] Listening at: http://0.0.0.0:5000
# ✅ [INFO] Using worker: gevent
# ❌ [ERROR] Database connection failed
# ❌ [ERROR] Groq API key invalid
```

### Metrics

Monitor these in Coolify or external monitoring:
- Response time (target: <500ms)
- Error rate (target: <1%)
- CPU usage (target: <70%)
- Memory usage (target: <80%)
- Request rate (requests/second)

---

## Troubleshooting

### Container Won't Start

**Check:**
1. Environment variables set?
2. Port 5000 available?
3. Build logs for errors?

**Fix:**
```bash
# View build logs in Coolify
# Check for Python errors
# Verify requirements.txt
```

### Database Issues

**Symptoms:**
- "Database is locked" errors
- Slow queries
- Lost data

**Fix:**
- Already using WAL mode ✅
- Check persistent volume mounted ✅
- Ensure single instance running ✅

### TTS Not Working

**Check:**
1. GROQ_API_KEY set? ✅
2. Terms accepted? → https://console.groq.com/playground?model=playai-tts
3. Network connectivity? ✅

### High Memory Usage

**Symptoms:**
- Container using >2GB memory
- OOM (Out of Memory) errors

**Fix:**
```python
# In gunicorn_config.py
max_requests = 500  # Reduce from 1000
workers = 4  # Reduce workers
```

### Slow Response Times

**Check:**
1. Groq API latency (check status page)
2. Worker count (increase if CPU available)
3. Network latency to Groq

**Optimize:**
```python
# In gunicorn_config.py
workers = 8  # Increase
threads = 4  # Increase
worker_connections = 2000  # Increase
```

---

## Backup & Recovery

### Backup Database

```bash
# SSH to Coolify server
ssh user@your-server

# Find container
docker ps | grep groq-chatbot

# Copy database
docker cp CONTAINER_ID:/app/chatbot.db ./backup-$(date +%Y%m%d).db

# Download to local
scp user@your-server:backup-*.db ./
```

### Restore Database

```bash
# Upload backup
scp ./backup-20250113.db user@your-server:

# Copy to container
docker cp backup-20250113.db CONTAINER_ID:/app/chatbot.db

# Restart container
docker restart CONTAINER_ID
```

### Automate Backups

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
CONTAINER=$(docker ps | grep groq-chatbot | awk '{print $1}')
DATE=$(date +%Y%m%d-%H%M%S)
docker cp $CONTAINER:/app/chatbot.db /backups/chatbot-$DATE.db
# Keep only last 7 days
find /backups -name "chatbot-*.db" -mtime +7 -delete
EOF

# Make executable
chmod +x backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup.sh
```

---

## Security

### ✅ Implemented

- Non-root user in container
- No secrets in Git
- Environment variable for API key
- Health check doesn't expose sensitive data
- HTTPS via Coolify (Let's Encrypt)

### 🔒 Recommended Additions

1. **Rate Limiting**
   ```python
   from flask_limiter import Limiter
   limiter = Limiter(app, key_func=get_remote_address)
   
   @app.route('/api/chat')
   @limiter.limit("10/minute")
   def chat():
       ...
   ```

2. **CORS Configuration**
   ```python
   from flask_cors import CORS
   CORS(app, origins=["https://yourdomain.com"])
   ```

3. **Authentication** (if needed)
   ```python
   from flask_httpauth import HTTPBasicAuth
   auth = HTTPBasicAuth()
   
   @app.route('/api/chat')
   @auth.login_required
   def chat():
       ...
   ```

---

## Updates & Rollback

### Deploy Update

```bash
# Make changes
git add .
git commit -m "Feature: Add new functionality"
git push

# Coolify auto-deploys on push
# Watch build in Coolify dashboard
```

### Rollback

**In Coolify:**
1. Go to Deployments
2. Select previous successful deployment
3. Click "Redeploy"
4. Confirm

**Via Git:**
```bash
# Revert to previous commit
git revert HEAD
git push

# Or rollback to specific commit
git reset --hard COMMIT_HASH
git push --force
```

---

## Cost Optimization

### Infrastructure

- **Coolify VPS**: $5-10/month (Hetzner Cloud)
- **Alternative**: DigitalOcean $6/month
- **SSL**: Free (Let's Encrypt)

### Groq API

- Check usage at: https://console.groq.com/usage
- Set up billing alerts
- Monitor API calls in logs

### Total Estimate

- **Small** (1-50 users): $5-10/month
- **Medium** (50-500 users): $10-20/month
- **Large** (500+ users): $20-50/month + API costs

---

## Alternative Deployments

### Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Render.com

1. Connect GitHub repo
2. Select "Docker"
3. Add environment variables
4. Deploy

### DigitalOcean App Platform

1. Create new app
2. Connect GitHub
3. Select Dockerfile
4. Configure environment
5. Deploy

---

## Support

- **Issues**: Create GitHub issue
- **Groq Support**: https://console.groq.com/support
- **Coolify Docs**: https://coolify.io/docs
- **Docker Help**: https://docs.docker.com

---

## 🎉 Deployment Complete!

Your application is now:
- ✅ Production-ready
- ✅ Dockerized
- ✅ Optimized for performance
- ✅ Secure
- ✅ Scalable
- ✅ Monitored

**Next Steps:**
1. Share your chatbot URL
2. Monitor usage and performance
3. Gather user feedback
4. Iterate and improve

**Happy deploying! 🚀**
