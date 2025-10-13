import sqlite3
import json
from datetime import datetime
from contextlib import contextmanager
import os
import threading
import time
from functools import wraps

DATABASE_PATH = os.getenv('DATABASE_PATH', 'chatbot.db')

# Thread-local storage for database connections
_thread_local = threading.local()

def retry_on_locked(max_retries=3, delay=0.1):
    """Decorator to retry database operations on lock errors"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except sqlite3.OperationalError as e:
                    if 'locked' in str(e).lower() and attempt < max_retries - 1:
                        time.sleep(delay * (attempt + 1))
                        continue
                    raise
            return func(*args, **kwargs)
        return wrapper
    return decorator

@contextmanager
def get_db():
    """Context manager for database connections with proper locking"""
    conn = sqlite3.connect(
        DATABASE_PATH,
        timeout=30.0,  # Wait up to 30 seconds for lock
        check_same_thread=False,
        isolation_level=None  # Autocommit mode - prevents locks
    )
    conn.row_factory = sqlite3.Row
    
    # Enable WAL mode for better concurrency
    conn.execute('PRAGMA journal_mode=WAL')
    conn.execute('PRAGMA busy_timeout=30000')  # 30 seconds
    conn.execute('PRAGMA synchronous=NORMAL')  # Faster writes
    
    try:
        yield conn
    except Exception as e:
        raise e
    finally:
        conn.close()

def init_db():
    """Initialize database with required tables"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Enable WAL mode for better concurrency
        cursor.execute('PRAGMA journal_mode=WAL')
        
        # Create sessions table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_sessions (
                session_id TEXT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                title TEXT
            )
        ''')
        
        # Create messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                model TEXT,
                FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id) ON DELETE CASCADE
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_messages_session 
            ON messages(session_id, timestamp)
        ''')
        
        cursor.execute('''
            CREATE INDEX IF NOT EXISTS idx_sessions_updated 
            ON chat_sessions(updated_at DESC)
        ''')

def create_session(session_id, title=None):
    """Create a new chat session"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'INSERT OR IGNORE INTO chat_sessions (session_id, title) VALUES (?, ?)',
            (session_id, title or f'Chat {session_id[:8]}')
        )
        return session_id

def get_session(session_id):
    """Get session details"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'SELECT * FROM chat_sessions WHERE session_id = ?',
            (session_id,)
        )
        row = cursor.fetchone()
        return dict(row) if row else None

def update_session_timestamp(session_id):
    """Update the last updated timestamp for a session"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?',
            (session_id,)
        )

def get_all_sessions(limit=50):
    """Get all chat sessions ordered by most recent"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            '''SELECT s.*, COUNT(m.id) as message_count 
               FROM chat_sessions s 
               LEFT JOIN messages m ON s.session_id = m.session_id 
               GROUP BY s.session_id 
               ORDER BY s.updated_at DESC 
               LIMIT ?''',
            (limit,)
        )
        return [dict(row) for row in cursor.fetchall()]

@retry_on_locked(max_retries=5, delay=0.2)
def add_message(session_id, role, content, model=None):
    """Add a message to a session"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Ensure session exists
        cursor.execute('SELECT session_id FROM chat_sessions WHERE session_id = ?', (session_id,))
        if not cursor.fetchone():
            cursor.execute(
                'INSERT OR IGNORE INTO chat_sessions (session_id, title) VALUES (?, ?)',
                (session_id, f'Chat {session_id[:8]}')
            )
        
        # Insert message
        cursor.execute(
            '''INSERT INTO messages (session_id, role, content, model) 
               VALUES (?, ?, ?, ?)''',
            (session_id, role, content, model)
        )
        
        # Update session timestamp
        cursor.execute(
            'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?',
            (session_id,)
        )
        
        # Get the inserted message
        message_id = cursor.lastrowid
        cursor.execute('SELECT * FROM messages WHERE id = ?', (message_id,))
        row = cursor.fetchone()
        return dict(row) if row else None

@retry_on_locked(max_retries=5, delay=0.2)
def get_session_messages(session_id):
    """Get all messages for a session"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            '''SELECT * FROM messages 
               WHERE session_id = ? 
               ORDER BY timestamp ASC''',
            (session_id,)
        )
        return [dict(row) for row in cursor.fetchall()]

@retry_on_locked(max_retries=5, delay=0.2)
def clear_session_messages(session_id):
    """Clear all messages from a session"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM messages WHERE session_id = ?', (session_id,))
        cursor.execute(
            'UPDATE chat_sessions SET updated_at = CURRENT_TIMESTAMP WHERE session_id = ?',
            (session_id,)
        )
        return cursor.rowcount

def delete_session(session_id):
    """Delete a session and all its messages"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM chat_sessions WHERE session_id = ?', (session_id,))
        return cursor.rowcount

def get_session_title(session_id):
    """Get the title of a session"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT title FROM chat_sessions WHERE session_id = ?', (session_id,))
        row = cursor.fetchone()
        return row['title'] if row else None

def update_session_title(session_id, title):
    """Update the title of a session"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE chat_sessions SET title = ? WHERE session_id = ?',
            (title, session_id)
        )
        return cursor.rowcount

def search_messages(query, limit=50):
    """Search messages by content"""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute(
            '''SELECT m.*, s.title 
               FROM messages m 
               JOIN chat_sessions s ON m.session_id = s.session_id 
               WHERE m.content LIKE ? 
               ORDER BY m.timestamp DESC 
               LIMIT ?''',
            (f'%{query}%', limit)
        )
        return [dict(row) for row in cursor.fetchall()]

def get_database_stats():
    """Get database statistics"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        cursor.execute('SELECT COUNT(*) as count FROM chat_sessions')
        session_count = cursor.fetchone()['count']
        
        cursor.execute('SELECT COUNT(*) as count FROM messages')
        message_count = cursor.fetchone()['count']
        
        cursor.execute('SELECT COUNT(DISTINCT session_id) as count FROM messages')
        active_sessions = cursor.fetchone()['count']
        
        return {
            'total_sessions': session_count,
            'total_messages': message_count,
            'active_sessions': active_sessions
        }

# Initialize database on module import
if not os.path.exists(DATABASE_PATH):
    init_db()
    print(f"Database initialized: {DATABASE_PATH}")
else:
    # Ensure tables exist even if database file exists
    init_db()
