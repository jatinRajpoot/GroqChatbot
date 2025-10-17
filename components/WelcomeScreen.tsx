'use client'

import { motion } from 'framer-motion'

interface WelcomeScreenProps {
  onExamplePrompt: (prompt: string) => void
}

const examplePrompts = [
  { icon: '💡', text: 'Explain quantum computing', prompt: 'Explain quantum computing in simple terms' },
  { icon: '💻', text: 'Write Python code', prompt: 'Write a Python function to sort a list' },
  { icon: '🌐', text: 'Web development tips', prompt: 'What are the best practices for web development?' },
  { icon: '🚀', text: 'Brainstorm ideas', prompt: 'Help me brainstorm ideas for a startup' },
  { icon: '📊', text: 'Compare programming languages', prompt: 'Create a detailed comparison table of programming languages' },
  { icon: '✍️', text: 'Write a creative story', prompt: 'Write a creative short story about AI' },
]

export default function WelcomeScreen({ onExamplePrompt }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          🤖 Welcome to Groq AI Chat
        </motion.h1>
        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Powered by 20+ open-source AI models
        </motion.p>
        
        {/* Quick Guide */}
        <motion.div
          className="quick-guide"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="guide-card"
            whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-secondary)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="guide-icon">🎯</div>
            <h3>Choose Your Model</h3>
            <p>Select from <strong>20+ AI models</strong> in the dropdown above</p>
            <div className="model-examples">
              <span className="model-tag">Mixtral 8x7B</span>
              <span className="model-tag">LLaMA 3.1</span>
              <span className="model-tag">Qwen 2.5</span>
            </div>
          </motion.div>
          
          <motion.div
            className="guide-card"
            whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-secondary)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="guide-icon">🔊</div>
            <h3>Text-to-Speech</h3>
            <p>Choose from <strong>23 voices</strong> to hear responses</p>
            <p className="guide-hint">
              Click <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'inline', verticalAlign: 'middle' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon></svg> on any response
            </p>
          </motion.div>
          
          <motion.div
            className="guide-card"
            whileHover={{ scale: 1.02, backgroundColor: 'var(--bg-secondary)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="guide-icon">💬</div>
            <h3>Start Chatting</h3>
            <p>Type your message below or try an example prompt</p>
            <p className="guide-hint"><kbd>Enter</kbd> to send • <kbd>Shift+Enter</kbd> for new line</p>
          </motion.div>
        </motion.div>
        
        {/* Example Prompts */}
        <motion.div
          className="prompts-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="prompts-title">✨ Try These Prompts</h3>
          <div className="example-prompts">
            {examplePrompts.map((example, index) => (
              <motion.button
                key={index}
                className="example-prompt"
                onClick={() => onExamplePrompt(example.prompt)}
                whileHover={{ 
                  scale: 1.03, 
                  backgroundColor: 'var(--bg-secondary)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.6 + index * 0.05,
                  type: 'spring',
                  stiffness: 300
                }}
              >
                <span className="prompt-icon">{example.icon}</span>
                <span className="prompt-text">{example.text}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
