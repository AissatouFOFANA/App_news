#!/usr/bin/env python3
"""
Application Python pour la gestion des utilisateurs via les services SOAP
News Chronicle Online - Client SOAP
"""

import requests
import json
import sys
import os
from datetime import datetime
from typing import Dict, List, Optional, Tuple
import xml.etree.ElementTree as ET
from dataclasses import dataclass
import getpass

@dataclass
class User:
    """Classe pour représenter un utilisateur"""
    id: int
    username: str
    role: str
    created_at: str

class SoapClient:
    """Client pour les services SOAP"""
    
    def __init__(self, base_url: str = "http://localhost:3000"):
        self.base_url = base_url
        self.soap_url = f"{base_url}/soap"
        self.auth_token = None
        self.soap_token = None
        
    def _make_soap_request(self, method: str, params: Dict) -> Dict:
        """Effectue une requête SOAP"""
        try:
            # Construction de l'enveloppe SOAP
            soap_body = f"""<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://newschronicle.com/soap">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:{method}>
         {self._dict_to_soap_params(params)}
      </soap:{method}>
   </soapenv:Body>
</soapenv:Envelope>"""
            
            headers = {
                'Content-Type': 'text/xml; charset=utf-8',
                'SOAPAction': method
            }
            
            response = requests.post(self.soap_url, data=soap_body, headers=headers)
            
            if response.status_code != 200:
                raise Exception(f"Erreur HTTP {response.status_code}: {response.text}")
            
            # Parser la réponse SOAP
            return self._parse_soap_response(response.text, method)
            
        except Exception as e:
            print(f"❌ Erreur lors de la requête SOAP {method}: {str(e)}")
            return {"success": False, "message": str(e)}
    
    def _dict_to_soap_params(self, params: Dict) -> str:
        """Convertit un dictionnaire en paramètres SOAP"""
        soap_params = ""
        for key, value in params.items():
            if value is not None:
                soap_params += f"<{key}>{value}</{key}>"
        return soap_params
    
    def _parse_soap_response(self, xml_response: str, method: str) -> Dict:
        """Parse la réponse SOAP"""
        try:
            root = ET.fromstring(xml_response)
            
            # Chercher la réponse dans le body SOAP
            body = root.find('.//{http://schemas.xmlsoap.org/soap/envelope/}Body')
            if body is None:
                return {"success": False, "message": "Réponse SOAP invalide"}
            
            # Chercher la réponse de la méthode
            response_elem = body.find(f'.//{method}Response')
            if response_elem is None:
                return {"success": False, "message": f"Réponse {method} non trouvée"}
            
            # Extraire les données
            result = {}
            for child in response_elem:
                tag = child.tag.split('}')[-1]  # Enlever le namespace
                result[tag] = child.text
            
            return result
            
        except ET.ParseError as e:
            print(f"❌ Erreur de parsing XML: {str(e)}")
            return {"success": False, "message": "Réponse XML invalide"}
    
    def authenticate_user(self, username: str, password: str) -> bool:
        """Authentifie un utilisateur"""
        print(f"🔐 Authentification de l'utilisateur '{username}'...")
        
        result = self._make_soap_request("authenticateUser", {
            "username": username,
            "password": password
        })
        
        if result.get("success") == "true":
            self.auth_token = result.get("token")
            role = result.get("role")
            print(f"✅ Authentification réussie ! Rôle: {role}")
            return True
        else:
            print(f"❌ Échec de l'authentification: {result.get('message', 'Erreur inconnue')}")
            return False
    
    def set_soap_token(self, token: str):
        """Définit le token SOAP pour les opérations d'administration"""
        self.soap_token = token
        print(f"🔑 Token SOAP configuré: {token[:20]}...")
    
    def list_users(self) -> List[User]:
        """Liste tous les utilisateurs"""
        if not self.soap_token:
            print("❌ Token SOAP requis pour cette opération")
            return []
        
        print("📋 Récupération de la liste des utilisateurs...")
        result = self._make_soap_request("listUsers", {
            "token": self.soap_token
        })
        
        if result.get("success") == "true":
            users_json = result.get("users", "[]")
            try:
                users_data = json.loads(users_json)
                users = []
                for user_data in users_data:
                    users.append(User(
                        id=user_data.get("id"),
                        username=user_data.get("username"),
                        role=user_data.get("role"),
                        created_at=user_data.get("createdAt")
                    ))
                print(f"✅ {len(users)} utilisateur(s) trouvé(s)")
                return users
            except json.JSONDecodeError:
                print("❌ Erreur de parsing JSON des utilisateurs")
                return []
        else:
            print(f"❌ Erreur: {result.get('message', 'Erreur inconnue')}")
            return []
    
    def add_user(self, username: str, password: str, role: str = "VISITEUR") -> bool:
        """Ajoute un nouvel utilisateur"""
        if not self.soap_token:
            print("❌ Token SOAP requis pour cette opération")
            return False
        
        print(f"➕ Ajout de l'utilisateur '{username}' avec le rôle '{role}'...")
        result = self._make_soap_request("addUser", {
            "token": self.soap_token,
            "username": username,
            "password": password,
            "role": role
        })
        
        if result.get("success") == "true":
            user_id = result.get("userId")
            print(f"✅ Utilisateur créé avec succès ! ID: {user_id}")
            return True
        else:
            print(f"❌ Erreur: {result.get('message', 'Erreur inconnue')}")
            return False
    
    def update_user(self, user_id: int, username: str = None, password: str = None, role: str = None) -> bool:
        """Met à jour un utilisateur"""
        if not self.soap_token:
            print("❌ Token SOAP requis pour cette opération")
            return False
        
        print(f"✏️  Mise à jour de l'utilisateur ID {user_id}...")
        params = {"token": self.soap_token, "userId": user_id}
        if username:
            params["username"] = username
        if password:
            params["password"] = password
        if role:
            params["role"] = role
        
        result = self._make_soap_request("updateUser", params)
        
        if result.get("success") == "true":
            print("✅ Utilisateur mis à jour avec succès !")
            return True
        else:
            print(f"❌ Erreur: {result.get('message', 'Erreur inconnue')}")
            return False
    
    def delete_user(self, user_id: int) -> bool:
        """Supprime un utilisateur"""
        if not self.soap_token:
            print("❌ Token SOAP requis pour cette opération")
            return False
        
        print(f"🗑️  Suppression de l'utilisateur ID {user_id}...")
        result = self._make_soap_request("deleteUser", {
            "token": self.soap_token,
            "userId": user_id
        })
        
        if result.get("success") == "true":
            print("✅ Utilisateur supprimé avec succès !")
            return True
        else:
            print(f"❌ Erreur: {result.get('message', 'Erreur inconnue')}")
            return False

