"""
Quick test script to verify your Gemini API key
"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ No API key found in .env file")
    print("\nAdd this to your .env file:")
    print('GEMINI_API_KEY="your-key-here"')
    exit(1)

print(f"✓ Found API key: {api_key[:10]}...{api_key[-4:]}")
print("\nTesting Gemini API connection...")

try:
    genai.configure(api_key=api_key)
    
    # Try gemini-2.5-flash (latest stable model)
    print("\n1. Testing gemini-2.5-flash...")
    model = genai.GenerativeModel('gemini-2.5-flash')
    response = model.generate_content("Say 'Hello from Gemini!' in one sentence.")
    print(f"   ✓ Success: {response.text[:50]}...")
    
except Exception as e:
    error_msg = str(e)
    if "429" in error_msg or "quota" in error_msg.lower():
        print("\n❌ Quota Error!")
        print("\nPossible solutions:")
        print("1. Your API key might be invalid or expired")
        print("2. Get a new key from: https://aistudio.google.com/app/apikey")
        print("3. Make sure you're signed in with the right Google account")
        print("4. Free tier has limits - wait a few minutes and try again")
    else:
        print(f"\n❌ Error: {error_msg}")
    exit(1)

print("\n" + "="*60)
print("✓ Everything working! Your API key is valid.")
print("="*60)
