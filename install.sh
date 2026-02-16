#!/bin/bash
# FlashRSS One-Command Installer for Linux/macOS

clear
echo -e "\033[0;36m"
echo "  ______ _               _       _____   _____ _____ "
echo " |  ____| |             | |     |  __ \ / ____/ ____|"
echo " | |__  | | __ _ ___  __| |__   | |__) | (___| (___  "
echo " |  __| | |/ _` / __|/ _` '_ \  |  _  / \___ \\___ \ "
echo " | |    | | (_| \__ \ (_| | | | | | \ \ ____) |___) |"
echo " |_|    |_|\__,_|___/\__,_| |_| |_|  \_\_____/_____/ "
echo -e "\033[0m"

echo "Welcome to FlashRSS! This script will set up everything you need."
read -p "Do you want to proceed with the installation? (y/n): " confirm
if [[ $confirm != "y" ]]; then
    echo "Installation cancelled."
    exit 1
fi

# --- SMART INSTALLATION LOGIC ---
if [ ! -f "package.json" ]; then
    INSTALL_DIR="$HOME/flashRSS"
    echo -e "\n\033[0;34m📂 Installation Path: $INSTALL_DIR\033[0m"
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"

    # Clone via Git if available, otherwise download ZIP
    if command -v git &> /dev/null; then
        echo -e "⬇️  Cloning repository..."
        git clone https://github.com/blackflash100/flashRSS.git . 2>/dev/null || echo "Folder not empty, pulling updates..." && git pull
    else
        echo -e "⬇️  Downloading ZIP..."
        curl -L https://github.com/blackflash100/flashRSS/archive/refs/heads/main.zip -o repo.zip
        unzip -o repo.zip
        mv flashRSS-main/* .
        rm -rf flashRSS-main repo.zip
    fi
fi
# ------------------------------

echo -e "\n\033[0;33m🔍 Checking requirements...\033[0m"

if ! command -v node &> /dev/null; then
    echo -e "\033[0;31m❌ Node.js is not installed.\033[0m"
    echo "Please install Node.js from https://nodejs.org/ and try again."
    exit 1
fi

echo -e "\033[0;32m✅ Starting installation...\033[0m"

echo -e "\n\033[0;33m📦 Installing Backend Dependencies...\033[0m"
npm install

echo -e "\n\033[0;33m📦 Installing Frontend Dependencies...\033[0m"
cd client && npm install

echo -e "\n\033[0;33m🏗️ Building Frontend...\033[0m"
npm run build
cd ..

echo -e "\n\033[0;33m🔗 Linking global command...\033[0m"
sudo npm link --force || npm link --force

echo -e "\n\033[0;32m✅ INSTALLATION COMPLETE!\033[0m"
echo -e "\033[0;36m🚀 You can now start the app anytime by typing: flashRSS start\033[0m"

read -p "Do you want to start the app now? (y/n): " startNow
if [[ $startNow == "y" ]]; then
    flashRSS start
fi
