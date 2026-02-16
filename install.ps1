# FlashRSS Akıllı Yükleyici (Windows)
# Usage: powershell -ExecutionPolicy ByPass -File install.ps1

Clear-Host
Write-Host @"
  ______ _               _       _____   _____ _____ 
 |  ____| |             | |     |  __ \ / ____/ ____|
 | |__  | | __ _ ___  __| |__   | |__) | (___| (___  
 |  __| | |/ _` / __|/ _` '_ \  |  _  / \___ \\___ \\ 
 | |    | | (_| \__ \ (_| | | | | | \ \ ____) |___) |
 |_|    |_|\__,_|___/\__,_| |_| |_|  \_\_____/_____/ 
"@ -ForegroundColor Cyan

Write-Host ""
Write-Host "FlashRSS Kurulumuna Hos Geldiniz!" -ForegroundColor White
$confirm = Read-Host "Kuruluma baslamak istiyor musunuz? (e/h)"
if ($confirm -ne 'e' -and $confirm -ne 'y') {
    Write-Host "İptal edildi." -ForegroundColor Red
    exit
}

# --- AKILLI KONUM BELİRLEME ---
# Eğer scriptin çalıştığı yerde package.json yoksa, bu bir uzaktan kurulumdur.
if (-not (Test-Path "package.json")) {
    $InstallPath = "$HOME\flashRSS"
    Write-Host "`n📂 Kurulum Yeri: $InstallPath" -ForegroundColor Cyan
    
    if (-not (Test-Path $InstallPath)) {
        New-Item -ItemType Directory -Force -Path $InstallPath | Out-Null
    }
    Set-Location $InstallPath

    # Dosyaları İndir
    if (-not (Test-Path "package.json")) {
        Write-Host "⬇️  GitHub'dan son sürüm indiriliyor..." -ForegroundColor Yellow
        $zipFile = "$InstallPath\repo.zip"
        try {
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri "https://github.com/blackflash100/flashRSS/archive/refs/heads/main.zip" -OutFile $zipFile
            
            Write-Host "📦 Dosyalar çıkartılıyor..." -ForegroundColor Yellow
            Expand-Archive -Path $zipFile -DestinationPath $InstallPath -Force
            
            # Zip içinden çıkan klasördeki dosyaları ana dizine taşı
            $subFolder = Get-ChildItem -Path $InstallPath -Directory | Where-Object { $_.Name -like "flashRSS-*" } | Select-Object -First 1
            if ($subFolder) {
                Get-ChildItem -Path $subFolder.FullName | Move-Item -Destination $InstallPath -Force
                Remove-Item $subFolder.FullName -Recurse -Force
            }
            Remove-Item $zipFile
        }
        catch {
            Write-Host "❌ İndirme hatası: $_" -ForegroundColor Red
            exit
        }
    }
}
# ------------------------------

Write-Host "`n🔍 Gereksinimler kontrol ediliyor..." -ForegroundColor Yellow

# Node.js Kontrolü
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js bulunamadi." -ForegroundColor Red
    Write-Host "Lütfen https://nodejs.org adresinden Node.js yükleyip tekrar deneyin."
    exit
}

Write-Host "✅ Gereksinimler tamam. Kurulum başliyor..." -ForegroundColor Green

Write-Host "`n📦 Backend paketleri yükleniyor..." -ForegroundColor Yellow
npm install

Write-Host "`n📦 Frontend paketleri yükleniyor..." -ForegroundColor Yellow
if (Test-Path "client") {
    Set-Location client
    npm install
    
    Write-Host "`n🏗️ Frontend inşa ediliyor (Build)..." -ForegroundColor Yellow
    npm run build
    Set-Location ..
}

Write-Host "`n🔗 Global komut oluşturuluyor..." -ForegroundColor Yellow
npm link --force

Write-Host "`n✅ KURULUM BAŞARILI!" -ForegroundColor Green
Write-Host "🚀 Uygulamayi başlatmak için şu komutu yazın: flashRSS start" -ForegroundColor Cyan

# Hemen başlatma seçeneği
$startNow = Read-Host "Uygulamayı şimdi başlatmak ister misiniz? (e/h)"
if ($startNow -eq 'e' -or $startNow -eq 'y') {
    flashRSS start
}
