'use client'

import { useEffect, useRef, useState } from 'react'
import { Message } from '@/app/page'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  currentTTS: string
}

export default function ChatMessages({ messages, isLoading, currentTTS }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null)
  const [playingButton, setPlayingButton] = useState<string | null>(null)

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const formatMessage = (text: string) => {
    // Escape HTML first
    let formatted = text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    
    // Code blocks
    formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang ? ` class="language-${lang}"` : ''
      return `<pre><code${language}>${code.trim()}</code></pre>`
    })
    
    // Inline code
    formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>')
    
    // Tables
    formatted = formatted.replace(/(\|.+\|)\n(\|[-:\s|]+\|)\n((?:\|.+\|\n?)+)/g, (match, header, separator, rows) => {
      const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => h.trim())
      const rowLines = rows.trim().split('\n')
      const rowsHtml = rowLines.map((row: string) => {
        const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => c.trim())
        return '<tr>' + cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>'
      }).join('')
      
      const headersHtml = '<tr>' + headers.map((h: string) => `<th>${h}</th>`).join('') + '</tr>'
      return `<table class="markdown-table"><thead>${headersHtml}</thead><tbody>${rowsHtml}</tbody></table>`
    })
    
    // Headers
    formatted = formatted.replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    formatted = formatted.replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    formatted = formatted.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    
    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    formatted = formatted.replace(/__(.+?)__/g, '<strong>$1</strong>')
    
    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, '<em>$1</em>')
    formatted = formatted.replace(/_(.+?)_/g, '<em>$1</em>')
    
    // Lists
    formatted = formatted.replace(/^\* (.+)$/gm, '<li>$1</li>')
    formatted = formatted.replace(/^- (.+)$/gm, '<li>$1</li>')
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    
    // Links
    formatted = formatted.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    
    // Horizontal rules
    formatted = formatted.replace(/^---$/gm, '<hr>')
    formatted = formatted.replace(/^\*\*\*$/gm, '<hr>')
    
    // Blockquotes
    formatted = formatted.replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    
    // Line breaks
    formatted = formatted.replace(/\n\n/g, '</p><p>')
    formatted = formatted.replace(/\n/g, '<br>')
    formatted = `<p>${formatted}</p>`
    
    // Clean up
    formatted = formatted.replace(/<p><\/p>/g, '')
    formatted = formatted.replace(/<p>\s*<\/p>/g, '')
    
    return formatted
  }

  const handleSpeak = async (content: string, messageId: string) => {
    // Stop any currently playing audio
    if (playingAudio) {
      playingAudio.pause()
      setPlayingAudio(null)
      setPlayingButton(null)
    }

    // If clicking the same button that was playing, just stop
    if (playingButton === messageId) {
      return
    }

    const [model, voice] = currentTTS.split('|')
    
    const cleanText = content.replace(/<[^>]*>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&amp;/g, '&')
                            .trim()

    try {
      setPlayingButton(messageId)

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          model: model,
          voice: voice,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        if (errorData.error_type === 'terms_required') {
          alert('⚠️ TTS Setup Required\n\n' + errorData.error + '\n\nThis is a one-time setup. After accepting terms, refresh this page.')
          throw new Error('Terms acceptance required')
        }
        throw new Error(errorData.error || 'TTS request failed')
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      const audio = new Audio(audioUrl)
      setPlayingAudio(audio)

      audio.onended = () => {
        setPlayingButton(null)
        setPlayingAudio(null)
        URL.revokeObjectURL(audioUrl)
      }

      audio.onerror = () => {
        setPlayingButton(null)
        setPlayingAudio(null)
        URL.revokeObjectURL(audioUrl)
      }

      await audio.play()
    } catch (error) {
      console.error('TTS error:', error)
      setPlayingButton(null)
      alert('Failed to generate speech. Please try again.')
    }
  }

  return (
    <div className="messages" ref={containerRef}>
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            className={`message ${message.role}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="message-avatar">
              {message.role === 'user' ? 'U' : 'AI'}
            </div>
            <div className="message-content">
              <div
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
              
              {message.role === 'assistant' && currentTTS !== 'disabled' && (
                <div className="message-actions">
                  <motion.button
                    className={`speaker-btn ${playingButton === `${index}` ? 'playing' : ''}`}
                    onClick={() => handleSpeak(message.content, `${index}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    </svg>
                    <span>Speak</span>
                  </motion.button>
                </div>
              )}
              
              {message.timestamp && (
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            className="message assistant"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="message-avatar">AI</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
