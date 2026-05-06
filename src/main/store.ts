// Stub store — will be expanded in Task 4

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

export function loadSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS }
}
