# AetherLearn MVP - AI Prompts Reference

## 1. Lecture Generation Prompt (Gemini API)
**Location:** `backend/main.py` - `LECTURE_PROMPT`

```
You are an expert educational content creator. Generate a lecture script and slide content for the topic: "{topic}"

Requirements:
- Style: {style}
- Duration: {duration} ({slide_count} slides)
- Each slide should have a clear title and 3-4 bullet points
- The script should be natural, engaging speech (what the lecturer says)
- Include [PAUSE] markers for natural pauses

Return ONLY valid JSON in this exact format:
{
    "title": "Main Lecture Title",
    "slides": [
        {
            "title": "Slide 1 Title",
            "bullets": ["Point 1", "Point 2", "Point 3"],
            "script": "The full lecture script for this slide. What the teacher says while showing this slide. Include natural pauses like [PAUSE] where appropriate.",
            "image_prompt": "A simple description for an image that could illustrate this concept"
        }
    ]
}

Make the content educational but engaging. The lecturer should explain concepts clearly with examples.
```

**Variables:**
- `{topic}` - User-provided topic (e.g., "Photosynthesis", "World War 2")
- `{style}` - educational, conversational, or formal
- `{duration}` - short, medium, or long
- `{slide_count}` - 3 for short, 5 for medium, 7 for long

---

## 2. Text-to-Speech (Kokoro TTS)
**Location:** `backend/KokoroTTS/tts_engine.py`

No prompt - uses direct text input. The script from Gemini is converted to speech.

**Voice Options:**
- Female: `af_sarah`, `af_nicole`, `af_sky`
- Male: `am_michael`, `am_adam`, `am_liam`

**Current Default:** `am_michael` (male voice)

---

## 3. Demo Lecture Content
**Location:** `frontend/src/App.tsx` - `demoLecture`

Pre-generated content for landing page demo:
- Topic: "Introduction to Photosynthesis"
- 3 slides with pre-generated Kokoro TTS audio files
- Audio files: `/audio/demo/slide_1.wav`, `/audio/demo/slide_2.wav`, `/audio/demo/slide_3.wav`

---

## API Flow

1. User enters topic → Frontend sends POST to `/generate`
2. Backend calls Gemini API with `LECTURE_PROMPT`
3. Gemini returns JSON with slides and scripts
4. Backend generates audio for each slide using Kokoro TTS
5. Frontend receives lecture data and plays in 3D classroom
