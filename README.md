# News Chronicle Online

Une plateforme de news complète avec backend Node.js/Express, frontend React, et client Python pour la gestion des utilisateurs via SOAP.

## 🚀 Fonctionnalités

### Backend (Node.js/Express)
- **API REST** pour la gestion des articles, catégories et utilisateurs
- **Service SOAP** pour la gestion des utilisateurs avec authentification par tokens
- **Base de données MySQL** avec Sequelize ORM
- **Authentification JWT** avec rôles (Visiteur, Éditeur, Admin)
- **Support des médias** : images et vidéos dans les articles
- **Gestion automatique des auteurs** : l'auteur est automatiquement assigné lors de la création

### Frontend (React/TypeScript)
- **Interface moderne** avec Tailwind CSS et shadcn/ui
- **Gestion d'administration** complète
- **Upload de médias** avec prévisualisation
- **Affichage responsive** des articles avec images/vidéos
- **Authentification** et gestion des rôles

### Client Python (SOAP)
- **Application CLI** pour la gestion des utilisateurs
- **Authentification SOAP** avec tokens
- **Opérations CRUD** complètes sur les utilisateurs
- **Interface interactive** avec menus
- **Tests de connectivité** automatiques

## 📦 Installation et démarrage

### Prérequis
- Node.js (v16+)
- MySQL (v8+)
- Python (v3.8+)

### Backend
1. Clone le dépôt :
```bash
git clone https://github.com/AissatouFOFANA/App_news.git
cd news-chronicle-online-main/backend
```

2. Installe les dépendances :
```bash
npm install
```

3. Configure la base de données MySQL :
```sql
CREATE DATABASE news_chronicle;
```

4. Configure le fichier `.env` :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=news_chronicle
JWT_SECRET=your_jwt_secret
PORT=3000
```

5. Exécute les migrations :
```bash
npm run migrate:complete
```

6. Démarre le serveur :
```bash
npm start
```

### Frontend
1. Dans un nouveau terminal :
```bash
cd news-chronicle-online-main
npm install
npm run dev
```

2. Accède à l'application : `http://localhost:5173`

### Client Python SOAP
1. Navigue vers le dossier du client Python :
```bash
cd news-chronicle-online-main/soap-client-python
```

2. Installe les dépendances :
```bash
pip install -r requirements.txt
```

3. Teste la connectivité :
```bash
python test_soap_client.py
```

4. Lance l'application :
```bash
python soap_user_manager.py
```

## 🔧 Services REST

### Articles
- `GET /api/articles` : Liste des articles avec pagination
- `GET /api/articles/:id` : Détail d'un article
- `GET /api/articles/category/:id` : Articles d'une catégorie
- `POST /api/articles` : Créer un article (avec médias)
- `PUT /api/articles/:id` : Modifier un article
- `DELETE /api/articles/:id` : Supprimer un article

### Catégories
- `GET /api/categories` : Liste des catégories
- `POST /api/categories` : Créer une catégorie
- `PUT /api/categories/:id` : Modifier une catégorie
- `DELETE /api/categories/:id` : Supprimer une catégorie

### Utilisateurs
- `POST /api/auth/login` : Authentification
- `POST /api/auth/register` : Inscription
- `GET /api/users` : Liste des utilisateurs (Admin)
- `POST /api/users` : Créer un utilisateur (Admin)
- `PUT /api/users/:id` : Modifier un utilisateur (Admin)
- `DELETE /api/users/:id` : Supprimer un utilisateur (Admin)

### Tokens SOAP
- `GET /api/admin/soap-tokens` : Liste des tokens (Admin)
- `POST /api/admin/soap-tokens` : Générer un token (Admin)
- `DELETE /api/admin/soap-tokens/:id` : Supprimer un token (Admin)
- `POST /api/admin/soap-tokens/verify` : Vérifier un token

## 🌐 Services SOAP

**Endpoint** : `http://localhost:3000/soap`

### Fonctions disponibles
- `authenticateUser(username, password)` : Authentification utilisateur
- `listUsers(token)` : Lister tous les utilisateurs (Admin + token SOAP)
- `addUser(token, username, password, role)` : Ajouter un utilisateur (Admin + token SOAP)
- `updateUser(token, userId, username, password, role)` : Modifier un utilisateur (Admin + token SOAP)
- `deleteUser(token, userId)` : Supprimer un utilisateur (Admin + token SOAP)

## 👤 Rôles et permissions

### Visiteur
- ✅ Lecture des articles
- ✅ Navigation par catégories
- ❌ Pas d'accès à l'administration

### Éditeur
- ✅ Toutes les permissions Visiteur
- ✅ Création/modification d'articles
- ✅ Gestion des catégories
- ✅ Upload de médias (images/vidéos)
- ❌ Pas de gestion des utilisateurs

### Admin
- ✅ Toutes les permissions Éditeur
- ✅ Gestion complète des utilisateurs
- ✅ Génération et gestion des tokens SOAP
- ✅ Accès à toutes les fonctionnalités

## 📱 Fonctionnalités avancées

### Gestion des médias
- **Images** : Support des formats JPG, PNG, GIF
- **Vidéos** : Support des formats MP4, WebM
- **Upload** : Interface drag & drop avec prévisualisation
- **URLs externes** : Possibilité d'utiliser des URLs d'images/vidéos

### Client Python SOAP
- **Interface CLI** intuitive avec menus
- **Authentification** automatique
- **Gestion des tokens** SOAP
- **Tests de connectivité** intégrés
- **Gestion d'erreurs** robuste

### Sécurité
- **Authentification JWT** pour l'API REST
- **Tokens SOAP** pour les opérations d'administration
- **Validation des données** côté serveur
- **Gestion des rôles** fine

## 🛠️ Scripts utiles

### Backend
```bash
npm start              # Démarrage du serveur
npm run dev            # Mode développement avec nodemon
npm run migrate        # Migration de base
npm run migrate:complete # Migration complète avec médias
npm run seed           # Peuplement de la base de données
npm run diagnose       # Diagnostic de la base de données
```

### Client Python
```bash
python test_soap_client.py    # Test de connectivité
python soap_user_manager.py   # Application principale
```

## 📁 Structure du projet

```
news-chronicle-online-main/
├── backend/                 # API Node.js/Express
│   ├── controllers/         # Contrôleurs API
│   ├── models/             # Modèles Sequelize
│   ├── routes/             # Routes API
│   ├── services/           # Services (SOAP)
│   └── scripts/            # Scripts de migration
├── src/                    # Frontend React
│   ├── components/         # Composants React
│   ├── pages/             # Pages de l'application
│   └── services/          # Services frontend
└── soap-client-python/     # Client Python SOAP
    ├── soap_user_manager.py
    ├── test_soap_client.py
    └── requirements.txt
```

## 🤝 Contribution

1. Fork le projet
2. Crée une branche pour votre fonctionnalité
3. Committe vos changements
4. Pousse vers la branche
5. Ouvre une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Aissatou FOFANA** - Développeuse Full Stack

---

**News Chronicle Online** - Une plateforme de news moderne et complète ! 📰✨
