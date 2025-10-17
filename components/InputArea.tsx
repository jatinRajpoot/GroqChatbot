'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface InputAreaProps {
  onSendMessage: (message: string) => void
  disabled: boolean
}

export default function InputArea({ onSendMessage, disabled }: InputAreaProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  useEffect(() => {
    autoResize()
  }, [message])

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="input-container">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          id="messageInput"
          placeholder="Send a message..."
          rows={1}
          maxLength={4000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <motion.button
          id="sendBtn"
          className="send-btn"
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          whileHover={!message.trim() || disabled ? {} : { scale: 1.1, rotate: [0, -10, 10, 0] }}
          whileTap={!message.trim() || disabled ? {} : { scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            animate={disabled ? { rotate: 0 } : {}}
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </motion.svg>
        </motion.button>
      </div>
      <div className="input-footer">
        <small>Press Enter to send, Shift+Enter for new line</small>
      </div>
    </div>
  )
}
