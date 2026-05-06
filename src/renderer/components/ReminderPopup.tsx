import { useState, useEffect } from 'react'
import quotesData from '../assets/quotes.json'

interface Quote {
  text: string
  author: string
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function ReminderPopup() {
  const [message, setMessage] = useState<{ text: string; author?: string }>({ text: '' })

  useEffect(() => {
    const isQuote = Math.random() > 0.5
    if (isQuote) {
      const q: Quote = getRandomItem(quotesData.quotes)
      setMessage({ text: q.text, author: q.author })
    } else {
      const encouragement = getRandomItem(quotesData.encouragements)
      setMessage({ text: encouragement })
    }
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.quote}>{message.text}</div>
      {message.author && <div style={styles.author}>—— {message.author}</div>}
      <div style={styles.buttons}>
        <button style={styles.primaryBtn} onClick={() => window.electronAPI.dismissReminder()}>
          好的，继续专注
        </button>
        <button style={styles.secondaryBtn} onClick={() => window.electronAPI.takeBreak(5)}>
          休息 5 分钟
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
    alignItems: 'center',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    color: '#e0e0e0',
    padding: 20,
    boxSizing: 'border-box',
    userSelect: 'none',
    WebkitAppRegion: 'drag' as any
  },
  quote: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 8,
    color: '#f0f0f0'
  },
  author: {
    fontSize: 13,
    color: '#8899aa',
    fontStyle: 'italic',
    marginBottom: 16
  },
  buttons: {
    display: 'flex',
    gap: 10,
    WebkitAppRegion: 'no-drag' as any
  },
  primaryBtn: {
    background: '#4a9eff',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '8px 20px',
    fontSize: 13,
    cursor: 'pointer'
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#8899aa',
    border: '1px solid #334455',
    borderRadius: 8,
    padding: '8px 14px',
    fontSize: 13,
    cursor: 'pointer'
  }
}

export default ReminderPopup
