import { useState } from 'react'
import { Sparkles, Loader2, BookOpen, Clock, Mic } from 'lucide-react'
import { LoadingScreen } from './LoadingScreen'

interface GenerateLectureProps {
  onGenerated: (data: any) => void
}

export function GenerateLecture({ onGenerated }: GenerateLectureProps) {
  const [topic, setTopic] = useState('')
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('short')
  const [voice, setVoice] = useState('af_sky')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadingStage, setLoadingStage] = useState<'connecting' | 'generating' | 'audio' | 'finalizing'>('connecting')

  const voices = [
    { id: 'af_sky', name: 'Sky', gender: 'Female' },
    { id: 'af_sarah', name: 'Sarah', gender: 'Female' },
    { id: 'af_nicole', name: 'Nicole', gender: 'Female' },
    { id: 'am_michael', name: 'Michael', gender: 'Male' },
    { id: 'am_adam', name: 'Adam', gender: 'Male' },
  ]

  const durations = [
    { id: 'short', name: 'Short', desc: '2-3 slides', icon: '⚡' },
    { id: 'medium', name: 'Medium', desc: '4-5 slides', icon: '📚' },
    { id: 'long', name: 'Long', desc: '6-8 slides', icon: '📖' },
  ]

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setLoading(true)
    setError(null)
    setLoadingStage('connecting')

    try {
      // Simulate stages for better UX
      setTimeout(() => setLoadingStage('generating'), 2000)
      
      const response = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          duration,
          voice,
          style: 'educational'
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Failed to generate lecture')
      }

      setLoadingStage('audio')
      const data = await response.json()
      
      setLoadingStage('finalizing')
      setTimeout(() => {
        setLoading(false)
        onGenerated(data)
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const suggestedTopics = [
    'Photosynthesis',
    'The Solar System',
    'World War II',
    'Machine Learning Basics',
    'Climate Change',
    'The Human Heart',
  ]

  // Show loading screen when generating
  if (loading) {
    return <LoadingScreen stage={loadingStage} topic={topic} />
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-white">Generate AI Lecture</h2>
          <p className="text-gray-400">Enter any topic and let AI create an immersive lesson</p>
        </div>

        {/* Form */}
        <div className="p-6 rounded-2xl glass">
          {/* Topic Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <BookOpen className="w-4 h-4 inline mr-1" />
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., How do black holes form?"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all text-white placeholder-gray-500"
              disabled={loading}
            />
            
            {/* Suggested Topics */}
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedTopics.map((t) => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className="px-3 py-1 text-sm rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  disabled={loading}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Clock className="w-4 h-4 inline mr-1" />
              Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDuration(d.id as any)}
                  className={`p-3 rounded-xl border transition-all ${
                    duration === d.id
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  disabled={loading}
                >
                  <span className="text-lg block mb-1">{d.icon}</span>
                  <span className="text-sm font-medium block">{d.name}</span>
                  <span className="text-xs text-gray-400">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Voice */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">
              <Mic className="w-4 h-4 inline mr-1" />
              Lecturer Voice
            </label>
            <div className="grid grid-cols-5 gap-2">
              {voices.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={`p-2 rounded-lg border transition-all text-center ${
                    voice === v.id
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  disabled={loading}
                >
                  <span className="text-xs font-medium block">{v.name}</span>
                  <span className="text-xs text-gray-500">{v.gender}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/25"
          >
            <Sparkles className="w-5 h-5" />
            Generate Lecture
          </button>
        </div>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Generation takes 10-30 seconds depending on lecture length
        </p>
      </div>
    </div>
  )
}
