import ReminderPopup from './components/ReminderPopup'
import Dashboard from './components/Dashboard'
import Settings from './components/Settings'

function App() {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view') || 'dashboard'

  switch (view) {
    case 'reminder':
      return <ReminderPopup />
    case 'settings':
      return <Settings />
    default:
      return <Dashboard />
  }
}

export default App
