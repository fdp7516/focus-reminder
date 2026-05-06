import { useState, useEffect } from 'react'

interface FocusSession {
  id: string
  startTime: string
  endTime: string
  duration: number
  type: 'normal' | 'pomodoro'
}

export function useStats() {
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.electronAPI.getStats().then((data: FocusSession[]) => {
      setSessions(data)
      setLoading(false)
    })
  }, [])

  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0)
  const pomodoroCount = sessions.filter(s => s.type === 'pomodoro').length
  const formatDuration = (mins: number): string => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  return { sessions, loading, totalMinutes, pomodoroCount, formatDuration }
}
