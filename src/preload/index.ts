import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getStats: () => ipcRenderer.invoke('get-stats'),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings: any) => ipcRenderer.invoke('update-settings', settings),
  dismissReminder: () => ipcRenderer.invoke('dismiss-reminder'),
  takeBreak: (minutes: number) => ipcRenderer.invoke('take-break', minutes),
  onReminder: (callback: () => void) => {
    ipcRenderer.on('show-reminder', callback)
    return () => ipcRenderer.removeListener('show-reminder', callback)
  },
  onPomodoroPhaseChange: (callback: (phase: string) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, phase: string) => callback(phase)
    ipcRenderer.on('pomodoro-phase-change', handler)
    return () => ipcRenderer.removeListener('pomodoro-phase-change', handler)
  },

  startPomodoro: () => ipcRenderer.invoke('start-pomodoro'),
  stopPomodoro: () => ipcRenderer.invoke('stop-pomodoro'),
  getPomodoroStatus: () => ipcRenderer.invoke('get-pomodoro-status')
})
