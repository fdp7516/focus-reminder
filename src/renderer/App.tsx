import ReminderPopup from './components/ReminderPopup'

function App() {
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view') || 'dashboard'

  switch (view) {
    case 'reminder':
      return <ReminderPopup />
    case 'settings':
      return <div>Settings</div>
    default:
      return <div>Dashboard</div>
  }
}

export default App
