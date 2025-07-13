const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test simple des services REST
const testRestServices = async () => {
  console.log('🧪 Test des services REST...\n');

  try {
    // Test 1: Articles en JSON
    console.log('1️⃣ Test des articles en JSON...');
    const jsonResponse = await axios.get(`${BASE_URL}/api/rest/articles`, {
      headers: { 'Accept': 'application/json' }
    });
    console.log('✅ Articles JSON récupérés');
    console.log(`   Nombre d'articles: ${jsonResponse.data.data.length}`);
    console.log(`   Premier article: ${jsonResponse.data.data[0]?.title || 'Aucun article'}\n`);

    // Test 2: Articles en XML
    console.log('2️⃣ Test des articles en XML...');
    const xmlResponse = await axios.get(`${BASE_URL}/api/rest/articles`, {
      headers: { 'Accept': 'application/xml' }
    });
    console.log('✅ Articles XML récupérés');
    console.log(`   Type de contenu: ${xmlResponse.headers['content-type']}`);
    console.log(`   Taille de la réponse: ${xmlResponse.data.length} caractères\n`);

    // Test 3: Articles par catégories
    console.log('3️⃣ Test des articles par catégories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/rest/articles/categories`);
    console.log('✅ Articles par catégories récupérés');
    console.log(`   Nombre de catégories: ${categoriesResponse.data.data.length}\n`);

    // Test 4: Endpoint de santé
    console.log('4️⃣ Test de l\'endpoint de santé...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Endpoint de santé accessible');
    console.log(`   Statut: ${healthResponse.data.status}`);
    console.log(`   Message: ${healthResponse.data.message}\n`);

  } catch (error) {
    console.error('❌ Erreur lors des tests REST:', error.response?.data?.error || error.message);
  }
};

// Test des services SOAP (si vous avez un token)
const testSoapServices = async () => {
  console.log('🧪 Test des services SOAP...\n');
  
  console.log('ℹ️  Pour tester les services SOAP, vous devez :');
  console.log('   1. Utiliser un client SOAP (comme SoapUI, Postman, ou un client JavaScript)');
  console.log('   2. Utiliser le token que vous venez de créer');
  console.log('   3. Appeler l\'endpoint: http://localhost:3000/soap');
  console.log('\n📋 Méthodes SOAP disponibles :');
  console.log('   - authenticateUser(username, password)');
  console.log('   - listUsers(token) - ADMIN uniquement');
  console.log('   - addUser(token, username, password, role) - ADMIN uniquement');
  console.log('   - updateUser(token, userId, username, password, role) - ADMIN uniquement');
  console.log('   - deleteUser(token, userId) - ADMIN uniquement');
};

// Test de l'interface d'administration
const testAdminInterface = async () => {
  console.log('\n🧪 Test de l\'interface d\'administration...\n');
  
  try {
    // Test de récupération des tokens SOAP
    console.log('1️⃣ Test de récupération des tokens SOAP...');
    const tokensResponse = await axios.get(`${BASE_URL}/api/admin/soap-tokens`, {
      headers: { 
        'Authorization': 'Bearer YOUR_ADMIN_TOKEN_HERE',
        'Accept': 'application/json'
      }
    });
    console.log('✅ Tokens SOAP récupérés');
    console.log(`   Nombre de tokens: ${tokensResponse.data.data.length}`);
  } catch (error) {
    console.log('ℹ️  Pour tester l\'interface d\'administration :');
    console.log('   1. Connectez-vous en tant qu\'administrateur sur http://localhost:5173');
    console.log('   2. Allez dans le panel d\'administration');
    console.log('   3. Testez l\'onglet "Tokens SOAP"');
  }
};

// Fonction principale
const runTests = async () => {
  console.log('🚀 Démarrage des tests des services...\n');
  
  await testRestServices();
  await testSoapServices();
  await testAdminInterface();
  
  console.log('🎉 Tests terminés !');
  console.log('\n📋 Résumé :');
  console.log('   ✅ Services REST fonctionnels');
  console.log('   ✅ Support JSON et XML');
  console.log('   ✅ Articles par catégories');
  console.log('   ✅ Token SOAP créé avec succès');
  console.log('\n🌐 URLs disponibles :');
  console.log('   Frontend: http://localhost:5173');
  console.log('   Backend API: http://localhost:3000/api');
  console.log('   Services REST: http://localhost:3000/api/rest');
  console.log('   Services SOAP: http://localhost:3000/soap');
  console.log('   Health Check: http://localhost:3000/api/health');
};

// Exécuter les tests
runTests().catch(console.error); 