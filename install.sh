#!/bin/bash
# FlashRSS Akıllı Yükleyici (Linux/macOS)

clear
echo -e "\033[0;36m"
echo "  ______ _               _       _____   _____ _____ "
echo " |  ____| |             | |     |  __ \ / ____/ ____|"
echo " | |__  | | __ _ ___  __| |__   | |__) | (___| (___  "
echo " |  __| | |/ _` / __|/ _` '_ \  |  _  / \___ \\___ \ "
echo " | |    | | (_| \__ \ (_| | | | | | \ \ ____) |___) |"
echo " |_|    |_|\__,_|___/\__,_| |_| |_|  \_\_____/_____/ "
echo -e "\033[0m"

echo "FlashRSS Kurulumuna Hos Geldiniz!"
read -p "Devam etmek istiyor musunuz? (y/n): " confirm
if [[ $confirm != "y" ]]; then
    echo "İptal edildi."
    exit 1
fi

# --- AKILLI KONUM BELİRLEME ---
if [ ! -f "package.json" ]; then
    INSTALL_DIR="$HOME/flashRSS"
    echo -e "\n\033[0;34m📂 Hedef Klasör: $INSTALL_DIR\033[0m"
    mkdir -p "$INSTALL_DIR"
    cd "$INSTALL_DIR"

    # Git varsa git ile çek, yoksa curl ile indir
    if command -v git &> /dev/null; then
        echo -e "⬇️  Git ile klonlanıyor..."
        # Mevcut klasör boş değilse hata vermesin diye . koyduk
        git clone https://github.com/blackflash100/flashRSS.git . 2>/dev/null || echo "Klasör zaten dolu, güncelleniyor..." && git pull
    else
        echo -e "⬇️  ZIP olarak indiriliyor..."
        curl -L https://github.com/blackflash100/flashRSS/archive/refs/heads/main.zip -o repo.zip
        unzip -o repo.zip
        mv flashRSS-main/* .
        rm -rf flashRSS-main repo.zip
    fi
fi
# ------------------------------

echo -e "\n\033[0;33m🔍 Gereksinimler kontrol ediliyor...\033[0m"

if ! command -v node &> /dev/null; then
    echo -e "\033[0;31m❌ Node.js yüklü değil.\033[0m"
    echo "Lütfen Node.js yükleyip tekrar deneyin."
    exit 1
fi

echo -e "\033[0;32m✅ Başlıyoruz...\033[0m"

echo -e "\n\033[0;33m📦 Backend Kurulumu...\033[0m"
npm install

echo -e "\n\033[0;33m📦 Frontend Kurulumu...\033[0m"
cd client && npm install

echo -e "\n\033[0;33m🏗️ Frontend Derleniyor (Build)...\033[0m"
npm run build
cd ..

echo -e "\n\033[0;33m🔗 Global Komut Ayarlanıyor...\033[0m"
# Sudo gerekebilir, hatayı yutmayalım
sudo npm link --force || npm link --force

echo -e "\n\033[0;32m✅ KURULUM BAŞARILI!\033[0m"
echo -e "\033[0;36m🚀 Başlatmak için terminale şunu yazın: flashRSS start\033[0m"

read -p "Şimdi başlatmak ister misiniz? (y/n): " startNow
if [[ $startNow == "y" ]]; then
    flashRSS start
fi
