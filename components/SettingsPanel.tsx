'use client'

import { Model } from '@/app/page'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

interface SettingsPanelProps {
  isOpen: boolean
  currentProvider: string
  currentModel: string
  currentTTS: string
  models: Model[]
  onProviderChange: (provider: string) => void
  onModelChange: (model: string) => void
  onTTSChange: (tts: string) => void
  onClose: () => void
}

export default function SettingsPanel({
  isOpen,
  currentProvider,
  currentModel,
  currentTTS,
  models,
  onProviderChange,
  onModelChange,
  onTTSChange,
  onClose,
}: SettingsPanelProps) {
  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="settings-overlay visible"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="settings-panel open"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="settings-header">
                <h3>Settings</h3>
                <motion.button
                  className="close-settings-btn"
                  onClick={onClose}
                  aria-label="Close settings"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </motion.button>
              </div>
              <div className="settings-content">
                <div className="setting-group">
                  <label htmlFor="mobileProviderSelect">Provider</label>
                  <select
                    id="mobileProviderSelect"
                    className="setting-select"
                    value={currentProvider}
                    onChange={(e) => onProviderChange(e.target.value)}
                  >
                    <option value="groq">Groq</option>
                    <option value="gemini">Gemini</option>
                    <option value="openrouter">OpenRouter (Free)</option>
                  </select>
                </div>

                <div className="setting-group">
                  <label htmlFor="mobileModelSelect">Model</label>
                  <select
                    id="mobileModelSelect"
                    className="setting-select"
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
                
                <div className="setting-group">
                  <label htmlFor="mobileTTSSelect">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }}>
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    Text-to-Speech
                  </label>
                  <select
                    id="mobileTTSSelect"
                    className="setting-select"
                    value={currentTTS}
                    onChange={(e) => onTTSChange(e.target.value)}
                  >
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
