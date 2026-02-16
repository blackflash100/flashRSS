#!/bin/bash

# FlashRSS One-Command Installer for Linux/macOS
# Usage: curl -sSL https://raw.githubusercontent.com/blackflash100/flashRSS/main/install.sh | bash

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

echo -e "\n\033[0;33m🔍 Checking requirements...\033[0m"

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "\033[0;31m❌ Node.js is not installed.\033[0m"
    read -p "Would you like to try installing Node.js? (y/n): " installNode
    if [[ $installNode == "y" ]]; then
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            echo "📦 Installing Node.js via apt..."
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            if command -v brew &> /dev/null; then
                echo "📦 Installing Node.js via Homebrew..."
                brew install node
            else
                echo -e "\033[0;31m❌ Homebrew not found. Please install Node.js from https://nodejs.org/\033[0m"
                exit 1
            fi
        else
            echo -e "\033[0;31m❌ Unsupported OS for automatic Node.js install. Please install it manually.\033[0m"
            exit 1
        fi
    else
        exit 1
    fi
fi

echo -e "\033[0;32m✅ Requirements met. Starting installation...\033[0m"

echo -e "\n\033[0;33m📦 Installing Backend Dependencies...\033[0m"
npm install

echo -e "\n\033[0;33m📦 Installing Frontend Dependencies...\033[0m"
cd client && npm install

echo -e "\n\033[0;33m🏗️ Building Frontend...\033[0m"
npm run build

cd ..

echo -e "\n\033[0;33m🔗 Linking global command...\033[0m"
sudo npm link --force || npm link --force

echo -e "\n\033[0;32m✅ Installation Complete!\033[0m"
echo -e "\033[0;36m🚀 You can now start the app anytime by typing: flashRSS start\033[0m"
echo "Starting it for you now..."

node server.js
