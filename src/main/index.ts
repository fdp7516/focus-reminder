import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { startTray } from './tray'

let mainWindow: BrowserWindow | null = null

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

app.whenReady().then(() => {
  createMainWindow()
  startTray(mainWindow!)
})

app.on('window-all-closed', () => {
  // 应用隐藏而非退出，常驻托盘
})
