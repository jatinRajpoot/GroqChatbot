from flask import Flask, render_template, request, jsonify, session
import os
from datetime import datetime
from dotenv import load_dotenv
from groq_client import GroqClient
import secrets
import database as db

load_dotenv()

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Initialize Groq client
groq_client = GroqClient(api_key=os.getenv('GROQ_API_KEY'))

# Initialize database
db.init_db()

@app.route('/')
def index():
    """Render the main chat interface"""
    # Initialize session if not exists
    if 'session_id' not in session:
        session_id = secrets.token_hex(8)
        session['session_id'] = session_id
        db.create_session(session_id)
    
    return render_template('index.html')

@app.route('/debug')
def debug():
    """Render debug page"""
    return render_template('debug.html')

@app.route('/api/models', methods=['GET'])
def get_models():
    """Get list of available Groq models"""
    try:
        models = groq_client.list_models()
        return jsonify({
            'success': True,
            'models': models
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.json
        user_message = data.get('message')
        selected_model = data.get('model', 'mixtral-8x7b-32768')
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        # Get or create session
        session_id = session.get('session_id')
        if not session_id:
            session_id = secrets.token_hex(8)
            session['session_id'] = session_id
            db.create_session(session_id)
        
        # Add user message to database
        db.add_message(session_id, 'user', user_message, selected_model)
        
        # Get chat history for context from database
        chat_history = db.get_session_messages(session_id)
        
        # Prepare messages for Groq API (only role and content)
        messages = [{'role': msg['role'], 'content': msg['content']} for msg in chat_history]
        
        # Get response from Groq
        assistant_message = groq_client.chat(messages, model=selected_model)
        
        # Add assistant message to database
        saved_message = db.add_message(session_id, 'assistant', assistant_message, selected_model)
        
        return jsonify({
            'success': True,
            'message': assistant_message,
            'timestamp': saved_message['timestamp'] if saved_message else datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get chat history for current session"""
    session_id = session.get('session_id')
    if not session_id:
        return jsonify({
            'success': True,
            'history': []
        })
    
    # Get messages from database
    messages = db.get_session_messages(session_id)
    
    return jsonify({
        'success': True,
        'history': messages
    })

@app.route('/api/clear', methods=['POST'])
def clear_history():
    """Clear chat history for current session"""
    session_id = session.get('session_id')
    if session_id:
        db.clear_session_messages(session_id)
    
    return jsonify({
        'success': True,
        'message': 'Chat history cleared'
    })

@app.route('/api/new-chat', methods=['POST'])
def new_chat():
    """Start a new chat session"""
    # Create new session ID
    new_session_id = secrets.token_hex(8)
    session['session_id'] = new_session_id
    db.create_session(new_session_id)
    
    return jsonify({
        'success': True,
        'message': 'New chat started',
        'session_id': new_session_id
    })

@app.route('/api/switch-session', methods=['POST'])
def switch_session():
    """Switch to a different chat session"""
    try:
        data = request.json
        session_id = data.get('session_id')
        
        if not session_id:
            return jsonify({
                'success': False,
                'error': 'Session ID required'
            }), 400
        
        # Check if session exists
        if db.get_session(session_id):
            session['session_id'] = session_id
            return jsonify({
                'success': True,
                'message': 'Session switched'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Session not found'
            }), 404
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sessions', methods=['GET'])
def get_sessions():
    """Get all chat sessions"""
    try:
        sessions = db.get_all_sessions()
        current_session = session.get('session_id')
        return jsonify({
            'success': True,
            'sessions': sessions,
            'current_session': current_session
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/sessions/<session_id>', methods=['DELETE'])
def delete_session_route(session_id):
    """Delete a specific session"""
    try:
        count = db.delete_session(session_id)
        return jsonify({
            'success': True,
            'message': f'Session deleted',
            'deleted': count > 0
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get database statistics"""
    try:
        stats = db.get_database_stats()
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for container orchestration"""
    try:
        # Check database connection
        stats = db.get_database_stats()
        
        # Check Groq API (simple model list)
        models = groq_client.list_models()
        
        return jsonify({
            'status': 'healthy',
            'database': 'connected',
            'api': 'connected',
            'sessions': stats.get('total_sessions', 0),
            'messages': stats.get('total_messages', 0)
        }), 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 503

@app.route('/api/tts', methods=['POST'])
def text_to_speech():
    """Convert text to speech using Groq TTS API"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        model = data.get('model', 'playai-tts')
        voice = data.get('voice', 'Fritz-PlayAI')
        
        if not text:
            return jsonify({
                'success': False,
                'error': 'Text is required'
            }), 400
        
        # Limit text length (Groq supports max 10K characters)
        if len(text) > 10000:
            text = text[:10000]
        
        # Call Groq TTS API
        audio_content = groq_client.text_to_speech(
            text=text,
            model=model,
            voice=voice
        )
        
        # Return audio as WAV file
        from flask import Response
        return Response(
            audio_content,
            mimetype='audio/wav',
            headers={
                'Content-Disposition': 'inline; filename="speech.wav"'
            }
        )
        
    except Exception as e:
        error_msg = str(e)
        
        # Check for terms acceptance error
        if 'terms acceptance' in error_msg.lower():
            return jsonify({
                'success': False,
                'error': 'TTS requires terms acceptance. Please visit https://console.groq.com/playground?model=playai-tts to accept terms.',
                'error_type': 'terms_required'
            }), 403
        
        return jsonify({
            'success': False,
            'error': error_msg
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
