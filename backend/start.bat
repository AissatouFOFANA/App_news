@echo off
echo 🚀 Démarrage du backend News Chronicle Online...

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Vérifier si npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé. Veuillez l'installer d'abord.
    pause
    exit /b 1
)

REM Vérifier si le fichier .env existe
if not exist .env (
    echo ⚠️  Fichier .env non trouvé. Copie du fichier d'exemple...
    copy config.env.example .env
    echo ✅ Fichier .env créé. Veuillez le configurer avec vos paramètres de base de données.
)

REM Installer les dépendances si nécessaire
if not exist node_modules (
    echo 📦 Installation des dépendances...
    npm install
)

REM Démarrer le serveur
echo 🌟 Démarrage du serveur...
npm run dev

pause 