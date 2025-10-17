export default function Home() {
  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-title">
            <h2>🤖 AI Chat</h2>
            <span className="header-subtitle">(In-memory session — no persistence)</span>
          </div>

          <button className="new-chat-btn" id="newChatBtn" title="Clear chat and start fresh">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Chat
          </button>

          {/* Desktop selectors */}
          <div className="model-selector desktop-only">
            <label htmlFor="providerSelect">Provider:</label>
            <select id="providerSelect" className="model-select">
              <option value="groq">Groq</option>
              <option value="gemini">Gemini</option>
              <option value="openrouter">OpenRouter (Free)</option>
            </select>
          </div>

          <div className="model-selector desktop-only">
            <label htmlFor="modelSelect">Model:</label>
            <select id="modelSelect" className="model-select">
              <option value="">Loading models...</option>
            </select>
          </div>

          <div className="tts-selector desktop-only">
            <label htmlFor="ttsSelect">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </label>
            <select id="ttsSelect" className="tts-select">
              <option value="disabled">TTS: Disabled</option>
              <optgroup label="English Voices (PlayAI)">
                <option value="playai-tts|Arista-PlayAI">Arista (Female)</option>
                <option value="playai-tts|Atlas-PlayAI">Atlas (Male)</option>
                <option value="playai-tts|Basil-PlayAI">Basil (Male)</option>
                <option value="playai-tts|Briggs-PlayAI">Briggs (Male)</option>
                <option value="playai-tts|Calum-PlayAI">Calum (Male)</option>
                <option value="playai-tts|Celeste-PlayAI">Celeste (Female)</option>
                <option value="playai-tts|Cheyenne-PlayAI">Cheyenne (Female)</option>
                <option value="playai-tts|Chip-PlayAI">Chip (Male)</option>
                <option value="playai-tts|Cillian-PlayAI">Cillian (Male)</option>
                <option value="playai-tts|Deedee-PlayAI">Deedee (Female)</option>
                <option value="playai-tts|Fritz-PlayAI" selected>Fritz (Male)</option>
                <option value="playai-tts|Gail-PlayAI">Gail (Female)</option>
                <option value="playai-tts|Indigo-PlayAI">Indigo (Neutral)</option>
                <option value="playai-tts|Mamaw-PlayAI">Mamaw (Female)</option>
                <option value="playai-tts|Mason-PlayAI">Mason (Male)</option>
                <option value="playai-tts|Mikail-PlayAI">Mikail (Male)</option>
                <option value="playai-tts|Mitch-PlayAI">Mitch (Male)</option>
                <option value="playai-tts|Quinn-PlayAI">Quinn (Female)</option>
                <option value="playai-tts|Thunder-PlayAI">Thunder (Male)</option>
              </optgroup>
              <optgroup label="Arabic Voices (PlayAI)">
                <option value="playai-tts-arabic|Ahmad-PlayAI">Ahmad (Male)</option>
                <option value="playai-tts-arabic|Amira-PlayAI">Amira (Female)</option>
                <option value="playai-tts-arabic|Khalid-PlayAI">Khalid (Male)</option>
                <option value="playai-tts-arabic|Nasser-PlayAI">Nasser (Male)</option>
              </optgroup>
            </select>
          </div>

          {/* Mobile: Hamburger */}
          <button className="hamburger-btn mobile-only" id="hamburgerBtn" title="Settings" aria-label="Open settings menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Mobile Settings Panel */}
        <div className="settings-panel" id="settingsPanel">
          <div className="settings-header">
            <h3>Settings</h3>
            <button className="close-settings-btn" id="closeSettingsBtn" aria-label="Close settings">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="settings-content">
            <div className="setting-group">
              <label htmlFor="mobileProviderSelect">Provider</label>
              <select id="mobileProviderSelect" className="setting-select">
                <option value="groq">Groq</option>
                <option value="gemini">Gemini</option>
                <option value="openrouter">OpenRouter (Free)</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="mobileModelSelect">Model</label>
              <select id="mobileModelSelect" className="setting-select">
                <option value="">Loading models...</option>
              </select>
            </div>

            <div className="setting-group">
              <label htmlFor="mobileTTSSelect">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }}>
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                Text-to-Speech
              </label>
              <select id="mobileTTSSelect" className="setting-select">
                <option value="disabled">Disabled</option>
                <optgroup label="English Voices (PlayAI)">
                  <option value="playai-tts|Arista-PlayAI">Arista (Female)</option>
                  <option value="playai-tts|Atlas-PlayAI">Atlas (Male)</option>
                  <option value="playai-tts|Basil-PlayAI">Basil (Male)</option>
                  <option value="playai-tts|Briggs-PlayAI">Briggs (Male)</option>
                  <option value="playai-tts|Calum-PlayAI">Calum (Male)</option>
                  <option value="playai-tts|Celeste-PlayAI">Celeste (Female)</option>
                  <option value="playai-tts|Cheyenne-PlayAI">Cheyenne (Female)</option>
                  <option value="playai-tts|Chip-PlayAI">Chip (Male)</option>
                  <option value="playai-tts|Cillian-PlayAI">Cillian (Male)</option>
                  <option value="playai-tts|Deedee-PlayAI">Deedee (Female)</option>
                  <option value="playai-tts|Fritz-PlayAI" selected>Fritz (Male)</option>
                  <option value="playai-tts|Gail-PlayAI">Gail (Female)</option>
                  <option value="playai-tts|Indigo-PlayAI">Indigo (Neutral)</option>
                  <option value="playai-tts|Mamaw-PlayAI">Mamaw (Female)</option>
                  <option value="playai-tts|Mason-PlayAI">Mason (Male)</option>
                  <option value="playai-tts|Mikail-PlayAI">Mikail (Male)</option>
                  <option value="playai-tts|Mitch-PlayAI">Mitch (Male)</option>
                  <option value="playai-tts|Quinn-PlayAI">Quinn (Female)</option>
                  <option value="playai-tts|Thunder-PlayAI">Thunder (Male)</option>
                </optgroup>
                <optgroup label="Arabic Voices (PlayAI)">
                  <option value="playai-tts-arabic|Ahmad-PlayAI">Ahmad (Male)</option>
                  <option value="playai-tts-arabic|Amira-PlayAI">Amira (Female)</option>
                  <option value="playai-tts-arabic|Khalid-PlayAI">Khalid (Male)</option>
                  <option value="playai-tts-arabic|Nasser-PlayAI">Nasser (Male)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Settings overlay for mobile */}
        <div className="settings-overlay" id="settingsOverlay"></div>

        {/* Chat Area */}
        <div className="chat-container" id="chatContainer">
          <div className="welcome-screen" id="welcomeScreen">
            <div className="welcome-content">
              <h1>🤖 Welcome to Groq AI Chat</h1>
              <p className="welcome-subtitle">Powered by 20+ open-source AI models</p>

              {/* Quick Guide */}
              <div className="quick-guide">
                <div className="guide-card">
                  <div className="guide-icon">🎯</div>
                  <h3>Choose Your Model</h3>
                  <p>
                    Select from <strong>20+ AI models</strong> in the dropdown above
                  </p>
                  <div className="model-examples">
                    <span className="model-tag">Mixtral 8x7B</span>
                    <span className="model-tag">LLaMA 3.1</span>
                    <span className="model-tag">Qwen 2.5</span>
                  </div>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">🔊</div>
                  <h3>Text-to-Speech</h3>
                  <p>Choose from <strong>23 voices</strong> to hear responses</p>
                  <p className="guide-hint">
                    Click
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle' }}>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    </svg>
                    on any response
                  </p>
                </div>

                <div className="guide-card">
                  <div className="guide-icon">💬</div>
                  <h3>Start Chatting</h3>
                  <p>Type your message below or try an example prompt</p>
                  <p className="guide-hint">
                    <kbd>Enter</kbd> to send • <kbd>Shift+Enter</kbd> for new line
                  </p>
                </div>
              </div>

              {/* Example Prompts */}
              <div className="prompts-section">
                <h3 className="prompts-title">✨ Try These Prompts</h3>
                <div className="example-prompts">
                  <button className="example-prompt" data-prompt="Explain quantum computing in simple terms">
                    <span className="prompt-icon">💡</span>
                    <span className="prompt-text">Explain quantum computing</span>
                  </button>
                  <button className="example-prompt" data-prompt="Write a Python function to sort a list">
                    <span className="prompt-icon">💻</span>
                    <span className="prompt-text">Write Python code</span>
                  </button>
                  <button className="example-prompt" data-prompt="What are the best practices for web development?">
                    <span className="prompt-icon">🌐</span>
                    <span className="prompt-text">Web development tips</span>
                  </button>
                  <button className="example-prompt" data-prompt="Help me brainstorm ideas for a startup">
                    <span className="prompt-icon">🚀</span>
                    <span className="prompt-text">Brainstorm ideas</span>
                  </button>
                  <button className="example-prompt" data-prompt="Create a detailed comparison table of programming languages">
                    <span className="prompt-icon">📊</span>
                    <span className="prompt-text">Compare programming languages</span>
                  </button>
                  <button className="example-prompt" data-prompt="Write a creative short story about AI">
                    <span className="prompt-icon">✍️</span>
                    <span className="prompt-text">Write a creative story</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="messages" id="messages">{/* Messages will be added here */}</div>
        </div>

        {/* Input Area */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea id="messageInput" placeholder="Send a message..." rows={1} maxLength={4000}></textarea>
            <button id="sendBtn" className="send-btn" disabled>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
          <div className="input-footer">
            <small>Press Enter to send, Shift+Enter for new line</small>
          </div>
        </div>
      </div>
    </div>
  );
}
