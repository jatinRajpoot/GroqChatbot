# Groq AI Chatbot 🤖

A modern, ChatGPT-like web application built with Flask and powered by Groq's API for accessing open-source AI models. Features a sleek dark interface, chat history management, and support for multiple AI models.

![Groq Chatbot](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## Features ✨

- 🎨 **Modern UI** - ChatGPT-inspired dark theme interface
- 🤖 **Multiple AI Models** - Access to various open-source models via Groq API:
  - Mixtral 8x7B
  - LLaMA2 70B
  - LLaMA3 8B/70B
  - Gemma 7B
  - And more!
- � **SQLite Database** - Persistent chat history storage across sessions
- 📝 **Rich Markdown Formatting** - Full support for:
  - Headers (# ## ###)
  - Bold (**text** or __text__)
  - Italic (*text* or _text_)
  - Code blocks with syntax highlighting
  - Inline code
  - Lists (ordered and unordered)
  - Links and blockquotes
- �💬 **Chat History** - Persistent conversation history within sessions
- 🔄 **Real-time Responses** - Fast responses from Groq API
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎯 **Example Prompts** - Quick-start conversation templates
- 🔒 **Session Management** - Isolated chat sessions per user
- 📊 **Database Stats** - Track usage and statistics

## Screenshots 📸

The application features:
- Clean, dark-themed interface
- Sidebar with chat history management
- Model selection dropdown
- Typing indicators
- Formatted code blocks in responses
- Mobile-responsive design

## Prerequisites 📋

- Python 3.8 or higher
- Groq API key (free tier available)
- pip (Python package manager)

## Installation 🚀

### 1. Clone or Download the Repository

```bash
cd AIoutputs
```

### 2. Create a Virtual Environment (Recommended)

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

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Get Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy your API key

### 5. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your_actual_groq_api_key_here
   ```

## Usage 🎯

### Starting the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

### Using the Chatbot

1. **Open your browser** and navigate to `http://localhost:5000`
2. **Select a model** from the dropdown in the top-right corner
3. **Type your message** in the input box at the bottom
4. **Press Enter** or click the send button
5. **View responses** in real-time

### Keyboard Shortcuts

- `Enter` - Send message
- `Shift + Enter` - New line in message input

### Features to Explore

- **New Chat** - Start a fresh conversation
- **Clear History** - Remove all messages from current session
- **Model Selection** - Switch between different AI models
- **Example Prompts** - Click on suggested prompts to get started

## Project Structure 📁

```
AIoutputs/
├── app.py                 # Main Flask application
├── groq_client.py         # Groq API integration
├── database.py            # SQLite database functions
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .env                  # Your API keys (not in repo)
├── .gitignore            # Git ignore file
├── DATABASE.md           # Database schema documentation
├── chatbot.db            # SQLite database (auto-created)
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Application styles
    └── js/
        └── app.js        # Frontend JavaScript
```

## API Endpoints 🔌

- `GET /` - Main chat interface
- `GET /api/models` - List available AI models
- `POST /api/chat` - Send chat message
- `GET /api/history` - Get chat history for current session
- `POST /api/clear` - Clear current session messages
- `POST /api/new-chat` - Start new chat session
- `GET /api/sessions` - Get all chat sessions
- `DELETE /api/sessions/<id>` - Delete a specific session
- `GET /api/stats` - Get database statistics

## Available Models 🎭

The application supports various open-source models through Groq:

- **Mixtral 8x7B** - Powerful mixture of experts model
- **LLaMA2 70B** - Meta's large language model
- **LLaMA3 8B/70B** - Latest LLaMA models
- **Gemma 7B** - Google's instruction-tuned model

Models are dynamically loaded from the Groq API.

## Configuration ⚙️

### Customizing the Application

**Change Default Model:**
Edit `app.py`:
```python
selected_model = data.get('model', 'your-preferred-model-id')
```

**Modify Response Parameters:**
Edit `groq_client.py`:
```python
def chat(self, messages, model='mixtral-8x7b-32768', temperature=0.7, max_tokens=1024):
```

**Change Port:**
Edit `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

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
- Change port in `app.py` or stop other application using port 5000

**Models Not Loading**
- Check internet connection
- Verify API key is valid
- Check Groq API status

## Development 💻

### Running in Development Mode

The app runs in debug mode by default:
```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

### Production Deployment

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## Security Notes 🔐

- Never commit `.env` file to version control
- Keep your Groq API key secure
- Use environment variables for sensitive data
- Database file (`chatbot.db`) contains all chat history - secure it appropriately
- Implement rate limiting for production use
- Add authentication for multi-user deployments
- Regular database backups recommended

## Database Management 💾

### View Database Stats
```bash
curl http://localhost:5000/api/stats
```

### Backup Database
```bash
copy chatbot.db chatbot_backup_2025-10-13.db
```

### Clear All Data
Delete the `chatbot.db` file and restart the application to create a fresh database.

For more database details, see [DATABASE.md](DATABASE.md)

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
- **Flask** - Micro web framework
- **OpenAI** - For the ChatGPT interface inspiration

## Support 💬

For issues and questions:
- Check the troubleshooting section
- Review Groq API documentation
- Open an issue in the repository

## Future Enhancements 🚀

Potential features to add:
- [x] SQLite database for persistent storage
- [x] Rich markdown formatting support
- [ ] Streaming responses for real-time text generation
- [ ] User authentication system
- [ ] Export chat conversations (PDF, JSON, Markdown)
- [ ] File upload support
- [ ] Voice input/output
- [ ] Custom system prompts
- [ ] Rate limiting and usage tracking
- [ ] Multiple language support
- [ ] Dark/Light theme toggle
- [ ] Search across all conversations

---

**Built with ❤️ using Flask and Groq API**
