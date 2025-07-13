# Documentation des Services Web - News Chronicle Online

## Vue d'ensemble

Ce projet implémente deux types de services web :

1. **Service Web SOAP** : Pour la gestion des utilisateurs avec authentification par token
2. **Service Web REST** : Pour la récupération d'articles avec support JSON/XML

## Service Web SOAP

### Authentification

Le service SOAP utilise un système de tokens d'authentification générés par les administrateurs depuis l'interface d'administration.

#### Endpoint SOAP
```
http://localhost:3000/soap
```

#### Méthodes disponibles

##### 1. authenticateUser
Authentifie un utilisateur avec un nom d'utilisateur et un mot de passe.

**Paramètres :**
- `username` (string) : Nom d'utilisateur
- `password` (string) : Mot de passe

**Réponse :**
```xml
<response>
  <success>true</success>
  <message>Authentification réussie</message>
  <role>ADMIN</role>
  <token>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</token>
</response>
```

##### 2. listUsers
Liste tous les utilisateurs (nécessite un token SOAP valide).

**Paramètres :**
- `token` (string) : Token SOAP généré par un administrateur

**Réponse :**
```xml
<response>
  <success>true</success>
  <message>3 utilisateur(s) trouvé(s)</message>
  <users>[{"id":1,"username":"admin","role":"ADMIN","createdAt":"2024-01-01T00:00:00.000Z"}]</users>
</response>
```

##### 3. addUser
Ajoute un nouvel utilisateur (nécessite un token SOAP valide).

**Paramètres :**
- `token` (string) : Token SOAP généré par un administrateur
- `username` (string) : Nom d'utilisateur
- `password` (string) : Mot de passe
- `role` (string, optionnel) : Rôle utilisateur (VISITEUR, EDITEUR, ADMIN)

**Réponse :**
```xml
<response>
  <success>true</success>
  <message>Utilisateur créé avec succès</message>
  <userId>4</userId>
</response>
```

##### 4. updateUser
Modifie un utilisateur existant (nécessite un token SOAP valide).

**Paramètres :**
- `token` (string) : Token SOAP généré par un administrateur
- `userId` (integer) : ID de l'utilisateur à modifier
- `username` (string, optionnel) : Nouveau nom d'utilisateur
- `password` (string, optionnel) : Nouveau mot de passe
- `role` (string, optionnel) : Nouveau rôle

**Réponse :**
```xml
<response>
  <success>true</success>
  <message>Utilisateur mis à jour avec succès</message>
</response>
```

##### 5. deleteUser
Supprime un utilisateur (nécessite un token SOAP valide).

**Paramètres :**
- `token` (string) : Token SOAP généré par un administrateur
- `userId` (integer) : ID de l'utilisateur à supprimer

**Réponse :**
```xml
<response>
  <success>true</success>
  <message>Utilisateur supprimé avec succès</message>
</response>
```

### Gestion des Tokens SOAP

#### Génération de tokens
1. Connectez-vous en tant qu'administrateur
2. Accédez au panel d'administration
3. Allez dans l'onglet "Tokens SOAP"
4. Entrez une description et générez un token
5. Le token sera valide pendant 30 jours

#### Utilisation des tokens
- Les tokens SOAP sont utilisés pour authentifier les appels aux méthodes d'administration
- Un token peut être utilisé pour plusieurs appels
- Les tokens expirés ou révoqués ne sont plus valides

## Service Web REST

### Endpoints disponibles

#### 1. Récupérer tous les articles
```
GET /api/rest/articles
```

**Paramètres de requête :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'articles par page (défaut: 10)
- `category` (optionnel) : Filtrer par catégorie
- `search` (optionnel) : Recherche dans le titre et le contenu

**Headers :**
- `Accept: application/json` pour JSON
- `Accept: application/xml` pour XML

**Réponse JSON :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Titre de l'article",
      "content": "Contenu de l'article",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Politique"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

**Réponse XML :**
```xml
<response>
  <success>true</success>
  <data>
    <item>
      <id>1</id>
      <title>Titre de l'article</title>
      <content>Contenu de l'article</content>
      <createdAt>2024-01-01T00:00:00.000Z</createdAt>
      <updatedAt>2024-01-01T00:00:00.000Z</updatedAt>
      <category>
        <id>1</id>
        <name>Politique</name>
      </category>
    </item>
  </data>
  <pagination>
    <page>1</page>
    <limit>10</limit>
    <total>25</total>
    <totalPages>3</totalPages>
  </pagination>
</response>
```

