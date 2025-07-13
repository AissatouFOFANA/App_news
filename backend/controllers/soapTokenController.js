const { SoapToken, User } = require('../models');
const crypto = require('crypto');

// Lister tous les tokens SOAP (ADMIN uniquement)
const getAllSoapTokens = async (req, res) => {
  try {
    const tokens = await SoapToken.findAll({
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.sendFormatted({
      success: true,
      data: tokens
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des tokens SOAP:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

// Générer un nouveau token SOAP (ADMIN uniquement)
const generateSoapToken = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user.id;
    
    if (!description || !description.trim()) {
      return res.status(400).sendFormatted({
        success: false,
        error: 'Description requise'
      });
    }
    
    // Générer un token unique avec crypto
    const tokenData = `${description.trim()}-${userId}-${Date.now()}-${crypto.randomBytes(32).toString('hex')}`;
    const token = crypto.createHash('sha256').update(tokenData).digest('hex');
    
    // Définir l'expiration à 30 jours
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    
    console.log('Token SOAP généré:', token.substring(0, 20) + '...');
    console.log('Expiration:', expirationDate);
    
    // Créer le token SOAP
    const soapToken = await SoapToken.create({
      token: token,
      description: description.trim(),
      createdBy: userId,
      expiresAt: expirationDate
    });
    
    // Récupérer le token avec les informations du créateur
    const newToken = await SoapToken.findByPk(soapToken.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'username']
      }]
    });
    
    res.status(201).sendFormatted({
      success: true,
      message: 'Token SOAP généré avec succès',
      data: newToken
    });
  } catch (error) {
    console.error('Erreur lors de la génération du token SOAP:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

// Révoquer un token SOAP (ADMIN uniquement)
const revokeSoapToken = async (req, res) => {
  try {
    const { tokenId } = req.params;
    
    const soapToken = await SoapToken.findByPk(tokenId);
    if (!soapToken) {
      return res.status(404).sendFormatted({
        success: false,
        error: 'Token SOAP non trouvé'
      });
    }
    
    // Désactiver le token
    await soapToken.update({ isActive: false });
    
    res.sendFormatted({
      success: true,
      message: 'Token SOAP révoqué avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la révocation du token SOAP:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

// Vérifier la validité d'un token SOAP
const verifySoapToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).sendFormatted({
        success: false,
        error: 'Token requis'
      });
    }
    
    const soapToken = await SoapToken.findValidToken(token);
    
    if (!soapToken) {
      return res.status(401).sendFormatted({
        success: false,
        error: 'Token invalide ou expiré'
      });
    }
    
    // Mettre à jour la date de dernière utilisation
    await soapToken.updateLastUsed();
    
    res.sendFormatted({
      success: true,
      message: 'Token valide',
      data: {
        id: soapToken.id,
        description: soapToken.description,
        expiresAt: soapToken.expiresAt,
        lastUsedAt: soapToken.lastUsedAt
      }
    });
  } catch (error) {
    console.error('Erreur lors de la vérification du token SOAP:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  getAllSoapTokens,
  generateSoapToken,
  revokeSoapToken,
  verifySoapToken
}; 