#!/bin/bash

# Script de build pour Render
echo "🚀 Début du build pour Render..."

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm ci --only=production

# Vérification de TypeScript
echo "🔍 Vérification TypeScript..."
npm run type-check

# Build de production
echo "🏗️ Build de production..."
npm run build:prod

# Vérification du build
if [ -d "dist" ]; then
    echo "✅ Build réussi !"
    echo "📁 Contenu du dossier dist:"
    ls -la dist/
else
    echo "❌ Échec du build - dossier dist non trouvé"
    exit 1
fi

echo "🎉 Build terminé avec succès !" 