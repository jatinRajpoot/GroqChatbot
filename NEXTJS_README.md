# Next.js Frontend Setup

This project has been migrated to use Next.js for the frontend while keeping the Flask backend for API services.

## Architecture

- **Frontend**: Next.js 14 (React) - Port 3000
- **Backend**: Flask API - Port 5000
- **Styling**: CSS with enhanced animations using Framer Motion
- **UI Theme**: Minimalist black and white (preserved from original)

## Enhanced Features

### Button Animations
All buttons now feature enhanced animations:
- **Ripple effects** on click
- **Smooth hover transitions** with scale and shadow effects
- **Rotate animations** on hover (New Chat, Hamburger menu)
- **Pulse effects** for active states (TTS playing button)
- **Float animations** for guide icons
- **Sound wave animations** for speaker buttons

### Component Structure
```
app/
├── layout.tsx          # Root layout with metadata
├── page.tsx            # Main chat page
└── globals.css         # Global styles with animations

components/
├── Header.tsx          # Header with provider/model selectors
├── SettingsPanel.tsx   # Mobile settings panel
├── WelcomeScreen.tsx   # Welcome screen with example prompts
├── ChatMessages.tsx    # Chat messages display
└── InputArea.tsx       # Message input with send button
```

## Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Flask backend dependencies (see requirements.txt)

### Setup Next.js Frontend

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional):
```env
FLASK_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at http://localhost:3000

### Setup Flask Backend

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your API keys:
```env
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key
```

3. Run the Flask backend:
```bash
python app.py
```

The backend will be available at http://localhost:5000

## Running Both Services

### Option 1: Separate Terminals
Open two terminal windows:

Terminal 1 (Backend):
```bash
python app.py
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### Option 2: Development Script (Recommended)
We've created a helper script to run both services:

On Unix/Mac:
```bash
chmod +x start-dev.sh
./start-dev.sh
```

On Windows:
```bash
start-dev.bat
```

## Production Build

1. Build the Next.js frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

Note: Make sure the Flask backend is running on port 5000, or configure the `FLASK_API_URL` environment variable.

## API Proxying

Next.js automatically proxies API requests to the Flask backend:
- `/api/*` → `http://localhost:5000/api/*`
- `/health` → `http://localhost:5000/health`

This is configured in `next.config.js`.

## Key Differences from Original

### What Changed:
- ✅ Migrated from Jinja2 templates to React components
- ✅ Added Framer Motion for smooth animations
- ✅ Converted vanilla JavaScript to React hooks (useState, useEffect)
- ✅ Improved button interactions and hover effects
- ✅ Better mobile responsiveness with React state management
- ✅ TypeScript for type safety

### What Stayed the Same:
- ✅ Exact same UI theme (black and white minimalist)
- ✅ All original features (TTS, model selection, chat history)
- ✅ Same Flask backend API
- ✅ Same responsive design breakpoints
- ✅ Same color scheme and layout

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### Frontend can't connect to backend
- Ensure Flask is running on port 5000
- Check CORS settings if deploying to different domains
- Verify `FLASK_API_URL` in `.env.local`

### Animations not working
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check browser compatibility

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## Development Tips

- Hot reload is enabled - changes to components update automatically
- Use React DevTools browser extension for debugging
- Check browser console for errors
- Flask backend needs manual restart when changed

## Future Enhancements

Potential improvements:
- Add WebSocket support for real-time streaming responses
- Implement dark mode toggle
- Add conversation export feature
- Enhance accessibility (ARIA labels, keyboard navigation)
- Add unit tests with Jest and React Testing Library
