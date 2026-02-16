# FlashRSS - Project Summary

## 📋 Overview
**FlashRSS** is a modern, fast, and open-source RSS aggregator. It features a sleek web interface, supports multiple platforms (Linux, Windows, macOS), and provides easy deployment options via Docker or one-command installers.

## 🏗️ Architecture
- **Backend**: Node.js, Express.js (REST API), SQLite.
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Database**: SQLite3 with auto-initialization.

## 📁 Project Structure
```
flashrss/
├── server.js              # Express backend server
├── cli.js                 # Command Line Interface (flashRSS start)
├── package.json           # Backend & CLI configuration
├── rss.db                 # SQLite database
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx       # Layout & State orchestration
│   │   ├── api.js        # API communication layer
│   │   └── components/   # Sidebar & ArticleList
└── install.ps1/sh         # Platform-specific installers
```

## �️ Database Schema
- **categories**: Groups for feeds.
- **feeds**: RSS feed sources (URL, Title, Category).
- **items**: Articles (Title, Link, Date, Snippet, Read Status, Starred Status).

## 🌐 API Endpoints
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `GET /api/feeds` - List feeds
- `DELETE /api/feeds/:id` - Delete feed & items
- `GET /api/items` - List articles (params: category_id, feed_id, starred, read_status)
- `POST /api/items/:id/read` - Mark read
- `POST /api/items/:id/star` - Toggle favorite

## 🎨 Core Features
- **Dark Mode**: Complete theme synchronization.
- **Favorites**: Star articles for later reading.
- **Auto-Sync**: Background feed updates every 15 minutes.
- **CLI Tool**: Start the app globally with `flashRSS start`.
- **Responsive**: Mobile-first design.

## � Deployment
- **Windows**: `iwr -useb ... | iex`
- **Linux/macOS**: `curl -sSL ... | bash`
- **Docker**: `docker-compose up -d`

---
**Version**: 1.0.0
**Status**: Stable
