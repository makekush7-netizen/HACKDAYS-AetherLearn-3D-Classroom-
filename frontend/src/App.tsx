import { useState } from 'react'
import { Classroom } from './components/Classroom'
import { GenerateLecture } from './components/GenerateLecture'
import { LecturePlayer } from './components/LecturePlayer'
import { Sparkles, BookOpen, Play, ArrowLeft } from 'lucide-react'

interface Slide {
  slide_num: number
  title: string
  bullets: string[]
  svg_url: string
  audio_url: string | null
}

interface LectureData {
  lecture_id: string
  topic: string
  slides: Slide[]
  script: string[]
}

type View = 'home' | 'generate' | 'player'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [lecture, setLecture] = useState<LectureData | null>(null)

  const handleLectureGenerated = (data: LectureData) => {
    setLecture(data)
    setView('player')
  }

  const handleBack = () => {
    setView('home')
    setLecture(null)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={handleBack}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              AetherLearn
            </span>
          </div>
          
          {view !== 'home' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {view === 'home' && (
          <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4">
            {/* Hero */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-4">
                <span className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                <span className="text-white">3D Lectures</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Transform any topic into an immersive 3D classroom experience. 
                Powered by Gemini AI and realistic text-to-speech.
              </p>
            </div>

            {/* Action Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl w-full">
              {/* Generate New */}
              <button
                onClick={() => setView('generate')}
                className="group p-8 rounded-2xl glass hover:bg-white/10 transition-all duration-300 text-left glow"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Generate Lecture</h3>
                <p className="text-gray-400">
                  Enter any topic and watch AI create an engaging 3D lecture with slides and narration.
                </p>
              </button>

              {/* Demo */}
              <button
                onClick={() => {
                  // Load demo lecture with multiple slides
                  setLecture({
                    lecture_id: 'demo',
                    topic: 'Demo: How AetherLearn Works',
                    slides: [
                      {
                        slide_num: 1,
                        title: 'Welcome to AetherLearn',
                        bullets: [
                          'AI-powered lecture generation',
                          'Immersive 3D classroom environment',
                          'Natural text-to-speech narration',
                          'Interactive visual learning'
                        ],
                        svg_url: '',
                        audio_url: null
                      },
                      {
                        slide_num: 2,
                        title: 'How It Works',
                        bullets: [
                          '1. Enter any topic you want to learn',
                          '2. AI generates script and slides',
                          '3. Kokoro TTS creates natural voice',
                          '4. Watch in immersive 3D classroom'
                        ],
                        svg_url: '',
                        audio_url: null
                      },
                      {
                        slide_num: 3,
                        title: 'Powered by Advanced AI',
                        bullets: [
                          'Google Gemini for content generation',
                          'Kokoro ONNX for realistic speech',
                          'Three.js for 3D graphics',
                          'FastAPI backend, React frontend'
                        ],
                        svg_url: '',
                        audio_url: null
                      }
                    ],
                    script: [
                      'Welcome to AetherLearn! This is a revolutionary AI-powered learning platform that transforms any topic into an immersive 3D classroom experience.',
                      'Here is how it works: Simply enter a topic, and our AI generates both a lecture script and visual slides. Then, our text-to-speech engine creates natural narration.',
                      'The platform is powered by cutting-edge AI technologies including Google Gemini for intelligent content generation and Kokoro for human-like speech synthesis.'
                    ]
                  })
                  setView('player')
                }}
                className="group p-8 rounded-2xl glass hover:bg-white/10 transition-all duration-300 text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Try Demo</h3>
                <p className="text-gray-400">
                  Experience the 3D classroom environment with a sample lecture.
                </p>
              </button>
            </div>

            {/* Features */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
              {[
                { icon: '🤖', label: 'Gemini AI' },
                { icon: '🎙️', label: 'Kokoro TTS' },
                { icon: '🎬', label: '3D Animation' },
                { icon: '📊', label: 'Auto Slides' },
              ].map((feature) => (
                <div key={feature.label} className="p-4 rounded-xl glass text-center">
                  <span className="text-2xl mb-2 block">{feature.icon}</span>
                  <span className="text-sm text-gray-300">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'generate' && (
          <GenerateLecture onGenerated={handleLectureGenerated} />
        )}

        {view === 'player' && lecture && (
          <LecturePlayer lecture={lecture} />
        )}
      </main>
    </div>
  )
}
