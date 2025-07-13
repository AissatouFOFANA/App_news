const { sequelize } = require('../config/database');
const { User, Category, Article, SoapToken } = require('../models');

async function diagnoseDatabase() {
  try {
    console.log('🔍 Diagnostic de la base de données...\n');
    
    // Test de connexion
    console.log('1️⃣ Test de connexion...');
    await sequelize.authenticate();
    console.log('✅ Connexion réussie\n');
    
    // Vérifier les tables
    console.log('2️⃣ Vérification des tables...');
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Tables trouvées:', tables.map(t => Object.values(t)[0]));
    console.log('');
    
    // Vérifier la structure de chaque table
    for (const table of ['users', 'categories', 'articles', 'soap_tokens']) {
      console.log(`3️⃣ Structure de la table ${table}...`);
      try {
        const [columns] = await sequelize.query(`DESCRIBE ${table}`);
        console.log(`Colonnes de ${table}:`, columns.map(col => col.Field));
      } catch (error) {
        console.log(`❌ Erreur avec la table ${table}:`, error.message);
      }
      console.log('');
    }
    
    // Compter les enregistrements
    console.log('4️⃣ Nombre d\'enregistrements...');
    try {
      const userCount = await User.count();
      const categoryCount = await Category.count();
      const articleCount = await Article.count();
      const tokenCount = await SoapToken.count();
      
      console.log(`Users: ${userCount}`);
      console.log(`Categories: ${categoryCount}`);
      console.log(`Articles: ${articleCount}`);
      console.log(`SoapTokens: ${tokenCount}`);
    } catch (error) {
      console.log('❌ Erreur lors du comptage:', error.message);
    }
    console.log('');
    
    // Test de création d'un enregistrement
    console.log('5️⃣ Test de création...');
    try {
      const testToken = await SoapToken.create({
        token: 'test-token-' + Date.now(),
        description: 'Token de test',
        createdBy: 1,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // +24h
      });
      console.log('✅ Token de test créé:', testToken.id);
      
      // Supprimer le token de test
      await testToken.destroy();
      console.log('✅ Token de test supprimé');
    } catch (error) {
      console.log('❌ Erreur lors du test de création:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du diagnostic:', error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  diagnoseDatabase()
    .then(() => {
      console.log('\n✅ Diagnostic terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { diagnoseDatabase }; 