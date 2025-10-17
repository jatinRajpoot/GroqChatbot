# 🚀 Quick Start Guide - Next.js Frontend

## What's New?

Your chatbot frontend has been **migrated to Next.js** with **enhanced button animations**! 

### ✨ Enhanced Features:
- 🎯 **Smooth button animations** - Hover, tap, and ripple effects
- 🔄 **Icon rotations** - New Chat and hamburger buttons rotate on hover
- 💫 **Spring physics** - Natural, bouncy transitions
- 🎨 **Gradient overlays** - Beautiful hover effects on prompt cards
- 🔊 **Pulsing TTS button** - Animated when speech is playing
- ⚡ **Faster performance** - React optimization

### 🎨 UI Theme: 
**100% preserved** - Same minimalist black and white design!

---

## 🏃 Running the Application

### Quick Start (Recommended)

```bash
# Make script executable (Linux/Mac, one-time only)
chmod +x start-dev.sh

# Run both servers
./start-dev.sh           # Linux/Mac
start-dev.bat            # Windows
```

This starts:
- **Flask backend** on `http://localhost:5000`
- **Next.js frontend** on `http://localhost:3000`

### Manual Start

**Terminal 1 - Backend:**
```bash
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm install  # First time only
npm run dev
```

---

## 📦 First-Time Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file for Flask backend:
```env
GROQ_API_KEY=your_key_here
```

*(Optional)* Create `.env.local` for Next.js:
```env
FLASK_API_URL=http://localhost:5000
```

### 3. Run!

```bash
./start-dev.sh
```

**Access the app:** `http://localhost:3000`

---

## 🎬 See the Animations

### Try these interactions:

1. **New Chat Button**
   - Hover → Icon rotates 90°
   - Click → Ripple effect

2. **Example Prompts**
   - Hover → Scale + shadow + gradient
   - Icon bounces on hover

3. **Send Button**
   - Hover → Wiggle + shadow
   - Disabled → Faded out

4. **Speaker Button** (TTS)
   - Playing → Pulsing ring
   - Hover → Lift effect

5. **Settings Menu** (Mobile)
   - Smooth slide-in from right
   - Overlay fade effect

---

## 📁 Project Structure

```
New Next.js Files:
├── app/
│   ├── layout.tsx         → Root layout
│   ├── page.tsx           → Main chat page
│   └── globals.css        → Styles + animations
├── components/            → React components
│   ├── Header.tsx
│   ├── ChatMessages.tsx
│   ├── InputArea.tsx
│   ├── WelcomeScreen.tsx
│   └── SettingsPanel.tsx
├── package.json           → Node dependencies
├── next.config.js         → Next.js config
└── tsconfig.json          → TypeScript config

Original Files (Unchanged):
├── app.py                 → Flask backend
├── groq_client.py         → Groq API
├── gemini_client.py       → Gemini API
├── openrouter_client.py   → OpenRouter API
└── templates/             → Original HTML (still works!)
```

---

## 🔄 Two Ways to Run

### Option 1: Next.js (New, Recommended)
```bash
npm run dev
```
→ `http://localhost:3000` (Enhanced animations)

### Option 2: Flask Templates (Original)
```bash
python app.py
```
→ `http://localhost:5000` (Classic version)

**Both work perfectly!** Choose your preference.

---

## 🎯 Key Technologies

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Framer Motion** - Smooth animations
- **React Hooks** - State management
- **Flask API** - Backend (unchanged)

---

## 📖 Full Documentation

- **[NEXTJS_README.md](NEXTJS_README.md)** - Complete Next.js guide
- **[MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md)** - What changed
- **[README.md](README.md)** - Original Flask docs

---

## 🐛 Troubleshooting

### Frontend won't start
```bash
rm -rf node_modules .next
npm install
npm run dev
```

### Backend connection error
- Ensure Flask is running: `python app.py`
- Check port 5000 is available
- Verify `.env` has API keys

### Animations not working
- Update browser (Chrome/Edge/Firefox latest)
- Check Framer Motion is installed: `npm list framer-motion`

---

## 🎉 Enjoy Your Enhanced Chatbot!

All the same features, better animations, same beautiful design. 

Questions? Check the full docs:
- [NEXTJS_README.md](NEXTJS_README.md) - Setup & features
- [MIGRATION_SUMMARY.md](MIGRATION_SUMMARY.md) - Technical details

**Have fun! 🚀**
