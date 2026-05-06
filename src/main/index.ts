import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { startTray } from './tray'
import { startReminderTimer, stopReminderTimer, stopPomodoro, takeBreak } from './timer'
import { startActivityDetection, stopActivityDetection } from './activity'
import { loadSettings, saveSettings, loadTodaySessions } from './store'
import type { AppSettings } from './store'

let mainWindow: BrowserWindow | null = null
let reminderWindow: BrowserWindow | null = null
let settingsWindow: BrowserWindow | null = null

function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 320,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('closed', () => { mainWindow = null })
}

export function createReminderWindow(): BrowserWindow {
  if (reminderWindow) {
    reminderWindow.focus()
    return reminderWindow
  }

  reminderWindow = new BrowserWindow({
    width: 360,
    height: 200,
    show: false,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    reminderWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}?view=reminder`)
  } else {
    reminderWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      query: { view: 'reminder' }
    })
  }
  reminderWindow.on('closed', () => { reminderWindow = null })

  return reminderWindow
}

export function createSettingsWindow(): BrowserWindow {
  if (settingsWindow) {
    settingsWindow.focus()
    return settingsWindow
  }

  settingsWindow = new BrowserWindow({
    width: 400,
    height: 350,
    show: false,
    frame: false,
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    settingsWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}?view=settings`)
  } else {
    settingsWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      query: { view: 'settings' }
    })
  }
  settingsWindow.on('closed', () => { settingsWindow = null })

  return settingsWindow
}

app.whenReady().then(() => {
  createMainWindow()
  if (mainWindow) {
    startTray(mainWindow)
  }

  startActivityDetection()
  const reminderWin = createReminderWindow()
  startReminderTimer(reminderWin)

  ipcMain.handle('dismiss-reminder', () => {
    reminderWindow?.close()
  })

  ipcMain.handle('take-break', (_e, minutes: number) => {
    reminderWindow?.close()
    takeBreak(minutes)
  })

  ipcMain.handle('get-stats', () => {
    return loadTodaySessions()
  })

  ipcMain.handle('get-settings', () => {
    return loadSettings()
  })

  ipcMain.handle('update-settings', (_e, settings: AppSettings) => {
    saveSettings(settings)
  })
})

app.on('window-all-closed', () => {
  // App stays in tray; don't quit on window close
})

app.on('before-quit', () => {
  stopReminderTimer()
  stopPomodoro()
  stopActivityDetection()
  reminderWindow?.destroy()
  settingsWindow?.destroy()
  mainWindow?.destroy()
})
