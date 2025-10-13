"""
WSGI entry point with early gevent monkey patching.
Use this file if you want to run with gevent worker class.

To use this with gunicorn:
    gunicorn -c gunicorn_config.py wsgi_gevent:app

Or update Dockerfile CMD to:
    CMD ["gunicorn", "-c", "gunicorn_config.py", "wsgi_gevent:app"]
"""

# CRITICAL: Monkey patch BEFORE any other imports
from gevent import monkey
monkey.patch_all()

# Now import the Flask app
from app import app

# Export for gunicorn
__all__ = ['app']
