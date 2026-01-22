# AetherLearn MVP - Quick Start Script
# Run this to start both frontend and backend

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  AetherLearn MVP - AI Lecture Generator" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (!(Test-Path "backend\.env")) {
    Write-Host "⚠ No .env file found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Creating backend\.env file..."
    Set-Content -Path "backend\.env" -Value "GEMINI_API_KEY=your-api-key-here"
    Write-Host ""
    Write-Host "Please edit backend\.env and add your Gemini API key" -ForegroundColor Yellow
    Write-Host "Get one from: https://aistudio.google.com/app/apikey" -ForegroundColor Yellow
    Write-Host ""
    exit
}

Write-Host "✓ Found .env file" -ForegroundColor Green

# Test API key
Write-Host ""
Write-Host "Testing Gemini API connection..." -ForegroundColor Cyan
cd backend
.\venv\Scripts\Activate.ps1
python test_api.py
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ API test failed. Please check your .env file." -ForegroundColor Red
    Write-Host ""
    deactivate
    cd ..
    exit
}
deactivate
cd ..

Write-Host ""
Write-Host "Starting servers..." -ForegroundColor Cyan
Write-Host ""

# Start backend
Write-Host "→ Starting backend (http://localhost:8000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; .\venv\Scripts\Activate.ps1; python main.py"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend
Write-Host "→ Starting frontend (http://localhost:5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  Servers Started!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop servers" -ForegroundColor Yellow
Write-Host ""
