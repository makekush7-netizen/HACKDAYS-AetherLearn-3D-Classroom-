"""
AetherLearn MVP - FastAPI Backend
AI-Powered Lecture Generation with Gemini + Kokoro TTS
"""

import os
import sys
import json
import re
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import google.generativeai as genai
from datetime import datetime
import uuid
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Add KokoroTTS to path (now in backend/KokoroTTS)
KOKORO_PATH = Path(__file__).parent / "KokoroTTS"
sys.path.insert(0, str(KOKORO_PATH))

app = FastAPI(title="AetherLearn MVP", description="AI-Powered 3D Lecture Generator")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Output directories
OUTPUT_DIR = Path(__file__).parent / "generated"
AUDIO_DIR = OUTPUT_DIR / "audio"
SLIDES_DIR = OUTPUT_DIR / "slides"

# Create directories
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
SLIDES_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files
app.mount("/generated", StaticFiles(directory=str(OUTPUT_DIR)), name="generated")

# ==================== MODELS ====================

class LectureRequest(BaseModel):
    topic: str
    duration: str = "short"  # short (2-3 slides), medium (4-5 slides), long (6-8 slides)
    voice: str = "af_sky"  # Kokoro voice
    style: str = "educational"  # educational, conversational, formal

class LectureResponse(BaseModel):
    lecture_id: str
    topic: str
    slides: list[dict]  # [{title, content, image_prompt, audio_url, svg_url}]
    script: list[str]  # Full script for each slide

# ==================== GEMINI SETUP ====================

def configure_gemini(api_key: str):
    """Configure Gemini API"""
    genai.configure(api_key=api_key)
    # Using gemini-2.5-flash - latest stable free tier model
    return genai.GenerativeModel('gemini-2.5-flash')

# ==================== TTS SETUP ====================

_tts_engine = None

def get_tts():
    """Get or create TTS engine"""
    global _tts_engine
    if _tts_engine is None:
        try:
            from tts_engine import KokoroTTS
            _tts_engine = KokoroTTS(model_dir=str(KOKORO_PATH))
            print("✓ Kokoro TTS initialized")
        except Exception as e:
            print(f"⚠ TTS not available: {e}")
            return None
    return _tts_engine

# ==================== SLIDE SVG GENERATOR ====================

def generate_slide_svg(title: str, content: list[str], slide_num: int, total: int) -> str:
    """Generate a clean SVG slide"""
    
    # Build content elements
    content_svg = ""
    y = 180
    for item in content[:5]:  # Max 5 bullet points
        text = item[:60] + "..." if len(item) > 60 else item  # Truncate long text
        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        content_svg += f'''    <circle cx="80" cy="{y+8}" r="6" fill="#818cf8"/>
    <text x="100" y="{y+15}" font-family="Arial" font-size="24" fill="#e0e0e0">{text}</text>
'''
        y += 55
    
    # Clean title
    clean_title = title[:40].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg width="960" height="540" viewBox="0 0 960 540" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e1b4b"/>
      <stop offset="100%" style="stop-color:#312e81"/>
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="960" height="540" fill="url(#bg)"/>
  <rect x="20" y="20" width="920" height="500" rx="15" fill="none" stroke="#4338ca" stroke-width="2"/>
  
  <!-- Title -->
  <rect x="50" y="50" width="860" height="70" rx="10" fill="#4338ca" opacity="0.3"/>
  <text x="480" y="100" font-family="Arial" font-size="32" font-weight="bold" fill="#ffffff" text-anchor="middle">{clean_title}</text>
  
  <!-- Content -->
  <g id="content">
{content_svg}  </g>
  
  <!-- Footer -->
  <text x="480" y="510" font-family="Arial" font-size="16" fill="#6366f1" text-anchor="middle">AetherLearn AI • Slide {slide_num}/{total}</text>
</svg>'''
    return svg

# ==================== LECTURE GENERATION ====================

LECTURE_PROMPT = '''You are an expert educational content creator. Generate a lecture script and slide content for the topic: "{topic}"

Requirements:
- Style: {style}
- Duration: {duration} ({slide_count} slides)
- Each slide should have a clear title and 3-4 bullet points
- The script should be natural, engaging speech (what the lecturer says)
- Include [PAUSE] markers for natural pauses

Return ONLY valid JSON in this exact format:
{{
    "title": "Main Lecture Title",
    "slides": [
        {{
            "title": "Slide 1 Title",
            "bullets": ["Point 1", "Point 2", "Point 3"],
            "script": "The full lecture script for this slide. What the teacher says while showing this slide. Include natural pauses like [PAUSE] where appropriate.",
            "image_prompt": "A simple description for an image that could illustrate this concept"
        }}
    ]
}}

