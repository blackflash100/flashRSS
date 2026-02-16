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

# --- SMART INSTALLATION LOGIC ---
# If package.json is missing, assume remote install and download repo to User Home
if (-not (Test-Path "package.json")) {
    $InstallPath = "$HOME\flashRSS"
    Write-Host "`n📂 Installation Path: $InstallPath" -ForegroundColor Cyan
    
    if (-not (Test-Path $InstallPath)) {
        New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
    }
    Set-Location $InstallPath

    # Download Repository
    if (-not (Test-Path "package.json")) {
        Write-Host "⬇️  Downloading latest version from GitHub..." -ForegroundColor Yellow
        $zipFile = "$InstallPath\repo.zip"
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri "https://github.com/blackflash100/flashRSS/archive/refs/heads/main.zip" -OutFile $zipFile
            
            Write-Host "📦 Extracting files..." -ForegroundColor Yellow
            Expand-Archive -Path $zipFile -DestinationPath $InstallPath -Force
            
            # Move files from subfolder to root
            $subFolder = Get-ChildItem -Path $InstallPath -Directory | Where-Object { $_.Name -like "flashRSS-*" } | Select-Object -First 1
            if ($subFolder) {
                Get-ChildItem -Path $subFolder.FullName | Move-Item -Destination $InstallPath -Force
                Remove-Item $subFolder.FullName -Recurse -Force
            }
            Remove-Item $zipFile
        }
        catch {
            Write-Host "❌ Download failed: $_" -ForegroundColor Red
            exit
        }
    }
}
# ------------------------------

Write-Host "`n🔍 Checking requirements..." -ForegroundColor Yellow

# Check for Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/ and try again."
    exit
}

Write-Host "✅ Requirements met. Starting installation..." -ForegroundColor Green

Write-Host "`n📦 Installing Backend Dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n📦 Installing Frontend Dependencies..." -ForegroundColor Yellow
if (Test-Path "client") {
    Set-Location client
    npm install
    
    Write-Host "`n🏗️ Building Frontend..." -ForegroundColor Yellow
    npm run build
    Set-Location ..
}

Write-Host "`n🔗 Linking global command..." -ForegroundColor Yellow
npm link --force

Write-Host "`n✅ INSTALLATION COMPLETE!" -ForegroundColor Green
Write-Host "🚀 You can now start the app anytime by typing: flashRSS start" -ForegroundColor Cyan

# Start immediately option
$startNow = Read-Host "Do you want to start the app now? (y/n)"
if ($startNow -eq 'y') {
    flashRSS start
}
