#!/bin/bash

echo "🚀 Démarrage du backend News Chronicle Online..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé. Copie du fichier d'exemple..."
    cp config.env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer avec vos paramètres de base de données."
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Démarrer le serveur
echo "🌟 Démarrage du serveur..."
npm run dev 