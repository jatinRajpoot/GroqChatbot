# Text-to-Speech (TTS) Feature

## Overview
The chatbot now includes professional text-to-speech functionality powered by **Groq's PlayAI TTS models**. This allows you to listen to AI responses with high-quality, natural-sounding voices.

## Features

### Available Models
- **playai-tts**: English text-to-speech with 19 voices
- **playai-tts-arabic**: Arabic text-to-speech with 4 voices

### English Voices (playai-tts)
| Voice | Type | Description |
|-------|------|-------------|
| Arista-PlayAI | Female | Clear and professional |
| Atlas-PlayAI | Male | Deep and authoritative |
| Basil-PlayAI | Male | Warm and friendly |
| Briggs-PlayAI | Male | Strong and confident |
| Calum-PlayAI | Male | Scottish accent |
| Celeste-PlayAI | Female | Soft and gentle |
| Cheyenne-PlayAI | Female | Energetic and youthful |
| Chip-PlayAI | Male | Upbeat and cheerful |
| Cillian-PlayAI | Male | Irish accent |
| Deedee-PlayAI | Female | Southern accent |
| Fritz-PlayAI | Male | **Default** - Clear and versatile |
| Gail-PlayAI | Female | Mature and wise |
| Indigo-PlayAI | Neutral | Gender-neutral voice |
| Mamaw-PlayAI | Female | Elderly and warm |
| Mason-PlayAI | Male | Professional and calm |
| Mikail-PlayAI | Male | Smooth and articulate |
| Mitch-PlayAI | Male | Casual and relaxed |
| Quinn-PlayAI | Female | Young and bright |
| Thunder-PlayAI | Male | Dramatic and powerful |

### Arabic Voices (playai-tts-arabic)
| Voice | Type |
|-------|------|
| Ahmad-PlayAI | Male |
| Amira-PlayAI | Female |
| Khalid-PlayAI | Male |
| Nasser-PlayAI | Male |

## How to Use

1. **Select a Voice**: Click the speaker icon dropdown in the header and choose your preferred voice
2. **Send a Message**: Ask the AI a question or send a prompt
3. **Play Audio**: Click the speaker button (🔊 Speak) next to any AI response
4. **Control Playback**:
   - Click again to stop the current audio
   - Click another message's button to switch playback
   - Change voice while playing to stop current audio

## Technical Implementation

### Backend (Flask)
- **Endpoint**: `POST /api/tts`
- **Parameters**:
  - `text`: Text to convert (max 10K characters)
  - `model`: TTS model (`playai-tts` or `playai-tts-arabic`)
  - `voice`: Voice name (e.g., `Fritz-PlayAI`)
- **Response**: WAV audio file (audio/wav)

### Frontend (JavaScript)
- **Function**: `speakText(text, button)`
- Uses HTML5 Audio API for playback
- Automatically strips HTML tags from text
- Visual feedback with pulsing animation during playback

### API Integration
```python
# groq_client.py
response = self.client.audio.speech.create(
    model=model,
    voice=voice,
    input=text,
    response_format='wav'
)
```

## Features

### ✅ Voice Selection
- 23 total voices (19 English + 4 Arabic)
- Grouped by language in dropdown
- Default: Fritz-PlayAI (English)

### ✅ Persistence
- Selected voice saved to localStorage
- Preference persists across browser sessions
- Automatic restoration on page load

### ✅ Smart Playback
- Only one audio plays at a time
- Automatic cleanup of audio resources
- Error handling with user feedback
- Disabled state during loading

### ✅ Visual Feedback
- Speaker button pulses during playback
- Button disabled state prevents double-clicks
- Playing state indicated by CSS animation

## Limitations

- **Text Length**: Maximum 10,000 characters per request (Groq API limit)
- **Format**: Only WAV format supported
- **Network**: Requires internet connection (API-based)
- **Rate Limits**: Subject to Groq API rate limits

## Costs

TTS requests are billed through your Groq API account. Check the [Groq pricing page](https://console.groq.com/pricing) for current rates.

## Troubleshooting

### No Audio Playing
- Check your internet connection
- Verify Groq API key is set in `.env`
- Check browser console for errors
- Ensure volume is not muted

### Poor Audio Quality
- Try different voices
- Check network bandwidth
- Verify text is properly formatted

### Button Stuck in "Playing" State
- Refresh the page
- Clear browser cache
- Check browser console for errors

## API Reference

### Groq TTS Documentation
- [Groq Text-to-Speech Docs](https://console.groq.com/docs/text-to-speech)
- [API Reference](https://console.groq.com/docs/api-reference)

## Future Enhancements

Possible improvements:
- Download audio files
- Playback speed control
- Volume control
- Queue multiple messages
- Alternative audio formats (MP3, OGG)
- Offline caching of frequently played messages
