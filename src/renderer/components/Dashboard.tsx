import { useStats } from '../hooks/useStats'

function Dashboard() {
  const { totalMinutes, pomodoroCount, formatDuration, loading } = useStats()

  if (loading) {
    return <div style={styles.container}><div style={{ color: '#666' }}>加载中...</div></div>
  }

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.card}>
          <div style={styles.label}>今日专注</div>
          <div style={styles.value}>{formatDuration(totalMinutes)}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.label}>番茄钟</div>
          <div style={styles.value}>{pomodoroCount}</div>
        </div>
      </div>
      <div style={styles.weekRow}>
        <span style={{ fontSize: 12, color: '#666' }}>保持专注，坚持就是胜利</span>
      </div>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <button
          style={{
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '8px 16px',
            fontSize: 13,
            cursor: 'pointer'
          }}
          onClick={() => window.electronAPI.startPomodoro?.()}
        >
          开始番茄钟
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 24,
    background: '#ffffff',
    boxSizing: 'border-box'
  },
  row: {
    display: 'flex',
    gap: 16
  },
  card: {
    flex: 1,
    background: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    textAlign: 'center' as const
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4
  },
  value: {
    fontSize: 28,
    fontWeight: 700,
    color: '#1a1a2e'
  },
  weekRow: {
    marginTop: 12,
    textAlign: 'center' as const
  }
}

export default Dashboard
