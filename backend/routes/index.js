const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./auth');
const userRoutes = require('./users');
const articleRoutes = require('./articles');
const categoryRoutes = require('./categories');
const restRoutes = require('./rest');
const adminRoutes = require('./admin');

// Configuration des routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/rest', restRoutes);
router.use('/admin', adminRoutes);

// Route de test
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API News Chronicle Online',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
