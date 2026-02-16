#!/bin/bash
# FlashRSS Global Installer (Linux/macOS)

clear
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

# Logo using Heredoc for maximum compatibility
echo -e "${CYAN}"
cat << 'EOF'
  ______ _               _       _____   _____ _____ 
 |  ____| |             | |     |  __ \ / ____/ ____|
 | |__  | | __ _ ___  __| |__   | |__) | (___| (___  
 |  __| | |/ _` / __|/ _` '_ \  |  _  / \___ \\___ \ 
 | |    | | (_| \__ \ (_| | | | | | \ \ ____) |___) |
 |_|    |_|\__,_|___/\__,_| |_| |_|  \_\_____/_____/ 
EOF
echo -e "${NC}"

echo "Welcome to FlashRSS! This script will set up everything you need."

# Force reading from TTY to support 'curl | bash' style execution
echo -n "Do you want to proceed with the installation? (y/n): "
read -r confirm < /dev/tty

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo -e "${RED}Installation cancelled.${NC}"
    exit 1
fi

# Smart Path Discovery
INSTALL_DIR="$HOME/flashRSS"

if [ ! -f "package.json" ]; then
    echo -e "\n${CYAN}📂 Target Path: $INSTALL_DIR${NC}"
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR" || exit

    if command -v git &> /dev/null; then
        echo -e "⬇️  Cloning from GitHub..."
        git clone https://github.com/blackflash100/flashRSS.git . 2>/dev/null || git pull
    else
        echo -e "⬇️  Downloading source ZIP..."
        curl -L https://github.com/blackflash100/flashRSS/archive/refs/heads/main.zip -o repo.zip
        unzip -o repo.zip && mv flashRSS-main/* . && rm -rf flashRSS-main repo.zip
    fi
fi

echo -e "\n${YELLOW}🔍 Checking requirements...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Starting installation...${NC}"

# Dependencies and Build
echo -e "${YELLOW}📦 Installing Backend Dependencies...${NC}"
npm install

if [ -d "client" ]; then
    echo -e "${YELLOW}📦 Installing Frontend Dependencies...${NC}"
    cd client && npm install && npm run build && cd ..
fi

# Link global command
echo -e "\n${YELLOW}🔗 Linking global command...${NC}"
sudo npm link --force || npm link --force

echo -e "\n${GREEN}✅ INSTALLATION COMPLETE!${NC}"
echo -e "${CYAN}🚀 Start FlashRSS anytime by typing: flashRSS start${NC}"
