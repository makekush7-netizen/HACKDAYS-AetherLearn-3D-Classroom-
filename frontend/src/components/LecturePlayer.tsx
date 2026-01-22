import { useState, useRef, useEffect } from 'react'
import { Classroom } from './Classroom'
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCcw } from 'lucide-react'

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

interface LecturePlayerProps {
  lecture: LectureData
}

export function LecturePlayer({ lecture }: LecturePlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [classroomLoaded, setClassroomLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const slide = lecture.slides[currentSlide]
  const totalSlides = lecture.slides.length

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }

    const audio = audioRef.current

    const handleEnded = () => {
      // Auto-advance to next slide
      if (currentSlide < totalSlides - 1) {
        setCurrentSlide(prev => prev + 1)
      } else {
        setIsPlaying(false)
      }
    }

    audio.addEventListener('ended', handleEnded)

    // Load current slide's audio
    if (slide?.audio_url) {
      audio.src = slide.audio_url
      audio.muted = isMuted
      
      if (isPlaying) {
        audio.play().catch(err => console.log('Audio play error:', err))
      }
    }

    return () => {
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSlide, slide?.audio_url, isPlaying, totalSlides, isMuted])

  // Pause/resume audio with isPlaying state
  useEffect(() => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const goToSlide = (index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }

  const restart = () => {
    setCurrentSlide(0)
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Topic Title */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">{lecture.topic}</h2>
          <p className="text-gray-400">Slide {currentSlide + 1} of {totalSlides}</p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* 3D Classroom - Takes 2/3 */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-2xl overflow-hidden glass glow">
              <Classroom 
                isPlaying={isPlaying}
                onLoaded={() => setClassroomLoaded(true)}
                slideContent={slide ? { title: slide.title, bullets: slide.bullets } : undefined}
              />
            </div>

            {/* Controls */}
            <div className="mt-4 flex items-center justify-center gap-4">
              {/* Restart */}
              <button
                onClick={restart}
                className="p-3 rounded-xl glass hover:bg-white/10 transition-colors"
                title="Restart"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              {/* Previous */}
              <button
                onClick={() => goToSlide(currentSlide - 1)}
                disabled={currentSlide === 0}
                className="p-3 rounded-xl glass hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={!classroomLoaded}
                className="p-4 rounded-xl bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:opacity-50 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => goToSlide(currentSlide + 1)}
                disabled={currentSlide === totalSlides - 1}
                className="p-3 rounded-xl glass hover:bg-white/10 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Mute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-xl glass hover:bg-white/10 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Slide Progress */}
            <div className="mt-4 flex gap-2 justify-center">
              {lecture.slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlide 
                      ? 'w-8 bg-primary-500' 
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Sidebar - Script & Slides */}
          <div className="space-y-4">
            {/* Current Slide Content */}
            <div className="p-4 rounded-xl glass">
              <h3 className="font-semibold text-lg mb-2 text-primary-400">
                {slide?.title || 'Loading...'}
              </h3>
              <ul className="space-y-2">
                {slide?.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Script */}
            <div className="p-4 rounded-xl glass">
              <h4 className="font-medium text-sm text-gray-400 mb-2">Lecture Script</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {lecture.script[currentSlide] || 'No script available'}
              </p>
            </div>

            {/* All Slides */}
            <div className="p-4 rounded-xl glass">
              <h4 className="font-medium text-sm text-gray-400 mb-3">All Slides</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {lecture.slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      i === currentSlide 
                        ? 'bg-primary-500/20 border border-primary-500/50' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-xs text-gray-500">Slide {i + 1}</span>
                    <p className="text-sm truncate">{s.title}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
