const User = require('./User');
const Category = require('./Category');
const Article = require('./Article');
const SoapToken = require('./SoapToken');

// Définition des relations
Category.hasMany(Article, {
  foreignKey: 'categoryId',
  as: 'articles'
});

Article.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});

// Relation entre User et SoapToken
User.hasMany(SoapToken, {
  foreignKey: 'createdBy',
  as: 'soapTokens'
});

SoapToken.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// Synchronisation des modèles avec la base de données
const syncModels = async () => {
  try {
    await User.sync({ alter: true });
    await Category.sync({ alter: true });
    await Article.sync({ alter: true });
    await SoapToken.sync({ alter: true });
    console.log('✅ Modèles synchronisés avec la base de données');
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation des modèles:', error);
  }
};

module.exports = {
  User,
  Category,
  Article,
  SoapToken,
  syncModels
}; 