# Guide de Déploiement sur Render

Ce guide vous explique comment déployer votre application News Chronicle Online sur Render.

## 🚀 Déploiement Frontend (React/Vite)

### 1. Préparation du Repository

Assurez-vous que votre repository contient :
- ✅ `package.json` avec les scripts de build
- ✅ `vite.config.ts` configuré pour la production
- ✅ `_redirects` pour le routing SPA
- ✅ Variables d'environnement configurées

### 2. Configuration sur Render

#### A. Créer un nouveau service
1. Connectez-vous à [Render](https://render.com)
2. Cliquez sur "New +" → "Static Site"
3. Connectez votre repository GitHub

#### B. Configuration du service
```
Name: news-chronicle-frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

#### C. Variables d'environnement
```
VITE_API_URL=https://votre-backend-url.onrender.com/api
VITE_DEV_MODE=false
```

### 3. Configuration du Backend

#### A. Créer un service backend
1. "New +" → "Web Service"
2. Connectez le même repository
3. Configuration :
```
Name: news-chronicle-backend
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

#### B. Variables d'environnement backend
```
NODE_ENV=production
PORT=10000
DB_HOST=votre-host-db
DB_USER=votre-user-db
DB_PASSWORD=votre-password-db
DB_NAME=news_chronicle
JWT_SECRET=votre-secret-jwt
```

## 🔧 Configuration Avancée

### 1. Base de Données

#### Option A : Base de données externe
- Utilisez une base de données PostgreSQL ou MySQL externe
- Configurez les variables d'environnement DB_*

#### Option B : Base de données Render
- Créez un service PostgreSQL sur Render
- Utilisez les variables d'environnement fournies

### 2. Domaine personnalisé
1. Dans les paramètres du service
2. "Custom Domains" → "Add Domain"
3. Configurez vos DNS

### 3. SSL/HTTPS
- Automatiquement géré par Render
- Certificats Let's Encrypt gratuits

## 🐛 Résolution des Problèmes

### Page Blanche

#### Vérifications à faire :
1. **Console du navigateur** (F12)
   - Erreurs JavaScript
   - Erreurs de réseau
   - Erreurs de configuration

2. **Logs Render**
   - Build logs
   - Runtime logs
   - Erreurs de déploiement

3. **Configuration API**
   - URL du backend correcte
   - Variables d'environnement définies
   - CORS configuré

#### Solutions courantes :

##### A. Erreur de build
```bash
# Vérifier localement
npm run build
npm run type-check
```

##### B. Erreur de configuration
```javascript
// Vérifier dans la console
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('Environment:', import.meta.env.MODE);
```

##### C. Erreur de routing
- Vérifier le fichier `_redirects`
- Tester les routes directement

### Erreurs de Connexion API

#### A. CORS
Ajouter dans le backend :
```javascript
app.use(cors({
  origin: ['https://votre-frontend.onrender.com'],
  credentials: true
}));
```

#### B. Variables d'environnement
Vérifier que `VITE_API_URL` pointe vers le bon backend.

### Performance

#### A. Optimisation du build
```javascript
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
        router: ['react-router-dom'],
      },
    },
  },
}
```

#### B. Cache
- Utiliser les headers de cache appropriés
- Optimiser les images et assets

## 📊 Monitoring

### 1. Logs Render
- Accédez aux logs via le dashboard Render
- Surveillez les erreurs en temps réel

### 2. Métriques
- Temps de réponse
- Taux d'erreur
- Utilisation des ressources

### 3. Alertes
- Configurez des alertes pour les erreurs
- Surveillez la disponibilité

## 🔄 Mise à Jour

### 1. Déploiement automatique
- Connectez votre repository GitHub
- Les push déclenchent automatiquement le déploiement

### 2. Déploiement manuel
- Via le dashboard Render
- "Manual Deploy" → "Deploy latest commit"

### 3. Rollback
- "Deployments" → Sélectionner une version précédente
- "Promote to Live"

## 🛠️ Commandes Utiles

### Local
```bash
# Test du build
npm run build:prod

# Vérification TypeScript
npm run type-check

# Preview locale
npm run preview
```

### Debug
```bash
# Vérifier les variables d'environnement
echo $VITE_API_URL

# Tester l'API
curl https://votre-backend.onrender.com/api/health
```

## 📞 Support

En cas de problème :
1. Vérifiez les logs Render
2. Testez localement
3. Consultez la documentation Render
4. Contactez le support Render si nécessaire 