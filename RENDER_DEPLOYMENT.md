# 🚀 Déploiement sur Render - Guide Complet

Ce guide vous accompagne étape par étape pour déployer votre application News Chronicle Online sur Render.

## 📋 Prérequis

- ✅ Compte Render (gratuit)
- ✅ Repository GitHub avec votre code
- ✅ Base de données MySQL/PostgreSQL (externe ou Render)

## 🔧 Étape 1 : Configuration du Backend

### 1.1 Créer le service backend

1. Connectez-vous à [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"Web Service"**
3. Connectez votre repository GitHub
4. Configurez le service :

```
Name: news-chronicle-backend
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

### 1.2 Variables d'environnement backend

Dans les paramètres du service, ajoutez ces variables :

```env
NODE_ENV=production
PORT=10000
DB_HOST=votre-host-db
DB_USER=votre-user-db
DB_PASSWORD=votre-password-db
DB_NAME=news_chronicle
JWT_SECRET=votre-secret-jwt-super-securise
```

### 1.3 Base de données

#### Option A : Base de données externe
- Utilisez une base de données MySQL/PostgreSQL externe
- Configurez les variables DB_* avec vos informations

#### Option B : Base de données Render
1. Créez un service **PostgreSQL** sur Render
2. Utilisez les variables d'environnement fournies par Render
3. Connectez le service backend à la base de données

### 1.4 Déploiement initial

1. Cliquez sur **"Create Web Service"**
2. Attendez que le build se termine
3. Notez l'URL du service (ex: `https://news-chronicle-backend.onrender.com`)

## 🎨 Étape 2 : Configuration du Frontend

### 2.1 Créer le service frontend

1. **"New +"** → **"Static Site"**
2. Connectez le même repository
3. Configurez le service :

```
Name: news-chronicle-frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### 2.2 Variables d'environnement frontend

```env
VITE_API_URL=https://votre-backend-url.onrender.com/api
VITE_DEV_MODE=false
```

### 2.3 Déploiement frontend

1. Cliquez sur **"Create Static Site"**
2. Attendez la fin du build
3. Votre site sera accessible à l'URL fournie

## 🔍 Étape 3 : Vérification et Test

### 3.1 Test du backend

```bash
# Test de santé
curl https://votre-backend.onrender.com/api/health

# Test des articles
curl https://votre-backend.onrender.com/api/articles
```

### 3.2 Test du frontend

1. Ouvrez l'URL de votre frontend
2. Vérifiez que la page se charge
3. Testez la navigation
4. Vérifiez les appels API

### 3.3 Diagnostic automatique

En mode développement, le composant `DiagnosticPanel` s'affiche automatiquement pour vérifier :
- ✅ Configuration
- ✅ Connectivité API
- ✅ Données disponibles
- ✅ Environnement

## 🐛 Résolution des Problèmes Courants

### Page Blanche

#### Vérifications immédiates :

1. **Console du navigateur (F12)**
   ```javascript
   // Vérifiez les erreurs JavaScript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   console.log('Environment:', import.meta.env.MODE);
   ```

2. **Logs Render**
   - Allez dans les logs du service frontend
   - Vérifiez les erreurs de build
   - Vérifiez les erreurs runtime

3. **Configuration API**
   - Vérifiez que `VITE_API_URL` pointe vers le bon backend
   - Testez l'URL de l'API directement

#### Solutions rapides :

##### A. Erreur de build
```bash
# Test local
npm run build
npm run type-check
```

##### B. Erreur de configuration
- Vérifiez les variables d'environnement sur Render
- Assurez-vous que l'URL du backend est correcte

##### C. Erreur de routing
- Vérifiez le fichier `_redirects`
- Testez les routes directement

### Erreurs de Connexion API

#### A. CORS
Ajoutez dans `backend/server.js` :
```javascript
app.use(cors({
  origin: ['https://votre-frontend.onrender.com'],
  credentials: true
}));
```

#### B. Base de données
- Vérifiez les variables DB_*
- Testez la connexion à la base de données
- Vérifiez que les tables existent

### Performance

#### A. Optimisation du build
Le fichier `vite.config.ts` est déjà optimisé avec :
- Code splitting
- Minification
- Tree shaking

#### B. Cache
- Les assets statiques sont automatiquement mis en cache
- Utilisez les headers de cache appropriés

## 📊 Monitoring et Maintenance

### 1. Logs Render
- Accédez aux logs via le dashboard
- Surveillez les erreurs en temps réel
- Configurez des alertes

### 2. Métriques
- Temps de réponse
- Taux d'erreur
- Utilisation des ressources

### 3. Mise à jour
- Les push sur GitHub déclenchent automatiquement le déploiement
- Utilisez "Manual Deploy" pour forcer un déploiement
- "Rollback" pour revenir à une version précédente

## 🔄 Workflow de Déploiement

### 1. Développement local
```bash
# Backend
cd backend
npm start

# Frontend
npm run dev
```

### 2. Test local
```bash
# Build de test
npm run build:prod
npm run preview
```

### 3. Déploiement
```bash
# Push sur GitHub
git add .
git commit -m "Update for production"
git push origin main
```

### 4. Vérification
- Vérifiez les logs Render
- Testez l'application déployée
- Vérifiez les métriques

## 🛠️ Commandes Utiles

### Local
```bash
# Test complet
npm run test:build

# Diagnostic
npm run type-check

# Build production
npm run build:prod
```

### Render
```bash
# Vérifier les variables d'environnement
echo $VITE_API_URL

# Tester l'API
curl https://votre-backend.onrender.com/api/health
```

## 📞 Support

En cas de problème :

1. **Vérifiez les logs Render** en premier
2. **Testez localement** pour isoler le problème
3. **Consultez la documentation** Render
4. **Contactez le support** Render si nécessaire

## 🎯 Checklist de Déploiement

- [ ] Backend déployé et accessible
- [ ] Base de données configurée
- [ ] Variables d'environnement définies
- [ ] Frontend déployé
- [ ] API URL configurée
- [ ] CORS configuré
- [ ] Tests fonctionnels
- [ ] Monitoring configuré

---

**🎉 Félicitations !** Votre application est maintenant déployée sur Render ! 