Make the content educational but engaging. The lecturer should explain concepts clearly with examples.'''

@app.get("/")
async def root():
    return {"status": "ok", "message": "AetherLearn MVP API", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "healthy", "tts": get_tts() is not None}

@app.post("/generate", response_model=LectureResponse)
async def generate_lecture(request: LectureRequest):
    """Generate a complete AI lecture with script, slides, and audio"""
    
    # Check API key
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set. Set it with: $env:GEMINI_API_KEY='your-key'")
    
    # Duration to slide count
    slide_counts = {"short": 3, "medium": 5, "long": 7}
    slide_count = slide_counts.get(request.duration, 3)
    
    # Generate with Gemini
    try:
        model = configure_gemini(api_key)
        prompt = LECTURE_PROMPT.format(
            topic=request.topic,
            style=request.style,
            duration=request.duration,
            slide_count=slide_count
        )
        
        response = model.generate_content(prompt)
        response_text = response.text
        
        # Extract JSON from response
        json_match = re.search(r'\{[\s\S]*\}', response_text)
        if not json_match:
            raise ValueError("No JSON found in response")
        
        lecture_data = json.loads(json_match.group())
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "quota" in error_msg.lower():
            raise HTTPException(
                status_code=429, 
                detail="Gemini API quota exceeded. Try: 1) Wait a few minutes and retry, 2) Check your API key at https://aistudio.google.com, 3) Ensure you're using a valid free-tier key"
            )
        raise HTTPException(status_code=500, detail=f"Gemini API error: {error_msg}")
    
    # Generate lecture ID
    lecture_id = f"lecture_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:6]}"
    lecture_audio_dir = AUDIO_DIR / lecture_id
    lecture_slides_dir = SLIDES_DIR / lecture_id
    lecture_audio_dir.mkdir(parents=True, exist_ok=True)
    lecture_slides_dir.mkdir(parents=True, exist_ok=True)
    
    # Process slides
    slides = []
    scripts = []
    total_slides = len(lecture_data.get("slides", []))
    
    tts = get_tts()
    
    for i, slide_data in enumerate(lecture_data.get("slides", [])):
        slide_num = i + 1
        
        # Generate SVG slide
        svg_content = generate_slide_svg(
            title=slide_data.get("title", f"Slide {slide_num}"),
            content=slide_data.get("bullets", []),
            slide_num=slide_num,
            total=total_slides
        )
        
        svg_path = lecture_slides_dir / f"slide_{slide_num}.svg"
        svg_path.write_text(svg_content, encoding="utf-8")
        
        # Generate audio with TTS
        script = slide_data.get("script", "")
        script_clean = script.replace("[PAUSE]", "...")  # Convert pauses
        scripts.append(script)
        
        audio_url = None
        if tts and script_clean.strip():
            try:
                audio_path = lecture_audio_dir / f"audio_{slide_num}.wav"
                tts.save(script_clean, str(audio_path), voice=request.voice)
                audio_url = f"/generated/audio/{lecture_id}/audio_{slide_num}.wav"
            except Exception as e:
                print(f"TTS error for slide {slide_num}: {e}")
        
        slides.append({
            "slide_num": slide_num,
            "title": slide_data.get("title", ""),
            "bullets": slide_data.get("bullets", []),
            "image_prompt": slide_data.get("image_prompt", ""),
            "svg_url": f"/generated/slides/{lecture_id}/slide_{slide_num}.svg",
            "audio_url": audio_url
        })
    
    return LectureResponse(
        lecture_id=lecture_id,
        topic=request.topic,
        slides=slides,
        script=scripts
    )

@app.get("/lectures")
async def list_lectures():
    """List all generated lectures"""
    lectures = []
    if SLIDES_DIR.exists():
        for folder in SLIDES_DIR.iterdir():
            if folder.is_dir() and folder.name.startswith("lecture_"):
                slides = list(folder.glob("*.svg"))
                lectures.append({
                    "lecture_id": folder.name,
                    "slide_count": len(slides),
                    "created": folder.stat().st_mtime
                })
    return {"lectures": sorted(lectures, key=lambda x: x["created"], reverse=True)}

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("  AetherLearn MVP - AI Lecture Generator")
    print("="*60)
    print("\nSet your Gemini API key:")
    print('  $env:GEMINI_API_KEY="your-api-key-here"')
    print("\nThen run:")
    print("  python main.py")
    print("\nAPI docs: http://localhost:8000/docs")
    print("="*60 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
