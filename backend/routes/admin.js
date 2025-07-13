const express = require('express');
const router = express.Router();
const { 
  getAllSoapTokens, 
  generateSoapToken, 
  revokeSoapToken,
  verifySoapToken 
} = require('../controllers/soapTokenController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Routes pour les tokens SOAP (ADMIN uniquement)
// GET /api/admin/soap-tokens - Lister tous les tokens SOAP
router.get('/soap-tokens', authenticateToken, requireAdmin, getAllSoapTokens);

// POST /api/admin/soap-tokens - Générer un nouveau token SOAP
router.post('/soap-tokens', authenticateToken, requireAdmin, generateSoapToken);

// DELETE /api/admin/soap-tokens/:tokenId - Révoquer un token SOAP
router.delete('/soap-tokens/:tokenId', authenticateToken, requireAdmin, revokeSoapToken);

// POST /api/admin/soap-tokens/verify - Vérifier la validité d'un token SOAP
router.post('/soap-tokens/verify', verifySoapToken);

module.exports = router; 