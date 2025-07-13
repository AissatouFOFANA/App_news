const express = require('express');
const router = express.Router();
const { 
  getAllArticles, 
  getArticlesByCategories,
  getArticlesByCategory,
  getArticleById
} = require('../controllers/restController');

// Routes REST publiques pour les articles (lecture uniquement)
// GET /api/rest/articles - Récupérer tous les articles (format XML ou JSON selon Accept header)
router.get('/articles', getAllArticles);

// GET /api/rest/articles/categories - Récupérer les articles regroupés par catégories
router.get('/articles/categories', getArticlesByCategories);

// GET /api/rest/articles/category/:categoryId - Récupérer les articles d'une catégorie spécifique
router.get('/articles/category/:categoryId', getArticlesByCategory);

// GET /api/rest/articles/:id - Récupérer un article par ID
router.get('/articles/:id', getArticleById);

module.exports = router; 