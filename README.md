# Focus Reminder 🎯

A lightweight macOS desktop app that helps you stay focused with periodic reminders, encouragement quotes, and a Pomodoro timer.

## Features

- **Smart Reminders** — Periodic popup reminders that detect your activity level; skips reminders when you're actively working
- **Encouragement & Quotes** — Random encouragement messages and famous quotes about focus, refreshed each time
- **Pomodoro Timer** — Classic 25/5 work-break cycle with automatic phase switching
- **Focus Statistics** — Track your daily focus time and completed Pomodoros
- **Lightweight Windows** — Compact, frameless windows that stay out of your way

## Built With

- [Electron](https://www.electronjs.org/) — Desktop application framework
- [React](https://react.dev/) — UI components
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Vite](https://vitejs.dev/) — Fast development & build tooling
- [electron-vite](https://electron-vite.org/) — Electron + Vite integration

## Getting Started

```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build

# Package as macOS app
npm run package
```

## Usage

After launching, the app sits in your menu bar with a tray icon. It will periodically show a small reminder window with an encouraging message or quote. Clicking **好的，继续专注** dismisses it; **休息 5 分钟** pauses reminders for a short break.

From the tray menu you can:
- **显示专注统计** — View today's focus time and Pomodoro count
- **开始番茄钟** — Start a Pomodoro work session
- **设置** — Configure reminder interval and Pomodoro duration

## License

MIT
