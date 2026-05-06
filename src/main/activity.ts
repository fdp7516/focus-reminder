import { powerMonitor } from 'electron'

let isActive = true // Pessimistic: assume active until proven otherwise
let checkInterval: ReturnType<typeof setInterval> | null = null

const onResume = (): void => {
  isActive = true
}

export function startActivityDetection(activityTimeoutMs: number = 5 * 60 * 1000): void {
  checkInterval = setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime() * 1000
    isActive = idleTime < activityTimeoutMs
  }, 5000)

  powerMonitor.on('resume', onResume)
}

export function stopActivityDetection(): void {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
  powerMonitor.removeListener('resume', onResume)
}

export function isUserActive(): boolean {
  return isActive
}
