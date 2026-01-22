import { useState, useEffect } from 'react'
import { Classroom } from './components/Classroom'
import { GenerateLecture } from './components/GenerateLecture'
import { LecturePlayer } from './components/LecturePlayer'
import { Sparkles, Play, ArrowLeft, Zap, Mic2, Monitor, ChevronRight, Star } from 'lucide-react'

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

// Demo lecture content
const demoLecture: LectureData = {
  lecture_id: 'demo',
  topic: 'Introduction to Photosynthesis',
  slides: [
    {
      slide_num: 1,
      title: 'Introduction to Photosynthesis',
      bullets: [
        'The process that powers life on Earth',
        'Converting sunlight into chemical energy',
        'Why every living thing depends on it',
        'Found in plants, algae, and some bacteria'
      ],
      svg_url: '',
      audio_url: null
    },
    {
      slide_num: 2,
      title: 'The Light Reaction',
      bullets: [
        'Occurs in the thylakoid membranes',
        'Chlorophyll absorbs light energy',
        'Water molecules are split (H₂O → O₂)',
        'ATP and NADPH are produced'
      ],
      svg_url: '',
      audio_url: null
    },
    {
      slide_num: 3,
      title: 'The Calvin Cycle',
      bullets: [
        'Takes place in the chloroplast stroma',
        'CO₂ is fixed into organic molecules',
        'Uses ATP and NADPH from light reactions',
        'Produces glucose (C₆H₁₂O₆)'
      ],
      svg_url: '',
      audio_url: null
    }
  ],
  script: [
    'Welcome to our lesson on photosynthesis! This is one of the most important processes on Earth.',
    'The light reaction is the first stage. It happens in special structures called thylakoids.',
    'The Calvin Cycle is where the magic of sugar creation happens. Plants take CO2 and make glucose!'
  ]
}

export default function App() {
  const [view, setView] = useState<View>('home')
  const [lecture, setLecture] = useState<LectureData | null>(null)
  const [demoSlide, setDemoSlide] = useState(0)
  const [demoPlaying, setDemoPlaying] = useState(false)
  const [classroomLoaded, setClassroomLoaded] = useState(false)

  // Auto-rotate demo slides
  useEffect(() => {
    if (view !== 'home') return
    const interval = setInterval(() => {
      setDemoSlide(prev => (prev + 1) % demoLecture.slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [view])

  const handleLectureGenerated = (data: LectureData) => {
    setLecture(data)
    setView('player')
  }

  const handleBack = () => {
    setView('home')
    setLecture(null)
  }

  const startDemo = () => {
    setLecture(demoLecture)
    setView('player')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={handleBack}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">AetherLearn</span>
              <span className="hidden sm:inline ml-2 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30">
                AI-Powered
              </span>
            </div>
          </div>
          
          {view !== 'home' ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={() => setView('generate')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-medium transition-all shadow-lg shadow-purple-500/25"
            >
              <Sparkles className="w-4 h-4" />
              Generate Lecture
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {view === 'home' && (
          <div className="pt-20">
            {/* Hero Section */}
            <section className="min-h-[calc(100vh-5rem)] flex items-center">
              <div className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-12 items-center">
                {/* Left - Text Content */}
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-cyan-300">AI-Powered Education Platform</span>
                  </div>

                  <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                    <span className="text-white">Interactive</span>
                    <br />
                    <span className="text-white">Learning,</span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Powered by AI
                    </span>
                  </h1>

                  <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                    AI-powered 3D virtual classrooms that transform any topic into an immersive lecture. 
                    Experience education that's engaging, visual, and personalized.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setView('generate')}
                      className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-semibold text-lg transition-all shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
                    >
                      <Sparkles className="w-5 h-5" />
                      Generate Lecture
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={startDemo}
                      className="flex items-center gap-3 px-8 py-4 rounded-2xl glass border border-white/10 hover:border-white/20 font-semibold text-lg transition-all hover:bg-white/5"
                    >
                      <Play className="w-5 h-5" />
                      Explore Demo
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-4">
                    <div className="flex -space-x-2">
                      {['A', 'B', 'C', 'D', 'E'].map((letter, i) => (
                        <div 
                          key={letter}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900"
                          style={{ 
                            background: `linear-gradient(135deg, ${['#06b6d4', '#8b5cf6', '#ec4899', '#f97316', '#22c55e'][i]}, ${['#0891b2', '#7c3aed', '#db2777', '#ea580c', '#16a34a'][i]})` 
                          }}
                        >
                          {letter}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">Loved by 10,000+ students</span>
                  </div>
                </div>

                {/* Right - Live Demo Preview */}
                <div className="relative">
                  {/* Decorative glow */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
                  
                  {/* Demo Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    {/* Live Demo Badge */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/90 backdrop-blur">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span className="text-xs font-medium text-white">Live Demo</span>
                    </div>

                    {/* 3D Classroom Preview */}
                    <div className="aspect-video bg-slate-800">
                      <Classroom 
                        isPlaying={demoPlaying}
                        onLoaded={() => setClassroomLoaded(true)}
                        slideContent={demoLecture.slides[demoSlide]}
                      />
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => setDemoPlaying(!demoPlaying)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            <Play className={`w-4 h-4 ${demoPlaying ? 'text-green-400' : ''}`} />
                            <span className="text-sm">{demoPlaying ? 'Pause' : 'Play'}</span>
                          </button>
                          <button 
                            onClick={() => setDemoSlide(prev => Math.max(0, prev - 1))}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-lg"
                          >
                            ◀
                          </button>
                          <button 
                            onClick={() => setDemoSlide(prev => Math.min(demoLecture.slides.length - 1, prev + 1))}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-lg"
                          >
                            ▶
                          </button>
                        </div>
                        
                        {/* Slide indicator */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">
                            {demoSlide + 1}/{demoLecture.slides.length}
                          </span>
                          <div className="flex gap-1">
                            {demoLecture.slides.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setDemoSlide(i)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                  i === demoSlide ? 'w-6 bg-white' : 'bg-white/30 hover:bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature badges floating around */}
                  <div className="absolute -bottom-4 -right-4 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 text-slate-900 shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Monitor className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">3D Classroom</span>
                  </div>

                  <div className="absolute -top-4 -right-4 z-30 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 text-slate-900 shadow-xl">
                    <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-sm font-medium">AI Tutor</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Features Section */}
            <section className="py-20 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">
                  Powered by <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Advanced AI</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Sparkles,
                      title: 'Gemini AI',
                      desc: 'Google\'s most capable AI generates comprehensive lecture content on any topic',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      icon: Mic2,
                      title: 'Kokoro TTS',
                      desc: 'State-of-the-art text-to-speech creates natural, human-like narration',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      icon: Monitor,
                      title: '3D Classroom',
                      desc: 'Immersive Three.js environment with animated lecturer and visual slides',
                      color: 'from-orange-500 to-red-500'
                    }
                  ].map((feature) => (
                    <div 
                      key={feature.title}
                      className="group p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.07]"
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-white/5">
              <div className="max-w-3xl mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-6 text-white">
                  Ready to transform learning?
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Enter any topic and watch AI create an immersive 3D lecture in seconds.
                </p>
                <button
                  onClick={() => setView('generate')}
                  className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-semibold text-xl transition-all shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105"
                >
                  <Sparkles className="w-6 h-6" />
                  Generate Your First Lecture
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </section>
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
