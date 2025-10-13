"""
Production configuration for Gunicorn
"""
import multiprocessing
import os

# Early gevent monkey patching to avoid SSL import warnings
def on_starting(server):
    """Called just before the master process is initialized."""
    from gevent import monkey
    monkey.patch_all()

# Server socket
bind = f"0.0.0.0:{os.getenv('PORT', '5000')}"
backlog = 2048

# Worker processes
workers = int(os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))
# Alternative worker classes to avoid monkey-patch warnings:
# - 'sync': Standard synchronous workers (stable, no warnings)
# - 'gthread': Thread-based workers (good for I/O bound apps)
# - 'gevent': Async I/O with greenlets (requires early patching)
worker_class = os.getenv('WORKER_CLASS', 'gthread')  # Changed from 'gevent' to avoid warnings
worker_connections = 1000
threads = int(os.getenv('GUNICORN_THREADS', 4))  # Increased for gthread
max_requests = 1000
max_requests_jitter = 50
timeout = 120
keepalive = 5

# Logging
accesslog = '-'
errorlog = '-'
loglevel = os.getenv('LOG_LEVEL', 'info')
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = 'groq-chatbot'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL (if needed)
# keyfile = None
# certfile = None

# Preload app for better performance
preload_app = True

# Graceful shutdown
graceful_timeout = 30
