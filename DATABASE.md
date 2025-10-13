# Database Schema Documentation

## Overview
The chatbot uses SQLite for persistent storage of chat sessions and messages.

## Tables

### chat_sessions
Stores information about each chat session.

| Column | Type | Description |
|--------|------|-------------|
| session_id | TEXT | Primary key, unique identifier for the session |
| created_at | TIMESTAMP | When the session was created |
| updated_at | TIMESTAMP | Last time the session was updated |
| title | TEXT | Display name for the session |

**Indexes:**
- `idx_sessions_updated` on `updated_at DESC` for efficient recent session retrieval

### messages
Stores all chat messages.

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key, auto-increment |
| session_id | TEXT | Foreign key to chat_sessions |
| role | TEXT | Either 'user' or 'assistant' |
| content | TEXT | The message content |
| timestamp | TIMESTAMP | When the message was created |
| model | TEXT | The AI model used (for assistant messages) |

**Indexes:**
- `idx_messages_session` on `(session_id, timestamp)` for efficient message retrieval

**Foreign Keys:**
- `session_id` references `chat_sessions(session_id)` with `ON DELETE CASCADE`

## Database Functions

### Session Management
- `create_session(session_id, title)` - Create a new chat session
- `get_session(session_id)` - Get session details
- `get_all_sessions(limit)` - List all sessions with message counts
- `update_session_title(session_id, title)` - Update session display name
- `delete_session(session_id)` - Delete a session and all its messages

### Message Management
- `add_message(session_id, role, content, model)` - Add a message to a session
- `get_session_messages(session_id)` - Get all messages for a session
- `clear_session_messages(session_id)` - Delete all messages in a session
- `search_messages(query, limit)` - Search messages by content

### Statistics
- `get_database_stats()` - Get total sessions, messages, and active sessions

## Example Queries

### Get all messages in a session
```python
messages = db.get_session_messages('abc123')
for msg in messages:
    print(f"{msg['role']}: {msg['content']}")
```

### Create a new conversation
```python
session_id = secrets.token_hex(8)
db.create_session(session_id, "My New Chat")
db.add_message(session_id, 'user', 'Hello!', None)
```

### Search across all messages
```python
results = db.search_messages('python programming', limit=10)
```

## Backup and Restore

### Backup
```bash
# Simple file copy
copy chatbot.db chatbot_backup.db
```

### Restore
```bash
# Stop the application first
copy chatbot_backup.db chatbot.db
```

### Export to JSON
```python
import sqlite3
import json

conn = sqlite3.connect('chatbot.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Export all sessions
cursor.execute('SELECT * FROM chat_sessions')
sessions = [dict(row) for row in cursor.fetchall()]

# Export all messages
cursor.execute('SELECT * FROM messages')
messages = [dict(row) for row in cursor.fetchall()]

with open('backup.json', 'w') as f:
    json.dump({'sessions': sessions, 'messages': messages}, f, indent=2)

conn.close()
```

## Maintenance

### View database size
```bash
dir chatbot.db
```

### Vacuum database (optimize and reclaim space)
```python
import sqlite3
conn = sqlite3.connect('chatbot.db')
conn.execute('VACUUM')
conn.close()
```

### Clear all data
```sql
DELETE FROM messages;
DELETE FROM chat_sessions;
VACUUM;
```

## Performance Considerations

- Indexes are created on frequently queried columns
- Messages are retrieved in chronological order by default
- Session updates use timestamps for sorting by recency
- CASCADE delete ensures orphaned messages are cleaned up
- SQLite is efficient for read-heavy workloads typical of chat applications

## Database File Location

The database file `chatbot.db` is created in the application root directory (`E:\AIoutputs\`).
