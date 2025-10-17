'use client'

import { Model } from '@/app/page'
import { motion } from 'framer-motion'

interface HeaderProps {
  currentProvider: string
  currentModel: string
  currentTTS: string
  models: Model[]
  onProviderChange: (provider: string) => void
  onModelChange: (model: string) => void
  onTTSChange: (tts: string) => void
  onNewChat: () => void
  onOpenSettings: () => void
}

export default function Header({
  currentProvider,
  currentModel,
  currentTTS,
  models,
  onProviderChange,
  onModelChange,
  onTTSChange,
  onNewChat,
  onOpenSettings,
}: HeaderProps) {
  return (
    <div className="header">
      <div className="header-title">
        <h2>🤖 AI Chat</h2>
        <span className="header-subtitle">(In-memory session — no persistence)</span>
      </div>
      
      <motion.button
        className="new-chat-btn"
        onClick={onNewChat}
        title="Clear chat and start fresh"
        whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-secondary)' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Chat
      </motion.button>
      
      {/* Desktop: Show selectors inline */}
      <div className="model-selector desktop-only">
        <label htmlFor="providerSelect">Provider:</label>
        <select
          id="providerSelect"
          className="model-select"
          value={currentProvider}
          onChange={(e) => onProviderChange(e.target.value)}
        >
          <option value="groq">Groq</option>
          <option value="gemini">Gemini</option>
          <option value="openrouter">OpenRouter (Free)</option>
        </select>
      </div>

      <div className="model-selector desktop-only">
        <label htmlFor="modelSelect">Model:</label>
        <select
          id="modelSelect"
          className="model-select"
          value={currentModel}
          onChange={(e) => onModelChange(e.target.value)}
        >
          {models.length === 0 ? (
            <option value="">Loading models...</option>
          ) : (
            models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name || model.id}
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="tts-selector desktop-only">
        <label htmlFor="ttsSelect">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
        </label>
        <select
          id="ttsSelect"
          className="tts-select"
          value={currentTTS}
          onChange={(e) => onTTSChange(e.target.value)}
        >
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
            <option value="playai-tts|Fritz-PlayAI">Fritz (Male)</option>
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

      {/* Mobile: Hamburger menu button */}
      <motion.button
        className="hamburger-btn mobile-only"
        onClick={onOpenSettings}
        title="Settings"
        aria-label="Open settings menu"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </motion.button>
    </div>
  )
}
