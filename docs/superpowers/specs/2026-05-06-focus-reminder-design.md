# Focus Reminder — 专注力提醒桌面应用设计文档

## 概述

一款轻量的 macOS 专注力提醒桌面应用，通过定时提醒、鼓励语弹窗和专注统计，帮助用户保持工作/学习中的注意力集中。

## 技术栈

- **框架：** Electron + React + Vite + TypeScript（使用 [electron-vite](https://github.com/alex8088/electron-vite) 脚手架）
- **数据存储：** 本地 JSON 文件（`electron-store` 或直接读写 JSON）
- **UI 方案：** 原生 CSS / Tailwind CSS / 轻量 UI 库，保持窗口小巧
- **打包：** electron-builder 打包为 macOS 应用

## 窗口设计

所有窗口均为紧凑、轻量的「用完即走」式设计，没有传统的大页面布局。

### 1. 提醒弹窗 (360×200px)

定时触发的核心交互窗口，自动居中弹出。

- 显示随机鼓励语或名言（从语料库中选取）
- 两个操作按钮：
  - 「好的，继续专注」→ 关闭弹窗，继续计时
  - 「休息 5 分钟」→ 关闭弹窗，暂停提醒 5 分钟
- 无边框、毛玻璃效果（macOS Vibrancy）
- 自动关闭：若用户无操作 30 秒后自动消失

### 2. 迷你仪表盘 (420×320px)

从托盘图标点击「显示统计」打开的主窗口。

- 今日专注时长（大号数字显示）
- 番茄钟完成数 / 目标数
- 本周总专注时长
- 底部小字：上次专注时间

### 3. 设置窗口 (400×350px)

从托盘菜单打开的小型设置弹窗。

- Tab 切换：提醒设置、番茄钟设置、关于
- 提醒设置：提醒间隔（分钟）、静音时段
- 番茄钟设置：工作时长、休息时长
- 关于：版本号

## 核心功能

### 智能提醒系统

- **固定间隔提醒**：默认每 30 分钟提醒一次（用户可自定义）
- **活跃检测**：检测键盘/鼠标活动。若用户在持续操作（打字、滚动等），说明正在专注工作，跳过本次提醒
- **错过提醒补弹**：若用户离开电脑，回来后补弹一次摘要通知
- **提醒合并**：短时间内的多次提醒合并为一次

### 提醒内容

- **鼓励语库**：内置 30+ 条原创中文鼓励语，随机抽取
- **名言警句**：内置 20+ 条关于专注/坚持的名人名言
- 每次弹窗展示一条，交替使用
- 内容存储在本地 JSON 文件中，方便后续扩展

### 番茄钟模式

- 默认 25 分钟工作 + 5 分钟休息
- 工作时长和休息时长可在设置中调整
- 工作结束时弹出休息提醒
- 休息结束时弹出继续工作提醒
- 番茄钟完成后计数 +1（计入每日统计）

### 专注统计

- 数据以本地 JSON 文件存储
- 记录每条专注会话：开始时间、结束时间、时长、类型（普通/番茄钟）
- 仪表盘展示当日/本周汇总
- 数据保留最近 30 天，自动清理旧数据

## 数据模型

```typescript
interface FocusSession {
  id: string;
  startTime: string;  // ISO 8601
  endTime: string;    // ISO 8601
  duration: number;   // 分钟
  type: 'normal' | 'pomodoro';
}

interface DailyStats {
  date: string;       // YYYY-MM-DD
  totalMinutes: number;
  sessions: FocusSession[];
  pomodoroCompleted: number;
}

interface AppSettings {
  reminderInterval: number;       // 分钟，默认 30
  workDuration: number;           // 分钟，默认 25
  breakDuration: number;          // 分钟，默认 5
  quietStartHour: number;         // 静音时段起始，默认 null
  quietEndHour: number;           // 静音时段结束，默认 null
  activityTimeout: number;        // 活跃判定超时（秒）
}
```

## 后台进程

- **系统托盘**：常驻菜单栏（macOS），提供快速入口
- **定时器服务**：使用 `setInterval` 管理提醒和番茄钟计时
- **活跃检测**：通过 `globalShortcut` / `powerMonitor` 监听系统活动状态
- 应用关闭时仅隐藏窗口，后台进程持续运行（托盘常驻）

## 文件结构

```
focus_reminder/
├── package.json
├── electron.vite.config.ts
├── src/
│   ├── main/              # Electron 主进程
│   │   ├── index.ts       # 应用入口
│   │   ├── tray.ts        # 系统托盘管理
│   │   ├── timer.ts       # 定时器服务
│   │   ├── activity.ts    # 活跃检测
│   │   └── store.ts       # 数据存储
│   ├── renderer/          # React 渲染进程
│   │   ├── index.html
│   │   ├── main.tsx       # React 入口
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ReminderPopup.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/
│   │   │   └── useStats.ts
│   │   └── assets/
│   │       └── quotes.json # 鼓励语/名言数据
│   └── preload/           # 预加载脚本
│       └── index.ts
├── resources/             # 应用图标等资源
└── dev-app-update.yml     # 自动更新配置（后续）
```
