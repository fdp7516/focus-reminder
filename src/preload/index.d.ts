export interface ElectronAPI {
  getStats: () => Promise<any>
  getSettings: () => Promise<any>
  updateSettings: (settings: any) => Promise<void>
  dismissReminder: () => Promise<void>
  takeBreak: (minutes: number) => Promise<void>
  onReminder: (callback: () => void) => () => void
  onPomodoroPhaseChange: (callback: (phase: string) => void) => () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
