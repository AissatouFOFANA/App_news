# News Chronicle - Backend

## Démarrage en local

1. Clone ce dépôt ou extrait le dossier.
2. Installe les dépendances :
```bash
npm install
```
3. Crée une base de données MySQL :
```sql
CREATE DATABASE news_db;
```
4. Configure ton fichier `.env`
5. Démarre le serveur :
```bash
npm start
```

## 📦 Services REST

- `GET /api/articles` : Liste des articles (JSON/XML)
- `GET /api/articles/category/:id` : Articles d’une catégorie
- `GET /api/categories` : Liste des catégories
- `POST /api/login` : Authentification utilisateur
- `POST /api/articles` : Ajouter un article (éditeur)
- `PUT /api/articles/:id` : Modifier un article
- `DELETE /api/articles/:id` : Supprimer un article

## 🌐 Services SOAP

- `http://localhost:3000/wsdl?wsdl`
- Fonctions disponibles :
  - `authenticateUser(login, password)`
  - `getUsers(token)`
  - `addUser(user, token)`
  - `updateUser(id, user, token)`
  - `deleteUser(id, token)`

## 👤 Rôles
- **Visiteur** : lecture
- **Éditeur** : gestion articles + catégories
- **Admin** : + gestion utilisateurs +  tokens
