# ⚠️ TTS Setup Required

## Error: Terms Acceptance Required

The TTS feature requires accepting the PlayAI TTS model terms in the Groq console.

### Current Error
```
The model `playai-tts` requires terms acceptance. 
Please have the org admin accept the terms at https://console.groq.com/playground?model=playai-tts
```

## How to Fix

### Step 1: Accept PlayAI TTS Terms
1. Visit: https://console.groq.com/playground?model=playai-tts
2. Log in with your Groq account
3. Accept the terms of service for PlayAI TTS
4. The model will be enabled for your API key

### Step 2: Accept Arabic TTS Terms (Optional)
If you want to use Arabic voices:
1. Visit: https://console.groq.com/playground?model=playai-tts-arabic
2. Accept the terms for the Arabic model

### Step 3: Restart the Application
After accepting terms, simply refresh your browser - no code changes needed!

## Alternative: Use Browser TTS (Fallback)

While waiting for term acceptance, I can implement a fallback to browser TTS. This will:
- Work immediately without API setup
- Run completely offline
- Use system voices (quality varies by OS)
- No API costs

Would you like me to:
1. **Wait for you to accept the terms** (recommended for best quality)
2. **Add browser TTS fallback** (works now, lower quality)
3. **Both** (browser TTS until terms accepted, then switch to PlayAI)

## Why This Happened

Groq TTS models are newer and require explicit terms acceptance to:
- Ensure compliance with PlayAI's usage policies
- Manage API usage and costs
- Protect against misuse

This is a one-time setup per organization/account.

## Next Steps

Please choose one of the options above and I'll help you proceed!
