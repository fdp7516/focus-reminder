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
  }
})
