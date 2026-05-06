import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { startTray } from './tray'

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

  const url = process.env.ELECTRON_RENDERER_URL
    ? `${process.env.ELECTRON_RENDERER_URL}?view=reminder`
    : `file://${join(__dirname, '../renderer/index.html')}?view=reminder`

  reminderWindow.loadURL(url)
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
    resizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const url = process.env.ELECTRON_RENDERER_URL
    ? `${process.env.ELECTRON_RENDERER_URL}?view=settings`
    : `file://${join(__dirname, '../renderer/index.html')}?view=settings`

  settingsWindow.loadURL(url)
  settingsWindow.on('closed', () => { settingsWindow = null })

  return settingsWindow
}

app.whenReady().then(() => {
  createMainWindow()
  startTray(mainWindow!)

  ipcMain.handle('dismiss-reminder', () => {
    reminderWindow?.close()
  })

  ipcMain.handle('take-break', (_e, minutes: number) => {
    reminderWindow?.close()
  })
})

app.on('window-all-closed', () => {
  // 应用隐藏而非退出，常驻托盘
})
