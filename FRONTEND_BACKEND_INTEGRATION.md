# Intégration Frontend-Backend - News Chronicle Online

Ce document explique comment configurer et utiliser l'application avec les vraies données du backend.

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet frontend avec la configuration suivante :

```env
# Configuration de l'API backend
VITE_API_URL=http://localhost:3000/api

# Configuration de développement
VITE_DEV_MODE=true
```

### 2. Démarrage des services

#### Backend (Port 3000)
```bash
cd backend
npm install
npm start
```

#### Frontend (Port 5173)
```bash
npm install
npm run dev
```

## Architecture des données

### Structure de l'API

L'API backend expose les endpoints suivants :

- **Authentification** : `/api/auth`
  - `POST /login` - Connexion utilisateur
  - `POST /register` - Inscription utilisateur
  - `GET /profile` - Profil utilisateur connecté

- **Articles** : `/api/articles`
  - `GET /` - Liste des articles (avec pagination et filtres)
  - `GET /:id` - Détail d'un article
  - `POST /` - Créer un article
  - `PUT /:id` - Modifier un article
  - `DELETE /:id` - Supprimer un article
  - `GET /category/:id` - Articles par catégorie

- **Catégories** : `/api/categories`
  - `GET /` - Liste des catégories
  - `GET /:id` - Détail d'une catégorie
  - `POST /` - Créer une catégorie
  - `PUT /:id` - Modifier une catégorie
  - `DELETE /:id` - Supprimer une catégorie

- **Utilisateurs** : `/api/users` (ADMIN uniquement)
  - `GET /` - Liste des utilisateurs
  - `GET /:id` - Détail d'un utilisateur
  - `POST /` - Créer un utilisateur
  - `PUT /:id` - Modifier un utilisateur
  - `DELETE /:id` - Supprimer un utilisateur

### Types de données

#### Article
```typescript
interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}
```

#### Category
```typescript
interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  articles?: Article[];
}
```

#### User
```typescript
interface User {
  id: number;
  username: string;
  role: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}
```

## Hooks React Query

L'application utilise des hooks personnalisés pour gérer les requêtes API :

### Hooks de lecture (Queries)
- `useArticles(params)` - Récupérer les articles avec filtres
- `useArticle(id)` - Récupérer un article spécifique
- `useArticlesByCategory(categoryId, params)` - Articles par catégorie
- `useCategories()` - Récupérer toutes les catégories
- `useCategory(id)` - Récupérer une catégorie spécifique
- `useUsers()` - Récupérer tous les utilisateurs (ADMIN)
- `useUser(id)` - Récupérer un utilisateur spécifique (ADMIN)
- `useProfile()` - Profil utilisateur connecté

### Hooks de modification (Mutations)
- `useCreateArticle()` - Créer un article
- `useUpdateArticle()` - Modifier un article
- `useDeleteArticle()` - Supprimer un article
- `useCreateCategory()` - Créer une catégorie
- `useUpdateCategory()` - Modifier une catégorie
- `useDeleteCategory()` - Supprimer une catégorie
- `useCreateUser()` - Créer un utilisateur (ADMIN)
- `useUpdateUser()` - Modifier un utilisateur (ADMIN)
- `useDeleteUser()` - Supprimer un utilisateur (ADMIN)

## Exemples d'utilisation

### Récupération d'articles avec filtres
```typescript
const { data, isLoading, error } = useArticles({
  page: 1,
  limit: 10,
  category: 1,
  search: "technologie"
});
```

### Création d'un article
```typescript
const createArticle = useCreateArticle();

const handleSubmit = async (articleData) => {
  try {
    await createArticle.mutateAsync({
      title: "Nouvel article",
      content: "Contenu de l'article",
      categoryId: 1
    });
  } catch (error) {
    // Gestion d'erreur automatique avec toast
  }
};
```

### Gestion des erreurs
```typescript
import { useApiError } from '@/hooks/useApiError';

const { data, error } = useArticles();
useApiError(error, 'Erreur de chargement des articles');
```

## Authentification

### Connexion
```typescript
const { login } = useAuth();

const handleLogin = async (username: string, password: string) => {
  const success = await login(username, password);
  if (success) {
    // Redirection ou autre logique
  }
};
```

### Vérification des rôles
```typescript
const { hasRole } = useAuth();

if (hasRole('ADMIN')) {
  // Afficher les fonctionnalités admin
}
```

## Gestion du cache

React Query gère automatiquement le cache des données avec :
- **Stale Time** : 5-10 minutes selon les données
- **Invalidation automatique** lors des mutations
- **Refetch** automatique lors du focus de la fenêtre

## Comptes de test

Utilisez ces comptes pour tester l'application :

- **Admin** : `admin` / `admin123`
- **Éditeur** : `editeur1` / `editeur123`
- **Visiteur** : `visiteur1` / `visiteur123`

## Déploiement

### Variables d'environnement de production
```env
VITE_API_URL=https://votre-api-backend.com/api
VITE_DEV_MODE=false
```

### Build de production
```bash
npm run build
```

## Dépannage

### Erreurs CORS
Assurez-vous que le backend autorise les requêtes depuis `http://localhost:5173`

### Erreurs de connexion
Vérifiez que :
1. Le backend est démarré sur le port 3000
2. L'URL de l'API est correcte dans `.env`
3. La base de données MySQL est accessible

### Erreurs d'authentification
Vérifiez que :
1. Le token JWT est valide
2. Les routes protégées sont correctement configurées
3. Les rôles utilisateur sont corrects 