import { Loader2, Sparkles, BookOpen, Mic } from 'lucide-react'

interface LoadingScreenProps {
  stage: 'connecting' | 'generating' | 'audio' | 'finalizing'
  topic: string
}

const stages = {
  connecting: { text: 'Connecting to Gemini AI...', progress: 15, icon: Sparkles },
  generating: { text: 'Generating lecture content...', progress: 45, icon: BookOpen },
  audio: { text: 'Creating voice narration...', progress: 75, icon: Mic },
  finalizing: { text: 'Preparing your classroom...', progress: 95, icon: Sparkles },
}

export function LoadingScreen({ stage, topic }: LoadingScreenProps) {
  const { text, progress, icon: Icon } = stages[stage]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center px-8 max-w-lg">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Icon className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center animate-bounce">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          </div>
        </div>

        {/* Topic */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Creating Your Lecture
        </h2>
        <p className="text-lg text-purple-200 mb-8">
          "{topic}"
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/10 rounded-full h-3 mb-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <p className="text-white/80 flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {text}
        </p>

        {/* Tip */}
        <p className="mt-8 text-sm text-white/50">
          💡 Tip: Longer lectures take more time but provide more depth
        </p>
      </div>
    </div>
  )
}
