const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 10000] // Minimum 10 caractères, maximum 10000
    }
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    comment: "ID de l'auteur (utilisateur créateur)"
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL de l\'image principale de l\'article'
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL de la vidéo de l\'article'
  },
  mediaType: {
    type: DataTypes.ENUM('none', 'image', 'video'),
    allowNull: false,
    defaultValue: 'none',
    comment: 'Type de média associé à l\'article'
  }
}, {
  tableName: 'articles',
  timestamps: true // createdAt et updatedAt automatiques
});

module.exports = Article; 