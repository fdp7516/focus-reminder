import { BrowserWindow } from 'electron'
import { isUserActive } from './activity'
import { addSession, FocusSession, loadSettings } from './store'

let sessionStartTime: number | null = null
let reminderInterval: ReturnType<typeof setInterval> | null = null
let isBreakMode = false
let breakEndTime = 0

// Pomodoro state
let pomodoroActive = false
let pomodoroPhase: 'work' | 'break' = 'work'
let pomodoroRemaining = 0
let pomodoroTimer: ReturnType<typeof setInterval> | null = null

export function startReminderTimer(reminderWindow: BrowserWindow): void {
  sessionStartTime = Date.now()

  const settings = loadSettings()
  const intervalMs = settings.reminderInterval * 60 * 1000

  reminderInterval = setInterval(() => {
    if (reminderWindow.isDestroyed()) {
      stopReminderTimer()
      return
    }

    if (isBreakMode) {
      if (Date.now() >= breakEndTime) {
        isBreakMode = false
      } else {
        return
      }
    }

    if (isUserActive()) {
      return
    }

    // Record session before showing reminder
    if (sessionStartTime) {
      const endTime = Date.now()
      const duration = Math.round((endTime - sessionStartTime) / 60000)
      if (duration >= 1) {
        const session: FocusSession = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          startTime: new Date(sessionStartTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          duration,
          type: 'normal'
        }
        addSession(session)
      }
    }
    // Reset timer
    sessionStartTime = Date.now()

    reminderWindow.show()
    reminderWindow.focus()
    reminderWindow.webContents.send('show-reminder')
  }, intervalMs)
}

export function stopReminderTimer(): void {
  if (reminderInterval) {
    clearInterval(reminderInterval)
    reminderInterval = null
  }
}

export function takeBreak(minutes: number): void {
  isBreakMode = true
  breakEndTime = Date.now() + minutes * 60 * 1000
}

export function isOnBreak(): boolean {
  return isBreakMode
}

export function startPomodoro(reminderWindow: BrowserWindow): void {
  if (pomodoroActive) return
  pomodoroActive = true
  pomodoroPhase = 'work'

  const settings = loadSettings()
  pomodoroRemaining = settings.workDuration * 60

  pomodoroTimer = setInterval(() => {
    if (reminderWindow.isDestroyed()) {
      stopPomodoro()
      return
    }
    pomodoroRemaining--
    if (pomodoroRemaining <= 0) {
      if (pomodoroPhase === 'work') {
        reminderWindow.webContents.send('pomodoro-phase-change', 'break')
        reminderWindow.show()
        pomodoroPhase = 'break'
        pomodoroRemaining = settings.breakDuration * 60
      } else {
        reminderWindow.webContents.send('pomodoro-phase-change', 'work')
        reminderWindow.show()
        pomodoroPhase = 'work'
        pomodoroRemaining = settings.workDuration * 60
      }
    }
  }, 1000)
}

export function stopPomodoro(): void {
  pomodoroActive = false
  if (pomodoroTimer) {
    clearInterval(pomodoroTimer)
    pomodoroTimer = null
  }
}

export function getPomodoroStatus() {
  return { active: pomodoroActive, phase: pomodoroPhase, remaining: pomodoroRemaining }
}
