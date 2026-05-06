function App() {
  // 通过查询参数判断当前窗口类型
  const params = new URLSearchParams(window.location.search)
  const view = params.get('view') || 'dashboard'

  switch (view) {
    case 'reminder':
      return <div>Reminder Popup</div>
    case 'settings':
      return <div>Settings</div>
    default:
      return <div>Dashboard</div>
  }
}

export default App
