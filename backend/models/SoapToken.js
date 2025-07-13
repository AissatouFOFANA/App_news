const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SoapToken = sequelize.define('SoapToken', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  lastUsedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'soap_tokens',
  timestamps: true
});

// Méthodes d'instance
SoapToken.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

SoapToken.prototype.isValid = function() {
  return this.isActive && !this.isExpired();
};

SoapToken.prototype.updateLastUsed = async function() {
  this.lastUsedAt = new Date();
  await this.save();
};

// Méthodes statiques
SoapToken.findValidToken = async function(tokenString) {
  const soapToken = await this.findOne({
    where: {
      token: tokenString,
      isActive: true
    }
  });
  
  if (!soapToken || soapToken.isExpired()) {
    return null;
  }
  
  return soapToken;
};

module.exports = SoapToken; 