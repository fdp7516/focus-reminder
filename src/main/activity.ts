import { powerMonitor } from 'electron'

let isActive = false
let checkInterval: ReturnType<typeof setInterval> | null = null

export function startActivityDetection(activityTimeoutMs: number = 5 * 60 * 1000): void {
  checkInterval = setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime() * 1000
    isActive = idleTime < activityTimeoutMs
  }, 5000)

  powerMonitor.on('resume', () => {
    isActive = true
  })
}

export function stopActivityDetection(): void {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}

export function isUserActive(): boolean {
  return isActive
}
