'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import WelcomeScreen from '@/components/WelcomeScreen'
import ChatMessages from '@/components/ChatMessages'
import InputArea from '@/components/InputArea'
import SettingsPanel from '@/components/SettingsPanel'

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
  model?: string
}

export interface Model {
  id: string
  name: string
  provider?: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentModel, setCurrentModel] = useState('mixtral-8x7b-32768')
  const [currentProvider, setCurrentProvider] = useState('groq')
  const [currentTTS, setCurrentTTS] = useState('playai-tts|Fritz-PlayAI')
  const [models, setModels] = useState<Model[]>([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false)

  // Load models when provider changes
  useEffect(() => {
    loadModels(currentProvider)
  }, [currentProvider])

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory()
    loadTTSPreference()
    
    // Restore preferred provider
    const savedProvider = localStorage.getItem('provider')
    if (savedProvider) {
      setCurrentProvider(savedProvider)
    }
  }, [])

  const loadModels = async (provider: string) => {
    try {
      const response = await fetch(`/api/models?provider=${encodeURIComponent(provider)}`)
      const data = await response.json()
      
      if (data.success) {
        setModels(data.models)
        
        // Set default/preferred model
        if (data.models.length > 0) {
          const preferred = localStorage.getItem(`preferred_model_${provider}`)
          const found = data.models.find((m: Model) => m.id === preferred)
          setCurrentModel(found ? found.id : data.models[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading models:', error)
    }
  }

  const loadChatHistory = async () => {
    try {
      const response = await fetch('/api/history')
      const data = await response.json()
      
      if (data.success && data.history.length > 0) {
        setMessages(data.history)
        setShowWelcome(false)
      }
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const loadTTSPreference = () => {
    const savedPreference = localStorage.getItem('tts_preference')
    if (savedPreference) {
      setCurrentTTS(savedPreference)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return

    setShowWelcome(false)
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    }
    setMessages(prev => [...prev, userMessage])
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          model: currentModel,
          provider: currentProvider,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.message,
          timestamp: data.timestamp,
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        console.error('Error:', data.error)
      }
    } catch (error) {
      console.error('Network error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    if (confirm('Start a new chat? Current conversation will be cleared.')) {
      try {
        const response = await fetch('/api/new-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        const data = await response.json()
        
        if (data.success) {
          setMessages([])
          setShowWelcome(true)
        }
      } catch (error) {
        console.error('Error starting new chat:', error)
      }
    }
  }

  const handleProviderChange = (provider: string) => {
    setCurrentProvider(provider)
    localStorage.setItem('provider', provider)
  }

  const handleModelChange = (model: string) => {
    setCurrentModel(model)
    localStorage.setItem(`preferred_model_${currentProvider}`, model)
  }

  const handleTTSChange = (tts: string) => {
    setCurrentTTS(tts)
    localStorage.setItem('tts_preference', tts)
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Header
          currentProvider={currentProvider}
          currentModel={currentModel}
          currentTTS={currentTTS}
          models={models}
          onProviderChange={handleProviderChange}
          onModelChange={handleModelChange}
          onTTSChange={handleTTSChange}
          onNewChat={handleNewChat}
          onOpenSettings={() => setSettingsPanelOpen(true)}
        />
        
        <SettingsPanel
          isOpen={settingsPanelOpen}
          currentProvider={currentProvider}
          currentModel={currentModel}
          currentTTS={currentTTS}
          models={models}
          onProviderChange={handleProviderChange}
          onModelChange={handleModelChange}
          onTTSChange={handleTTSChange}
          onClose={() => setSettingsPanelOpen(false)}
        />

        <div className="chat-container" id="chatContainer">
          {showWelcome && <WelcomeScreen onExamplePrompt={(prompt) => handleSendMessage(prompt)} />}
          <ChatMessages messages={messages} isLoading={isLoading} currentTTS={currentTTS} />
        </div>

        <InputArea onSendMessage={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
