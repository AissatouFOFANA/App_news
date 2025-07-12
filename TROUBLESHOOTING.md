# Guide de Dépannage - News Chronicle Online

Ce guide vous aide à résoudre les problèmes courants rencontrés avec l'application.

## Problèmes de Chargement de Pages

### 1. Page ArticleDetailPage ne charge pas

**Symptômes :**
- Page blanche ou erreur de chargement
- Message "Article non trouvé" même pour des articles valides
- Erreurs dans la console du navigateur

**Solutions :**

#### A. Vérifier que le backend est démarré
```bash
cd backend
npm start
```

Le backend doit être accessible sur `http://localhost:3000`

#### B. Vérifier la configuration de l'API
Créez un fichier `.env` à la racine du projet frontend :
```env
VITE_API_URL=http://localhost:3000/api
VITE_DEV_MODE=true
```

#### C. Vérifier la base de données
Assurez-vous que la base de données est configurée et contient des données :
```bash
cd backend
npm run seed
```

#### D. Vérifier les logs du backend
Regardez les logs du serveur backend pour identifier les erreurs :
- Erreurs de connexion à la base de données
- Erreurs de validation des données
- Erreurs de routes

### 2. Erreurs de Connexion API

**Symptômes :**
- Messages d'erreur "Erreur de connexion au serveur"
- Timeout des requêtes
- Erreurs CORS

**Solutions :**

#### A. Vérifier les ports
- Backend : Port 3000
- Frontend : Port 5173 (ou autre port disponible)

#### B. Vérifier CORS
Le backend doit autoriser les requêtes depuis le frontend. Vérifiez la configuration CORS dans `backend/server.js`.

#### C. Vérifier le firewall
Assurez-vous que le port 3000 n'est pas bloqué par le firewall.

### 3. Erreurs de Données

**Symptômes :**
- "Données d'article incomplètes"
- Propriétés manquantes dans les articles
- Erreurs de parsing JSON

**Solutions :**

#### A. Vérifier la structure des données
Les articles doivent avoir les propriétés suivantes :
```json
{
  "id": 1,
  "title": "Titre de l'article",
  "content": "Contenu de l'article",
  "categoryId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "category": {
    "id": 1,
    "name": "Actualités"
  }
}
```

#### B. Vérifier les migrations de base de données
```bash
cd backend
npm run migrate
```

#### C. Réinitialiser les données de test
```bash
cd backend
npm run seed
```

## Problèmes d'Authentification

### 1. Erreurs de Login

**Symptômes :**
- Impossible de se connecter
- Messages d'erreur d'authentification
- Token invalide

**Solutions :**

#### A. Vérifier les utilisateurs de test
```bash
cd backend
npm run seed
```

#### B. Vérifier la configuration JWT
Vérifiez le fichier `backend/config/jwt.js`

#### C. Nettoyer le localStorage
```javascript
// Dans la console du navigateur
localStorage.clear()
```

## Problèmes de Performance

### 1. Chargement lent

**Solutions :**

#### A. Optimiser les requêtes
- Utiliser la pagination
- Limiter le nombre d'articles par page
- Implémenter le cache

#### B. Vérifier la base de données
- Indexer les colonnes fréquemment utilisées
- Optimiser les requêtes SQL

## Debugging

### 1. Outils de Debug

#### A. Console du navigateur
Ouvrez les outils de développement (F12) et vérifiez :
- Erreurs JavaScript
- Requêtes réseau
- Logs de l'application

#### B. Logs du backend
Vérifiez les logs du serveur backend pour les erreurs.

#### C. Composant BackendStatus
Le composant `BackendStatus` affiche le statut de la connexion au backend.

### 2. Tests de Connectivité

#### A. Test de l'API
```bash
curl http://localhost:3000/api/health
```

#### B. Test de la base de données
```bash
cd backend
npm run test:db
```

## Configuration Recommandée

### 1. Variables d'environnement
```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000/api
VITE_DEV_MODE=true

# Backend (config.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=news_chronicle
JWT_SECRET=your-secret-key
PORT=3000
```

### 2. Ports par défaut
- Backend : 3000
- Frontend : 5173
- Base de données : 3306 (MySQL) ou 5432 (PostgreSQL)

## Support

Si vous rencontrez des problèmes non résolus :

1. Vérifiez les logs d'erreur
2. Consultez la documentation du projet
3. Vérifiez les issues GitHub
4. Créez une nouvelle issue avec les détails du problème 