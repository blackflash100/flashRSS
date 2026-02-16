# FlashRSS One-Command Installer for Windows
# Usage: powershell -ExecutionPolicy ByPass -File install.ps1

Clear-Host
Write-Host @"
  ______ _               _       _____   _____ _____ 
 |  ____| |             | |     |  __ \ / ____/ ____|
 | |__  | | __ _ ___  __| |__   | |__) | (___| (___  
 |  __| | |/ _` / __|/ _` '_ \  |  _  / \___ \\___ \ 
 | |    | | (_| \__ \ (_| | | | | | \ \ ____) |___) |
 |_|    |_|\__,_|___/\__,_| |_| |_|  \_\_____/_____/ 
"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "Welcome to FlashRSS! This script will set up everything you need." -ForegroundColor White
$confirm = Read-Host "Do you want to proceed with the installation? (y/n)"
if ($confirm -ne 'y') {
    Write-Host "Installation cancelled." -ForegroundColor Red
    exit
}

Write-Host "`n🔍 Checking requirements..." -ForegroundColor Yellow

# 1. Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    $installNode = Read-Host "Would you like to try installing Node.js via WinGet? (y/n)"
    if ($installNode -eq 'y') {
        if (Get-Command winget -ErrorAction SilentlyContinue) {
            Write-Host "📦 Installing Node.js via WinGet..." -ForegroundColor Yellow
            winget install OpenJS.NodeJS.LTS
            Write-Host "✅ Node.js installed. Please restart this script in a new terminal." -ForegroundColor Green
            exit
        } else {
            Write-Host "❌ WinGet not found. Please download Node.js from https://nodejs.org/" -ForegroundColor Red
            exit
        }
    } else {
        exit
    }
}

# 2. Check for Git (if needed for clone, but usually we are already in the folder)
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "⚠️  Git is not installed. You might need it to update FlashRSS later." -ForegroundColor Yellow
}

Write-Host "✅ Requirements met. Starting installation..." -ForegroundColor Green

Write-Host "`n📦 Installing Backend Dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location client
npm install

Write-Host "`n🏗️ Building Frontend..." -ForegroundColor Yellow
npm run build

Set-Location ..

Write-Host "`n🔗 Linking global command..." -ForegroundColor Yellow
npm link --force

Write-Host "`n✅ Installation Complete!" -ForegroundColor Green
Write-Host "🚀 You can now start the app anytime by typing: flashRSS start" -ForegroundColor Cyan
Write-Host "Starting it for you now..." -ForegroundColor White

node server.js
