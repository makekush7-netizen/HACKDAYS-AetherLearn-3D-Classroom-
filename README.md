# AetherLearn MVP

## AI-Powered 3D Lecture Generator

A hackathon project that uses **Gemini AI** to generate educational lectures with:
- 🎬 Immersive 3D classroom environment
- 🤖 AI-generated lecture scripts and slides
- 🎙️ Natural text-to-speech with Kokoro TTS
- 📊 Auto-generated visual presentations

## Quick Start

### 1. Set Up API Key

Edit [`backend\.env`](backend\.env) and add your Gemini API key:

```env
GEMINI_API_KEY=your-actual-api-key-here
```

Get a free API key from: https://aistudio.google.com/app/apikey

### 2. Test Your API Key

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python test_api.py
```

If it says "✓ Everything working!" you're ready to go!

### 3. Start Servers

**Option A - Manual:**

```powershell
# Terminal 1 - Backend
cd backend
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Option B - Automatic:**

```powershell
.\start.ps1
```

This will test your API and start both servers automatically!

## Access the App

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Features

### Generate Lectures
1. Click "Generate Lecture" 
2. Enter any topic (e.g., "How does photosynthesis work?")
3. Choose lecture length (short/medium/long)
4. Select narrator voice
5. Click "Generate Lecture" and wait 10-30 seconds
6. Watch your AI-generated 3D lecture!

### Try Demo
- Click "Try Demo" to see the 3D classroom without generating a lecture
- Navigate through multiple slides
- See the animated lecturer and visual slides

## Troubleshooting

### "Quota exceeded" Error

**If you see this error**, it means:
1. Your API key might be invalid
2. The free tier has daily limits
3. You need to wait and retry

**Solutions:**
```powershell
# Test your API key
cd backend
.\venv\Scripts\Activate.ps1
python test_api.py
```

If test fails:
- Get a new API key from https://aistudio.google.com/app/apikey
- Make sure you're signed in to the correct Google account
- Check you haven't exceeded daily limits (wait 24 hours)

### Demo Not Working

The demo now has **3 slides** with different content. Make sure you:
- Click the Play button
- Use the left/right arrows to navigate slides
- Check browser console (F12) for any errors

### 3D Models Not Loading

Models should be at:
- `frontend/public/models/basic_classroom.glb`
- `frontend/public/models/lecturer.glb`

If missing, they're in the original `AetherLearn/3dclassroom/` folder.

## What's Included

✅ **Kokoro TTS Engine** - Located in `backend/KokoroTTS/`
- `tts_engine.py` - Main TTS code
- `kokoro-v1.0.onnx` - AI model (325MB)
- `voices-v1.0.bin` - Voice data (28MB)

✅ **3D Models** - Located in `frontend/public/models/`
- `basic_classroom.glb` - Classroom environment (19MB)
- `lecturer.glb` - Animated lecturer (6MB)

✅ **Environment Config** - [`backend\.env`](backend\.env)
- Set your API key once and it's saved

## Tech Stack

- **Backend**: FastAPI + Python
- **AI**: Google Gemini 2.5 Flash
- **TTS**: Kokoro ONNX
- **Frontend**: React + Vite + TailwindCSS
- **3D**: Three.js

## API Endpoints

- `POST /generate` - Generate a new lecture
- `GET /lectures` - List all generated lectures
- `GET /health` - Health check
- `GET /generated/*` - Serve generated audio/slides

## Project Structure

```
AetherLearn-MVP/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── test_api.py          # API key tester
│   ├── .env                 # Your API key goes here
│   ├── requirements.txt     # Python dependencies
│   ├── KokoroTTS/          # TTS engine + models
│   │   ├── tts_engine.py
│   │   ├── kokoro-v1.0.onnx
│   │   └── voices-v1.0.bin
│   └── generated/           # Generated lectures output
│       ├── audio/
│       └── slides/
├── frontend/
│   ├── public/
│   │   └── models/          # 3D models
│   │       ├── basic_classroom.glb
│   │       └── lecturer.glb
│   ├── src/
│   │   ├── App.tsx          # Main app
│   │   └── components/
│   │       ├── Classroom.tsx      # 3D scene
│   │       ├── GenerateLecture.tsx # Topic input
│   │       └── LecturePlayer.tsx   # Playback controls
│   └── package.json
├── start.ps1                # Auto-start script
└── README.md
```

## For Your Hackathon Demo

1. **Before presenting:**
   - Make sure API key is set in `.env`
   - Run `python test_api.py` to verify
   - Pre-generate 1-2 lectures on interesting topics

2. **During demo:**
   - Show the "Try Demo" feature first (works instantly)
   - Then generate a live lecture on a topic from the audience
   - Highlight the 3D environment and natural voice

3. **Talking points:**
   - "AI generates complete educational content in seconds"
   - "Immersive 3D classroom makes learning engaging"
   - "Natural voice narration using state-of-the-art TTS"
   - "Can teach ANY topic - just ask!"

## Credits

Built for Hackathon 2026 🚀

Powered by:
- Google Gemini AI
- Kokoro TTS
- Three.js
- FastAPI & React
