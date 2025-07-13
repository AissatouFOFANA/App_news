const { sequelize } = require('../config/database');

async function migrateComplete() {
  try {
    console.log('🔄 Migration complète de la base de données...\n');
    
    // 1. Ajouter les colonnes médias à la table articles
    console.log('1️⃣ Ajout des colonnes médias...');
    try {
      await sequelize.query(`
        ALTER TABLE articles 
        ADD COLUMN imageUrl VARCHAR(500) NULL,
        ADD COLUMN videoUrl VARCHAR(500) NULL,
        ADD COLUMN mediaType ENUM('none', 'image', 'video') NOT NULL DEFAULT 'none'
      `);
      console.log('✅ Colonnes médias ajoutées');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️  Colonnes médias déjà présentes');
      } else {
        throw error;
      }
    }
    
    // 2. Ajouter la colonne authorId
    console.log('\n2️⃣ Ajout de la colonne authorId...');
    try {
      await sequelize.query(`
        ALTER TABLE articles 
        ADD COLUMN authorId INT NOT NULL DEFAULT 1,
        ADD CONSTRAINT fk_article_author FOREIGN KEY (authorId) REFERENCES users(id)
      `);
      console.log('✅ Colonne authorId ajoutée');
    } catch (error) {
      if (error.message.includes('Duplicate column name')) {
        console.log('ℹ️  Colonne authorId déjà présente');
      } else if (error.message.includes('Duplicate key name')) {
        console.log('ℹ️  Clé étrangère déjà présente');
      } else {
        throw error;
      }
    }
    
    // 3. Vérifier la structure finale
    console.log('\n3️⃣ Vérification de la structure finale...');
    const [columns] = await sequelize.query('DESCRIBE articles');
    console.log('Colonnes de la table articles:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type}`);
    });
    
    console.log('\n🎉 Migration complète terminée avec succès !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    throw error;
  }
}

if (require.main === module) {
  migrateComplete()
    .then(() => {
      console.log('\n✅ Migration terminée');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}

module.exports = { migrateComplete }; 