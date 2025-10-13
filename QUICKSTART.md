# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Get Your API Key
1. Go to [https://console.groq.com/](https://console.groq.com/)
2. Sign up (free)
3. Create API key
4. Copy it

### Step 2: Configure
Open `.env` file and paste your key:
```
GROQ_API_KEY=your_key_here
```

### Step 3: Run
```powershell
python app.py
```

### Step 4: Open Browser
Navigate to: **http://localhost:5000**

---

## ✨ Features You Can Try

### 1. Markdown Formatting
Try asking:
> "Write a markdown tutorial with headers, bold text, lists, and code examples"

You'll see:
- **Bold** and *italic* text
- Headers (# ## ###)
- Code blocks with syntax highlighting
- Lists and links

### 2. Multiple Models
- Click the model dropdown in the top-right
- Try different models:
  - `mixtral-8x7b-32768` (versatile)
  - `llama3-70b-8192` (powerful)
  - `gemma-7b-it` (fast)

### 3. Persistent Chat History
- All your chats are saved in `chatbot.db`
- Close the browser and come back - your history is still there!
- Click "New Chat" to start fresh
- Click "Clear History" to delete current conversation

### 4. Example Prompts
Click any of the example prompt buttons to get started quickly:
- 💡 Explain quantum computing
- 💻 Write Python code
- 🌐 Web development tips
- 🚀 Brainstorm ideas

---

## 🎨 Markdown Examples

### Try These Prompts:

**For Headers:**
```
Give me a structured overview of machine learning with headers
```

**For Code:**
```
Write a Python function to calculate Fibonacci numbers with explanation
```

**For Lists:**
```
List the top 10 best practices for web development
```

**For Mixed Formatting:**
```
Create a tutorial on REST APIs with examples, including headers, code blocks, and lists
```

---

## 💾 Database Features

### View Statistics
Open a new terminal and run:
```powershell
curl http://localhost:5000/api/stats
```

### Backup Your Chats
```powershell
copy chatbot.db my_backup.db
```

### See All Sessions
```powershell
curl http://localhost:5000/api/sessions
```

---

## 🔧 Common Tasks

### Change the Port
Edit `app.py`, line at the bottom:
```python
app.run(debug=True, host='0.0.0.0', port=8080)  # Change 5000 to 8080
```

### Use a Different Model by Default
Edit `app.py`, find:
```python
selected_model = data.get('model', 'mixtral-8x7b-32768')
```
Change to:
```python
selected_model = data.get('model', 'llama3-70b-8192')
```

### Clear All Chat History
1. Stop the server (Ctrl+C)
2. Delete `chatbot.db`
3. Restart the server

---

## 📱 Mobile Access

The app works on mobile! On your phone's browser, go to:
```
http://YOUR_COMPUTER_IP:5000
```

Find your IP: Run `ipconfig` and look for IPv4 Address.

---

## 🐛 Troubleshooting

### "Module not found" Error
```powershell
pip install -r requirements.txt
```

### API Key Error
Check that `.env` file exists and contains:
```
GROQ_API_KEY=gsk_...
```

### Port Already in Use
Change the port number in `app.py` (see above)

### Database Locked
Close any other terminals running the app

---

## 💡 Pro Tips

1. **Use Shift+Enter** for multi-line input
2. **Scroll through history** to see all your past conversations
3. **Try different models** for different tasks:
   - Mixtral: Great for reasoning
   - LLaMA3 70B: Best quality
   - Gemma: Fastest responses
4. **Format your questions** with context for better answers
5. **Save important conversations** by backing up the database

---

## 🎯 Next Steps

- Read [DATABASE.md](DATABASE.md) for database details
- Check [CHANGELOG.md](CHANGELOG.md) for updates
- Read full [README.md](README.md) for advanced features

---

**Enjoy your AI chatbot! 🎉**

Need help? Check the troubleshooting section or review the full documentation.
