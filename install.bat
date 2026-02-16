@echo off
echo ========================================
echo    FluxRSS Kurulum Scripti (Windows)
echo ========================================
echo.

echo [1/3] Backend bagimliliklari yukleniyor...
call npm install
if errorlevel 1 (
    echo HATA: Backend bagimliliklari yuklenemedi!
    pause
    exit /b 1
)
echo Backend bagimliliklari yuklendi.
echo.

echo [2/3] Frontend bagimliliklari yukleniyor...
cd client
call npm install
if errorlevel 1 (
    echo HATA: Frontend bagimliliklari yuklenemedi!
    pause
    exit /b 1
)
echo Frontend bagimliliklari yuklendi.
echo.

echo [3/3] Frontend derleniyor...
call npm run build
if errorlevel 1 (
    echo HATA: Frontend derlenemedi!
    pause
    exit /b 1
)
echo Frontend derlendi.
cd ..

echo.
echo ========================================
echo    Kurulum basariyla tamamlandi!
echo ========================================
echo.
echo Uygulamayi baslatmak icin:
echo   npm start
echo.
echo Tarayicinizda acin:
echo   http://localhost:3000
echo.
pause
