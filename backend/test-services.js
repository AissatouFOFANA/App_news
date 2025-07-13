const axios = require('axios');
const soap = require('strong-soap').soap;

const BASE_URL = 'http://localhost:3000';
const SOAP_URL = `${BASE_URL}/soap`;

// Configuration pour les tests
const testConfig = {
  adminCredentials: {
    username: 'admin',
    password: 'admin123'
  },
  testUser: {
    username: 'testuser',
    password: 'testpass123',
    role: 'VISITEUR'
  }
};

// Fonction utilitaire pour les appels SOAP
const callSoapService = (method, args) => {
  return new Promise((resolve, reject) => {
    const client = soap.createClient(SOAP_URL, (err, client) => {
      if (err) {
        reject(err);
        return;
      }

      client[method](args, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  });
};

// Tests des services
const runTests = async () => {
  console.log('🧪 Démarrage des tests des services SOAP et REST...\n');

  try {
    // Test 1: Authentification SOAP
    console.log('1️⃣ Test d\'authentification SOAP...');
    const authResult = await callSoapService('authenticateUser', {
      username: testConfig.adminCredentials.username,
      password: testConfig.adminCredentials.password
    });
    
    if (authResult.success) {
      console.log('✅ Authentification SOAP réussie');
      console.log(`   Rôle: ${authResult.role}`);
      console.log(`   Token: ${authResult.token.substring(0, 20)}...`);
    } else {
      console.log('❌ Échec de l\'authentification SOAP');
      console.log(`   Erreur: ${authResult.message}`);
    }

    // Test 2: Services REST - Articles en JSON
    console.log('\n2️⃣ Test des services REST - Articles en JSON...');
    try {
      const jsonResponse = await axios.get(`${BASE_URL}/api/rest/articles`, {
        headers: { 'Accept': 'application/json' }
      });
      console.log('✅ Récupération des articles en JSON réussie');
      console.log(`   Nombre d'articles: ${jsonResponse.data.data.length}`);
    } catch (error) {
      console.log('❌ Échec de la récupération des articles en JSON');
      console.log(`   Erreur: ${error.response?.data?.error || error.message}`);
    }

    // Test 3: Services REST - Articles en XML
    console.log('\n3️⃣ Test des services REST - Articles en XML...');
    try {
      const xmlResponse = await axios.get(`${BASE_URL}/api/rest/articles`, {
        headers: { 'Accept': 'application/xml' }
      });
      console.log('✅ Récupération des articles en XML réussie');
      console.log(`   Type de contenu: ${xmlResponse.headers['content-type']}`);
    } catch (error) {
      console.log('❌ Échec de la récupération des articles en XML');
      console.log(`   Erreur: ${error.response?.data?.error || error.message}`);
    }

    // Test 4: Services REST - Articles par catégories
    console.log('\n4️⃣ Test des services REST - Articles par catégories...');
    try {
      const categoriesResponse = await axios.get(`${BASE_URL}/api/rest/articles/categories`, {
        headers: { 'Accept': 'application/json' }
      });
      console.log('✅ Récupération des articles par catégories réussie');
      console.log(`   Nombre de catégories: ${categoriesResponse.data.data.length}`);
    } catch (error) {
      console.log('❌ Échec de la récupération des articles par catégories');
      console.log(`   Erreur: ${error.response?.data?.error || error.message}`);
    }

    // Test 5: Services REST - Articles d'une catégorie spécifique
    console.log('\n5️⃣ Test des services REST - Articles d\'une catégorie...');
    try {
      const categoryResponse = await axios.get(`${BASE_URL}/api/rest/articles/category/1`, {
        headers: { 'Accept': 'application/json' }
      });
      console.log('✅ Récupération des articles d\'une catégorie réussie');
      console.log(`   Catégorie: ${categoryResponse.data.category?.name || 'Inconnue'}`);
      console.log(`   Nombre d'articles: ${categoryResponse.data.data.length}`);
    } catch (error) {
      console.log('❌ Échec de la récupération des articles d\'une catégorie');
      console.log(`   Erreur: ${error.response?.data?.error || error.message}`);
    }

    // Test 6: Vérification de l'endpoint de santé
    console.log('\n6️⃣ Test de l\'endpoint de santé...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('✅ Endpoint de santé accessible');
      console.log(`   Statut: ${healthResponse.data.status}`);
      console.log(`   Message: ${healthResponse.data.message}`);
    } catch (error) {
      console.log('❌ Échec de l\'endpoint de santé');
      console.log(`   Erreur: ${error.response?.data?.error || error.message}`);
    }

    console.log('\n🎉 Tests terminés !');
    console.log('\n📋 Résumé des services disponibles:');
    console.log('   SOAP:');
    console.log('     - authenticateUser(username, password)');
    console.log('     - listUsers(token) - ADMIN uniquement');
    console.log('     - addUser(token, username, password, role) - ADMIN uniquement');
    console.log('     - updateUser(token, userId, username, password, role) - ADMIN uniquement');
    console.log('     - deleteUser(token, userId) - ADMIN uniquement');
    console.log('   REST:');
    console.log('     - GET /api/rest/articles - Tous les articles (JSON/XML)');
    console.log('     - GET /api/rest/articles/categories - Articles par catégories (JSON/XML)');
    console.log('     - GET /api/rest/articles/category/:id - Articles d\'une catégorie (JSON/XML)');
    console.log('     - GET /api/rest/articles/:id - Article par ID (JSON/XML)');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
};

// Exécuter les tests si le script est appelé directement
if (require.main === module) {
  runTests();
}

module.exports = { runTests }; 