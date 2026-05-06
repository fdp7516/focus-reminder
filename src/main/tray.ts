import { Menu, Tray, BrowserWindow, app } from 'electron'

let tray: Tray | null = null

export function startTray(mainWindow: BrowserWindow): void {
  // 托盘会在后续任务中实现完整功能
  // 此处创建占位实现，确保主进程能正常启动
  app.dock?.hide()
}
