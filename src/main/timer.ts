import { BrowserWindow } from 'electron'
import { isUserActive } from './activity'
import { loadSettings } from './store'

let reminderInterval: ReturnType<typeof setInterval> | null = null
let isBreakMode = false
let breakEndTime = 0

// Pomodoro state
let pomodoroActive = false
let pomodoroPhase: 'work' | 'break' = 'work'
let pomodoroRemaining = 0
let pomodoroTimer: ReturnType<typeof setInterval> | null = null

export function startReminderTimer(reminderWindow: BrowserWindow): void {
  const settings = loadSettings()
  const intervalMs = settings.reminderInterval * 60 * 1000

  reminderInterval = setInterval(() => {
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
