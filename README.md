<div align="center">

# ⚡ FlashRSS

### Modern, Fast, and Open Source RSS Aggregator

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

**Linux • Windows • macOS**

[Features](#-features) • [Quick Start](#-quick-start) • [Usage](#-usage) • [Contributing](#-contributing)

</div>

---

FlashRSS is a modern RSS aggregator designed for speed and simplicity. It provides a beautiful interface to manage your daily news and stays in sync across your devices.

## ✨ Features

- 📰 **RSS Management** - Add, organize, and delete feeds with ease.
- 📁 **Categories** - Group your sources by topic.
- 🌙 **Dark Mode** - Full modern dark theme support.
- ⭐ **Starred Articles** - Save your favorite stories for later.
- 🔄 **Auto-Update** - Background synchronization every 15 minutes.
- 🚀 **CLI Access** - Launch with a simple `flashRSS start` command.
- 📱 **Responsive** - Perfect experience on mobile and desktop.
- 🐳 **Docker Ready** - One-click deployment with Docker Compose.

## 🚀 Quick Start

### One-Command Installation

**Windows (PowerShell)**:
```powershell
iwr -useb https://raw.githubusercontent.com/blackflash100/flashRSS/main/install.ps1 | iex
```

**Linux / macOS (Bash)**:
```bash
curl -sSL https://raw.githubusercontent.com/blackflash100/flashRSS/main/install.sh | bash
```

### Starting the App
Once installed, you can start FlashRSS from any terminal:
```bash
flashRSS start
```

### Docker
```bash
docker-compose up -d
```

## 📖 Usage

- **Add Feed**: Click "Add Feed" in the sidebar and paste any valid RSS URL.
- **Starring**: Hover over an article and click the star icon to save it.
- **Reading**: Click titles to open the full article. Use the checkmark to mark as read.
- **Management**: Delete feeds directly from the sidebar by clicking the trash icon.

## 🛠️ Manual Setup

1. **Install dependencies**: `npm install && cd client && npm install`
2. **Build**: `npm run build`
3. **Run**: `npm start`

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a pull request.

## 📝 License
MIT License. See [LICENSE](LICENSE) for details.

---
⭐ Give us a star if you find FlashRSS useful!
