# Client SOAP Python - Gestionnaire d'Utilisateurs

## Description

Cette application Python permet de gérer les utilisateurs du système News Chronicle Online via les services web SOAP. Elle fournit une interface en ligne de commande pour effectuer toutes les opérations CRUD sur les utilisateurs.

## Fonctionnalités

- 🔐 **Authentification** : Connexion avec nom d'utilisateur et mot de passe
- 📋 **Liste des utilisateurs** : Affichage de tous les utilisateurs du système
- ➕ **Ajout d'utilisateur** : Création de nouveaux utilisateurs avec différents rôles
- ✏️ **Modification d'utilisateur** : Mise à jour des informations utilisateur
- 🗑️ **Suppression d'utilisateur** : Suppression d'utilisateurs existants
- 🔑 **Gestion des tokens SOAP** : Configuration des tokens d'authentification

## Prérequis

### 1. Python
- Python 3.7 ou supérieur
- pip (gestionnaire de paquets Python)

### 2. Serveur Backend
- Le serveur backend News Chronicle Online doit être démarré
- URL par défaut : `http://localhost:3000`

### 3. Token SOAP
- Un token SOAP valide généré depuis l'interface d'administration
- Le token doit être généré par un administrateur

## Installation

### 1. Cloner le projet
```bash
cd news-chronicle-online-main/soap-client-python
```

### 2. Installer les dépendances
```bash
pip install -r requirements.txt
```

## Utilisation

### 1. Démarrer l'application
```bash
python soap_user_manager.py
```

### 2. Processus de connexion
1. **Authentification** : Entrez votre nom d'utilisateur et mot de passe
2. **Configuration du token SOAP** : Entrez le token SOAP généré depuis l'interface web

### 3. Menu principal
L'application affiche un menu avec les options suivantes :

```
📋 MENU PRINCIPAL
--------------------
1. 📋 Lister tous les utilisateurs
2. ➕ Ajouter un utilisateur
3. ✏️  Modifier un utilisateur
4. 🗑️  Supprimer un utilisateur
5. 🔑 Configurer le token SOAP
6. 🔄 Actualiser la liste
0. 🚪 Quitter
```

## Configuration du Token SOAP

### 1. Générer un token depuis l'interface web
1. Connectez-vous en tant qu'administrateur sur `http://localhost:5173`
2. Allez dans le panel d'administration
3. Cliquez sur l'onglet "Tokens SOAP"
4. Entrez une description et générez un token
5. Copiez le token généré

### 2. Configurer le token dans l'application Python
1. Lancez l'application Python
2. Après l'authentification, entrez le token SOAP
3. Le token sera utilisé pour toutes les opérations d'administration

## Exemples d'utilisation

### Authentification
```
🔐 CONNEXION
------------------------------
Nom d'utilisateur: admin
Mot de passe: ********
✅ Authentification réussie ! Rôle: ADMIN
```

### Liste des utilisateurs
```
📋 LISTE DES UTILISATEURS (3 utilisateur(s))
--------------------------------------------------------------------------------
ID   Nom d'utilisateur    Rôle           Créé le
--------------------------------------------------------------------------------
1    admin               ADMIN          01/01/2024 10:00
2    editeur1            EDITEUR        02/01/2024 14:30
3    visiteur1           VISITEUR       03/01/2024 09:15
```

### Ajout d'utilisateur
```
➕ AJOUT D'UTILISATEUR
-------------------------
Nom d'utilisateur: nouvel_utilisateur
Mot de passe: ********

Rôles disponibles:
1. VISITEUR (lecture uniquement)
2. EDITEUR (lecture + écriture)
3. ADMIN (tous les droits)

Choisissez le rôle (1-3, défaut: 1): 2
✅ Utilisateur créé avec succès ! ID: 4
```

## Rôles utilisateur

- **VISITEUR** : Accès en lecture seule aux articles
- **EDITEUR** : Peut créer, modifier et supprimer des articles
- **ADMIN** : Accès complet à tous les services, y compris la gestion des utilisateurs

## Sécurité

- Les mots de passe ne sont jamais affichés à l'écran
- Les tokens SOAP ont une durée de vie de 30 jours
- Seuls les administrateurs peuvent générer des tokens SOAP
- Toutes les communications avec le serveur sont sécurisées

## Dépannage

### Erreur de connexion
```
❌ Échec de l'authentification: Nom d'utilisateur ou mot de passe incorrect
```
**Solution** : Vérifiez vos identifiants et assurez-vous que le serveur backend est démarré.

### Erreur de token SOAP
```
❌ Token SOAP requis pour cette opération
```
**Solution** : Configurez un token SOAP valide depuis l'interface d'administration.

### Erreur de serveur
```
❌ Erreur lors de la requête SOAP: Erreur HTTP 500
```
**Solution** : Vérifiez que le serveur backend fonctionne correctement et que les services SOAP sont accessibles.

## Structure du projet

```
soap-client-python/
├── soap_user_manager.py    # Application principale
├── requirements.txt        # Dépendances Python
└── README.md              # Documentation
```

## Développement

### Ajout de nouvelles fonctionnalités
1. Modifiez la classe `SoapClient` pour ajouter de nouvelles méthodes SOAP
2. Ajoutez les menus correspondants dans la classe `UserManagerApp`
3. Testez avec le serveur backend

### Personnalisation
- Modifiez `base_url` dans `SoapClient.__init__()` pour changer l'URL du serveur
- Ajustez les timeouts et les headers dans `_make_soap_request()`
- Personnalisez l'interface utilisateur dans les méthodes de menu

## Support

Pour toute question ou problème :
1. Vérifiez que le serveur backend est démarré
2. Consultez les logs du serveur backend
3. Vérifiez la configuration du token SOAP
4. Testez la connectivité réseau avec le serveur 