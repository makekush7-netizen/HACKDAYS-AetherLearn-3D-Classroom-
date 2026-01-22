"""
Generate demo audio files for the landing page demo
"""
import sys
from pathlib import Path

# Add KokoroTTS to path
KOKORO_PATH = Path(__file__).parent / "KokoroTTS"
sys.path.insert(0, str(KOKORO_PATH))

# Demo scripts - same as in frontend
DEMO_SCRIPTS = [
    "Welcome to our lesson on photosynthesis! This is one of the most important processes on Earth. Plants use sunlight to convert carbon dioxide and water into glucose and oxygen. Let's explore how this amazing process works!",
    "The light reaction is the first stage of photosynthesis. It happens in special structures called thylakoids inside the chloroplast. Here, chlorophyll absorbs light energy and splits water molecules, releasing oxygen as a byproduct.",
    "The Calvin Cycle is where the magic of sugar creation happens. Plants take carbon dioxide from the air and use the energy from ATP and NADPH to build glucose molecules. This is how plants make their own food!"
]

def main():
    # Output to frontend public folder
    output_dir = Path(__file__).parent.parent / "frontend" / "public" / "audio" / "demo"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    print("Loading Kokoro TTS...")
    try:
        from tts_engine import KokoroTTS
        tts = KokoroTTS(model_dir=str(KOKORO_PATH))
        print("✓ TTS loaded successfully")
    except Exception as e:
        print(f"✗ Failed to load TTS: {e}")
        return
    
    print(f"\nGenerating {len(DEMO_SCRIPTS)} demo audio files...")
    print(f"Output directory: {output_dir}\n")
    
    for i, script in enumerate(DEMO_SCRIPTS, 1):
        output_file = output_dir / f"slide_{i}.wav"
        print(f"  [{i}/{len(DEMO_SCRIPTS)}] Generating slide_{i}.wav...")
        print(f"      Script: {script[:60]}...")
        
        try:
            tts.save(script, str(output_file), voice="am_michael")
            print(f"      ✓ Saved ({output_file.stat().st_size / 1024:.1f} KB)")
        except Exception as e:
            print(f"      ✗ Error: {e}")
    
    print("\n" + "="*50)
    print("Demo audio generation complete!")
    print(f"Files saved to: {output_dir}")
    print("="*50)

if __name__ == "__main__":
    main()
