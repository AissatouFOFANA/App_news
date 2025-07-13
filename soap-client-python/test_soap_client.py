#!/usr/bin/env python3
"""
Script de test pour vérifier la connectivité SOAP
"""

import requests
import sys

def test_soap_connectivity():
    """Test de la connectivité SOAP"""
    print("🧪 Test de connectivité SOAP...")
    print("=" * 50)
    
    # Test 1: Vérifier que le serveur répond
    print("1️⃣ Test de connectivité du serveur...")
    try:
        response = requests.get("http://localhost:3000/api/health", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur accessible")
            print(f"   Statut: {response.json().get('status')}")
        else:
            print(f"❌ Serveur répond avec le code {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Impossible de se connecter au serveur: {e}")
        return False
    
    # Test 2: Vérifier l'endpoint SOAP
    print("\n2️⃣ Test de l'endpoint SOAP...")
    try:
        # Requête SOAP simple pour récupérer le WSDL
        response = requests.get("http://localhost:3000/soap", timeout=5)
        if response.status_code == 200:
            print("✅ Endpoint SOAP accessible")
            if "WSDL" in response.text or "definitions" in response.text:
                print("   WSDL détecté dans la réponse")
            else:
                print("   Réponse reçue (pas de WSDL)")
        else:
            print(f"❌ Endpoint SOAP répond avec le code {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Impossible d'accéder à l'endpoint SOAP: {e}")
        return False
    
    # Test 3: Test d'authentification SOAP
    print("\n3️⃣ Test d'authentification SOAP...")
    soap_request = """<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:soap="http://newschronicle.com/soap">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:authenticateUser>
         <username>admin</username>
         <password>admin123</password>
      </soap:authenticateUser>
   </soapenv:Body>
</soapenv:Envelope>"""
    
    try:
        headers = {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': 'authenticateUser'
        }
        response = requests.post("http://localhost:3000/soap", data=soap_request, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("✅ Requête SOAP envoyée avec succès")
            if "success" in response.text:
                print("   Réponse SOAP reçue")
            else:
                print("   Réponse reçue (format inattendu)")
        else:
            print(f"❌ Requête SOAP échouée avec le code {response.status_code}")
            print(f"   Réponse: {response.text[:200]}...")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erreur lors de la requête SOAP: {e}")
        return False
    
    print("\n🎉 Tous les tests de connectivité sont passés !")
    print("\n📋 Prochaines étapes :")
    print("   1. Assurez-vous que le serveur backend est démarré")
    print("   2. Générez un token SOAP depuis l'interface d'administration")
    print("   3. Lancez l'application Python : python soap_user_manager.py")
    
    return True

def main():
    """Fonction principale"""
    print("🚀 Test de connectivité SOAP - News Chronicle Online")
    print("=" * 60)
    
    success = test_soap_connectivity()
    
    if success:
        print("\n✅ L'application Python peut maintenant être utilisée !")
        sys.exit(0)
    else:
        print("\n❌ Des problèmes de connectivité ont été détectés.")
        print("   Vérifiez que le serveur backend est démarré sur http://localhost:3000")
        sys.exit(1)

if __name__ == "__main__":
    main() 