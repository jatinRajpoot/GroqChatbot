// Global state
let currentModel = 'mixtral-8x7b-32768';
let currentTTSMode = 'playai-tts|Fritz-PlayAI'; // Format: "model|voice" or "disabled"
let isLoading = false;
let chatHistory = [];
let currentAudio = null; // Track currently playing audio

// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');
const chatContainer = document.getElementById('chatContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const modelSelect = document.getElementById('modelSelect');
const newChatBtn = document.getElementById('newChatBtn');
const ttsSelect = document.getElementById('ttsSelect');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadModels();
    loadChatHistory();
    loadTTSPreference();
    setupEventListeners();
    autoResizeTextarea();
});

// Setup event listeners
function setupEventListeners() {
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    messageInput.addEventListener('input', () => {
        autoResizeTextarea();
        sendBtn.disabled = messageInput.value.trim() === '';
    });
    
    modelSelect.addEventListener('change', (e) => {
        currentModel = e.target.value;
    });
    
    ttsSelect.addEventListener('change', (e) => {
        currentTTSMode = e.target.value;
        // Save preference to localStorage
        localStorage.setItem('tts_preference', currentTTSMode);
        // Stop any playing audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            // Remove playing class from all buttons
            document.querySelectorAll('.speaker-btn.playing').forEach(btn => {
                btn.classList.remove('playing');
            });
        }
    });
    
    newChatBtn.addEventListener('click', startNewChat);
    
    // Example prompts
    document.querySelectorAll('.prompt-card').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prompt = e.currentTarget.dataset.prompt;
            if (prompt) {
                messageInput.value = prompt;
                sendBtn.disabled = false;
                messageInput.focus();
                // Scroll to input on mobile
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                }
            }
        });
    });
}

// Text-to-Speech function using Groq API
async function speakText(text, button) {
    // Stop any currently playing audio
    if (currentAudio) {
        currentAudio.pause();
        // Remove playing class from all buttons
        document.querySelectorAll('.speaker-btn.playing').forEach(btn => {
            btn.classList.remove('playing');
        });
        currentAudio = null;
    }
    
    // If clicking the same button that was playing, just stop
    if (button.classList.contains('playing')) {
        button.classList.remove('playing');
        return;
    }
    
    // Parse model and voice from currentTTSMode
    const [model, voice] = currentTTSMode.split('|');
    
    // Strip HTML tags from text for better speech
    const cleanText = text.replace(/<[^>]*>/g, ' ')
                           .replace(/\s+/g, ' ')
                           .replace(/&lt;/g, '<')
                           .replace(/&gt;/g, '>')
                           .replace(/&amp;/g, '&')
                           .trim();
    
    try {
        // Add playing class immediately for feedback
        button.classList.add('playing');
        button.disabled = true;
        
        // Call Flask TTS endpoint
        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: cleanText,
                model: model,
                voice: voice
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            
            // Special handling for terms required error
            if (errorData.error_type === 'terms_required') {
                alert('⚠️ TTS Setup Required\n\n' + errorData.error + '\n\nThis is a one-time setup. After accepting terms, refresh this page.');
                throw new Error('Terms acceptance required');
            }
            
            throw new Error(errorData.error || 'TTS request failed');
        }
        
        // Get audio blob from response
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Create and play audio
        currentAudio = new Audio(audioUrl);
        
        currentAudio.onended = () => {
            button.classList.remove('playing');
            button.disabled = false;
            currentAudio = null;
            URL.revokeObjectURL(audioUrl); // Clean up
        };
        
        currentAudio.onerror = (e) => {
            console.error('Audio playback error:', e);
            button.classList.remove('playing');
            button.disabled = false;
            currentAudio = null;
            URL.revokeObjectURL(audioUrl);
        };
        
        await currentAudio.play();
        
    } catch (error) {
        console.error('TTS error:', error);
        button.classList.remove('playing');
        button.disabled = false;
        alert('Failed to generate speech. Please try again.');
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 200) + 'px';
}

// Load TTS preference from localStorage
function loadTTSPreference() {
    const savedPreference = localStorage.getItem('tts_preference');
    if (savedPreference) {
        currentTTSMode = savedPreference;
        ttsSelect.value = savedPreference;
    }
}

// Load available models
async function loadModels() {
    try {
        const response = await fetch('/api/models');
        const data = await response.json();
        
        if (data.success) {
            modelSelect.innerHTML = '';
            
            data.models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.id;
                option.textContent = model.id;
                modelSelect.appendChild(option);
            });
            
            // Set default model
            if (data.models.length > 0) {
                currentModel = data.models[0].id;
                modelSelect.value = currentModel;
            }
        }
    } catch (error) {
        console.error('Error loading models:', error);
        showError('Failed to load models. Using default model.');
    }
}