class UserManagerApp:
    """Application principale de gestion des utilisateurs"""
    
    def __init__(self):
        self.client = SoapClient()
        self.current_user = None
    
    def clear_screen(self):
        """Efface l'écran"""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def print_header(self):
        """Affiche l'en-tête de l'application"""
        print("=" * 60)
        print("           GESTIONNAIRE D'UTILISATEURS SOAP")
        print("              News Chronicle Online")
        print("=" * 60)
        print()
    
    def login(self) -> bool:
        """Processus de connexion"""
        self.clear_screen()
        self.print_header()
        print("🔐 CONNEXION")
        print("-" * 30)
        
        username = input("Nom d'utilisateur: ").strip()
        if not username:
            print("❌ Nom d'utilisateur requis")
            return False
        
        password = getpass.getpass("Mot de passe: ").strip()
        if not password:
            print("❌ Mot de passe requis")
            return False
        
        if self.client.authenticate_user(username, password):
            self.current_user = username
            return True
        return False
    
    def configure_soap_token(self):
        """Configure le token SOAP"""
        print("\n🔑 CONFIGURATION DU TOKEN SOAP")
        print("-" * 40)
        print("Pour utiliser les fonctionnalités d'administration,")
        print("vous devez configurer un token SOAP généré depuis")
        print("l'interface d'administration du site web.")
        print()
        
        token = input("Token SOAP (ou appuyez sur Entrée pour ignorer): ").strip()
        if token:
            self.client.set_soap_token(token)
        else:
            print("ℹ️  Token SOAP non configuré. Les fonctionnalités d'administration seront limitées.")
    
    def display_users(self, users: List[User]):
        """Affiche la liste des utilisateurs"""
        if not users:
            print("📭 Aucun utilisateur trouvé")
            return
        
        print(f"\n📋 LISTE DES UTILISATEURS ({len(users)} utilisateur(s))")
        print("-" * 80)
        id_col = "ID"
        user_col = "Nom d'utilisateur"
        role_col = "Rôle"
        date_col = "Créé le"
        print(f"{id_col:<5} {user_col:<20} {role_col:<15} {date_col:<20}")
        print("-" * 80)
        
        for user in users:
            created_date = datetime.fromisoformat(user.created_at.replace('Z', '+00:00')).strftime('%d/%m/%Y %H:%M')
            print(f"{user.id:<5} {user.username:<20} {user.role:<15} {created_date:<20}")
    
    def add_user_menu(self):
        """Menu d'ajout d'utilisateur"""
        print("\n➕ AJOUT D'UTILISATEUR")
        print("-" * 25)
        
        username = input("Nom d'utilisateur: ").strip()
        if not username:
            print("❌ Nom d'utilisateur requis")
            return
        
        password = getpass.getpass("Mot de passe: ").strip()
        if not password:
            print("❌ Mot de passe requis")
            return
        
        print("\nRôles disponibles:")
        print("1. VISITEUR (lecture uniquement)")
        print("2. EDITEUR (lecture + écriture)")
        print("3. ADMIN (tous les droits)")
        
        role_choice = input("Choisissez le rôle (1-3, défaut: 1): ").strip()
        role_map = {"1": "VISITEUR", "2": "EDITEUR", "3": "ADMIN"}
        role = role_map.get(role_choice, "VISITEUR")
        
        if self.client.add_user(username, password, role):
            print("✅ Utilisateur ajouté avec succès !")
        input("\nAppuyez sur Entrée pour continuer...")
    
    def update_user_menu(self):
        """Menu de mise à jour d'utilisateur"""
        print("\n✏️  MISE À JOUR D'UTILISATEUR")
        print("-" * 30)
        
        user_id = input("ID de l'utilisateur: ").strip()
        if not user_id or not user_id.isdigit():
            print("❌ ID utilisateur valide requis")
            return
        
        print("\nLaissez vide pour ne pas modifier:")
        username = input("Nouveau nom d'utilisateur: ").strip() or None
        password = getpass.getpass("Nouveau mot de passe: ").strip() or None
        
        if password == "":
            password = None
        
        role = None
        if input("Modifier le rôle ? (o/n): ").strip().lower() == 'o':
            print("\nRôles disponibles:")
            print("1. VISITEUR")
            print("2. EDITEUR")
            print("3. ADMIN")
            role_choice = input("Nouveau rôle (1-3): ").strip()
            role_map = {"1": "VISITEUR", "2": "EDITEUR", "3": "ADMIN"}
            role = role_map.get(role_choice)
        
        if self.client.update_user(int(user_id), username, password, role):
            print("✅ Utilisateur mis à jour avec succès !")
        input("\nAppuyez sur Entrée pour continuer...")
    
    def delete_user_menu(self):
        """Menu de suppression d'utilisateur"""
        print("\n🗑️  SUPPRESSION D'UTILISATEUR")
        print("-" * 30)
        
        user_id = input("ID de l'utilisateur à supprimer: ").strip()
        if not user_id or not user_id.isdigit():
            print("❌ ID utilisateur valide requis")
            return
        
        confirm = input(f"Êtes-vous sûr de vouloir supprimer l'utilisateur ID {user_id} ? (oui/non): ").strip().lower()
        if confirm in ['oui', 'o', 'yes', 'y']:
            if self.client.delete_user(int(user_id)):
                print("✅ Utilisateur supprimé avec succès !")
        else:
            print("❌ Suppression annulée")
        
        input("\nAppuyez sur Entrée pour continuer...")
    
    def main_menu(self):
        """Menu principal"""
        while True:
            self.clear_screen()
            self.print_header()
            print(f"👤 Utilisateur connecté: {self.current_user}")
            if self.client.soap_token:
                print(f"🔑 Token SOAP: {self.client.soap_token[:20]}...")
            print()
            
            print("📋 MENU PRINCIPAL")
            print("-" * 20)
            print("1. 📋 Lister tous les utilisateurs")
            print("2. ➕ Ajouter un utilisateur")
            print("3. ✏️  Modifier un utilisateur")
            print("4. 🗑️  Supprimer un utilisateur")
            print("5. 🔑 Configurer le token SOAP")
            print("6. 🔄 Actualiser la liste")
            print("0. 🚪 Quitter")
            print()
            
            choice = input("Votre choix (0-6): ").strip()
            
            if choice == "0":
                print("\n👋 Au revoir !")
                break
            elif choice == "1":
                users = self.client.list_users()
                self.display_users(users)
                input("\nAppuyez sur Entrée pour continuer...")
            elif choice == "2":
                if not self.client.soap_token:
                    print("❌ Token SOAP requis pour cette opération")
                    input("\nAppuyez sur Entrée pour continuer...")
                else:
                    self.add_user_menu()
            elif choice == "3":
                if not self.client.soap_token:
                    print("❌ Token SOAP requis pour cette opération")
                    input("\nAppuyez sur Entrée pour continuer...")
                else:
                    self.update_user_menu()
            elif choice == "4":
                if not self.client.soap_token:
                    print("❌ Token SOAP requis pour cette opération")
                    input("\nAppuyez sur Entrée pour continuer...")
                else:
                    self.delete_user_menu()
            elif choice == "5":
                self.configure_soap_token()
            elif choice == "6":
                print("🔄 Actualisation...")
                users = self.client.list_users()
                self.display_users(users)
                input("\nAppuyez sur Entrée pour continuer...")
            else:
                print("❌ Choix invalide")
                input("\nAppuyez sur Entrée pour continuer...")

def main():
    """Fonction principale"""
    app = UserManagerApp()
    
    # Connexion
    if not app.login():
        print("\n❌ Échec de la connexion. Arrêt de l'application.")
        sys.exit(1)
    
    # Configuration du token SOAP
    app.configure_soap_token()
    
    # Menu principal
    app.main_menu()

if __name__ == "__main__":
    main() 