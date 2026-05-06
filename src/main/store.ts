import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

const DATA_DIR = path.join(app.getPath('userData'), 'focus-reminder')
const STATS_FILE = path.join(DATA_DIR, 'stats.json')
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json')

export interface FocusSession {
  id: string
  startTime: string
  endTime: string
  duration: number  // 分钟
  type: 'normal' | 'pomodoro'
}

export interface AppSettings {
  reminderInterval: number
  workDuration: number
  breakDuration: number
  activityTimeout: number
}

const DEFAULT_SETTINGS: AppSettings = {
  reminderInterval: 30,
  workDuration: 25,
  breakDuration: 5,
  activityTimeout: 5
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function loadSettings(): AppSettings {
  ensureDataDir()
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8')
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AppSettings): void {
  ensureDataDir()
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2))
}

export function loadTodaySessions(): FocusSession[] {
  ensureDataDir()
  const today = new Date().toISOString().split('T')[0]
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf-8')
    const all: FocusSession[] = JSON.parse(data)
    return all.filter(s => s.startTime.startsWith(today))
  } catch {
    return []
  }
}

export function addSession(session: FocusSession): void {
  ensureDataDir()
  let sessions: FocusSession[] = []
  try {
    const data = fs.readFileSync(STATS_FILE, 'utf-8')
    sessions = JSON.parse(data)
  } catch {
    // File doesn't exist yet, start with empty array
  }
  sessions.push(session)
  fs.writeFileSync(STATS_FILE, JSON.stringify(sessions, null, 2))
}