// Load chat history
async function loadChatHistory() {
    try {
        const response = await fetch('/api/history');
        const data = await response.json();
        
        if (data.success && data.history.length > 0) {
            chatHistory = data.history;
            hideWelcomeScreen();
            renderChatHistory();
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// Send message
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || isLoading) return;
    
    // Hide welcome screen
    hideWelcomeScreen();
    
    // Add user message to UI
    addMessage('user', message);
    
    // Clear input
    messageInput.value = '';
    sendBtn.disabled = true;
    autoResizeTextarea();
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    isLoading = true;
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                model: currentModel
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        if (data.success) {
            addMessage('assistant', data.message, data.timestamp);
        } else {
            showError(data.error || 'Failed to get response');
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        showError('Network error. Please try again.');
        console.error('Error sending message:', error);
    } finally {
        isLoading = false;
    }
}

// Add message to UI
function addMessage(role, content, timestamp = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.innerHTML = formatMessage(content);
    
    contentDiv.appendChild(textDiv);
    
    // Add speaker button for AI messages
    if (role === 'assistant' && currentTTSMode !== 'disabled') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const speakerBtn = document.createElement('button');
        speakerBtn.className = 'speaker-btn';
        speakerBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <span>Speak</span>
        `;
        speakerBtn.onclick = () => speakText(content, speakerBtn);
        
        actionsDiv.appendChild(speakerBtn);
        contentDiv.appendChild(actionsDiv);
    }
    
    if (timestamp) {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-timestamp';
        timeDiv.textContent = formatTimestamp(timestamp);
        contentDiv.appendChild(timeDiv);
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Format message with markdown-like syntax
function formatMessage(text) {
    // Escape HTML first
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks (must be processed first)
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const language = lang ? ` class="language-${lang}"` : '';
        return `<pre><code${language}>${code.trim()}</code></pre>`;
    });
    
    // Inline code (before other formatting)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Tables (must be processed before other formatting)
    text = text.replace(/(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g, (match, header, separator, rows) => {
        // Parse header
        const headers = header.split('|').filter(h => h.trim()).map(h => h.trim());
        
        // Parse rows
        const rowLines = rows.trim().split('\n');
        const rowsHtml = rowLines.map(row => {
            const cells = row.split('|').filter(c => c.trim()).map(c => c.trim());
            return '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>';
        }).join('');
        
        // Build table
        const headersHtml = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
        return `<table class="markdown-table"><thead>${headersHtml}</thead><tbody>${rowsHtml}</tbody></table>`;
    });
    
    // Headers (must be at start of line)
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Bold with ** or __
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // Italic with * or _
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // Unordered lists
    text = text.replace(/^\* (.+)$/gm, '<li>$1</li>');
    text = text.replace(/^- (.+)$/gm, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    
    // Ordered lists
    text = text.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    
    // Links
    text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Horizontal rules
    text = text.replace(/^---$/gm, '<hr>');
    text = text.replace(/^\*\*\*$/gm, '<hr>');
    
    // Blockquotes
    text = text.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // Line breaks (convert \n\n to paragraphs, single \n to <br>)
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    text = `<p>${text}</p>`;
    
    // Clean up empty paragraphs
    text = text.replace(/<p><\/p>/g, '');
    text = text.replace(/<p>\s*<\/p>/g, '');
    
    return text;
}

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Show typing indicator
function showTypingIndicator() {
    const typingId = 'typing-' + Date.now();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';
    messageDiv.id = typingId;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'AI';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
    
    contentDiv.appendChild(typingDiv);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    return typingId;
}

// Remove typing indicator
function removeTypingIndicator(typingId) {
    const indicator = document.getElementById(typingId);
    if (indicator) {
        indicator.remove();
    }
}

// Render chat history
function renderChatHistory() {
    messagesContainer.innerHTML = '';
    
    chatHistory.forEach(msg => {
        addMessage(msg.role, msg.content, msg.timestamp);
    });
}

// Hide welcome screen
function hideWelcomeScreen() {
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
}

// Show welcome screen
function showWelcomeScreen() {
    if (welcomeScreen) {
        welcomeScreen.style.display = 'flex';
    }
    messagesContainer.innerHTML = '';
}

// Start new chat
async function startNewChat() {
    if (confirm('Start a new chat? Current conversation will be saved.')) {
        try {
            const response = await fetch('/api/new-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                chatHistory = [];
                showWelcomeScreen();
                messageInput.value = '';
                sendBtn.disabled = true;
            }
        } catch (error) {
            console.error('Error starting new chat:', error);
            showError('Failed to start new chat');
        }
    }
}

// Show error
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    messagesContainer.appendChild(errorDiv);
    scrollToBottom();
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Scroll to bottom
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