#### 2. Récupérer les articles groupés par catégories
```
GET /api/rest/articles/categories
```

**Paramètres de requête :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'articles par catégorie (défaut: 10)

**Réponse JSON :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Politique",
      "articlesCount": 5,
      "articles": [
        {
          "id": 1,
          "title": "Article politique",
          "content": "Contenu...",
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```

#### 3. Récupérer les articles d'une catégorie spécifique
```
GET /api/rest/articles/category/:categoryId
```

**Paramètres :**
- `categoryId` : ID de la catégorie

**Paramètres de requête :**
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'articles par page (défaut: 10)

**Réponse JSON :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Article de la catégorie",
      "content": "Contenu...",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "Politique"
      }
    }
  ],
  "category": {
    "id": 1,
    "name": "Politique"
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

#### 4. Récupérer un article par ID
```
GET /api/rest/articles/:id
```

**Paramètres :**
- `id` : ID de l'article

**Réponse JSON :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Titre de l'article",
    "content": "Contenu de l'article",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": 1,
      "name": "Politique"
    }
  }
}
```

## Exemples d'utilisation

### Client SOAP en JavaScript
```javascript
const soap = require('strong-soap').soap;

const client = soap.createClient('http://localhost:3000/soap', (err, client) => {
  if (err) {
    console.error('Erreur de connexion SOAP:', err);
    return;
  }

  // Authentification
  client.authenticateUser({
    username: 'admin',
    password: 'admin123'
  }, (err, result) => {
    if (result.success) {
      console.log('Authentification réussie:', result.role);
    }
  });

  // Lister les utilisateurs (avec token SOAP)
  client.listUsers({
    token: 'VOTRE_TOKEN_SOAP_ICI'
  }, (err, result) => {
    if (result.success) {
      console.log('Utilisateurs:', JSON.parse(result.users));
    }
  });
});
```

### Client REST en JavaScript
```javascript
const axios = require('axios');

// Récupérer les articles en JSON
const getArticlesJSON = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/rest/articles', {
      headers: { 'Accept': 'application/json' }
    });
    console.log('Articles:', response.data.data);
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
};

// Récupérer les articles en XML
const getArticlesXML = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/rest/articles', {
      headers: { 'Accept': 'application/xml' }
    });
    console.log('Articles XML:', response.data);
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
};

// Récupérer les articles par catégories
const getArticlesByCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/rest/articles/categories');
    console.log('Articles par catégories:', response.data.data);
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
};
```

### Client REST en cURL
```bash
# Récupérer les articles en JSON
curl -H "Accept: application/json" http://localhost:3000/api/rest/articles

# Récupérer les articles en XML
curl -H "Accept: application/xml" http://localhost:3000/api/rest/articles

# Récupérer les articles par catégories
curl http://localhost:3000/api/rest/articles/categories

# Récupérer les articles d'une catégorie
curl http://localhost:3000/api/rest/articles/category/1
```

## Tests

Pour tester les services, utilisez le script de test fourni :

```bash
cd backend
node test-services.js
```

Ce script teste :
1. L'authentification SOAP
2. La récupération d'articles en JSON
3. La récupération d'articles en XML
4. La récupération d'articles par catégories
5. La récupération d'articles d'une catégorie spécifique
6. L'endpoint de santé

## Sécurité

### Tokens SOAP
- Les tokens SOAP sont générés uniquement par les administrateurs
- Chaque token a une durée de vie de 30 jours
- Les tokens peuvent être révoqués à tout moment
- Les tokens sont uniques et ne peuvent pas être réutilisés

### Services REST
- Les services REST sont publics (lecture uniquement)
- Aucune authentification requise
- Support du format JSON et XML selon l'en-tête Accept

## Déploiement

### Variables d'environnement
Assurez-vous que les variables d'environnement suivantes sont configurées :

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=news_chronicle
DB_USER=postgres
DB_PASS=password

# JWT
JWT_SECRET=votre_secret_jwt_ici

# Serveur
PORT=3000
NODE_ENV=production
```

### Démarrage du serveur
```bash
# Installation des dépendances
npm install

# Démarrage du serveur
npm start

# Ou avec nodemon pour le développement
npm run dev
```

## Support

Pour toute question ou problème avec les services web, consultez :
1. Les logs du serveur
2. La documentation de l'API
3. Le script de test pour vérifier la connectivité
4. Les fichiers de configuration 