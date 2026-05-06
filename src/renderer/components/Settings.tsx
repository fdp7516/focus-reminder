import { useState, useEffect } from 'react'

interface SettingsData {
  reminderInterval: number
  workDuration: number
  breakDuration: number
  activityTimeout: number
}

function Settings() {
  const [settings, setSettings] = useState<SettingsData | null>(null)
  const [tab, setTab] = useState<'reminder' | 'pomodoro'>('reminder')

  useEffect(() => {
    window.electronAPI.getSettings().then(setSettings)
  }, [])

  if (!settings) return <div style={styles.container}>加载中...</div>

  return (
    <div style={styles.container}>
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(tab === 'reminder' ? styles.activeTab : {}) }}
          onClick={() => setTab('reminder')}
        >
          提醒设置
        </button>
        <button
          style={{ ...styles.tab, ...(tab === 'pomodoro' ? styles.activeTab : {}) }}
          onClick={() => setTab('pomodoro')}
        >
          番茄钟
        </button>
      </div>

      {tab === 'reminder' && (
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>提醒间隔（分钟）</label>
            <input
              style={styles.input}
              type="number"
              min={1}
              value={settings.reminderInterval}
              onChange={e => setSettings({ ...settings, reminderInterval: Number(e.target.value) })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>活跃判定超时（分钟）</label>
            <input
              style={styles.input}
              type="number"
              min={1}
              value={settings.activityTimeout}
              onChange={e => setSettings({ ...settings, activityTimeout: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      {tab === 'pomodoro' && (
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>工作时长（分钟）</label>
            <input
              style={styles.input}
              type="number"
              min={1}
              value={settings.workDuration}
              onChange={e => setSettings({ ...settings, workDuration: Number(e.target.value) })}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>休息时长（分钟）</label>
            <input
              style={styles.input}
              type="number"
              min={1}
              value={settings.breakDuration}
              onChange={e => setSettings({ ...settings, breakDuration: Number(e.target.value) })}
            />
          </div>
        </div>
      )}

      <button
        style={styles.saveBtn}
        onClick={() => {
          if (settings) {
            window.electronAPI.updateSettings(settings)
          }
        }}
      >
        保存设置
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100vh',
    padding: 20,
    background: '#ffffff',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  },
  tabs: {
    display: 'flex',
    gap: 0,
    marginBottom: 20,
    borderBottom: '1px solid #eee'
  },
  tab: {
    flex: 1,
    padding: '10px 0',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    color: '#666',
    borderBottom: '2px solid transparent'
  },
  activeTab: {
    color: '#4a9eff',
    borderBottom: '2px solid #4a9eff'
  },
  form: {
    flex: 1
  },
  field: {
    marginBottom: 16
  },
  fieldLabel: {
    display: 'block',
    fontSize: 13,
    color: '#666',
    marginBottom: 6
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: 6,
    fontSize: 14,
    boxSizing: 'border-box'
  },
  saveBtn: {
    width: '100%',
    padding: 10,
    background: '#4a9eff',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 'auto'
  }
}

export default Settings
