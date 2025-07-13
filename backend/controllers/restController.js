const { Article, Category } = require('../models');
const { Op } = require('sequelize');

// Récupérer la liste de tous les articles (format XML ou JSON selon le choix)
const getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;
    
    // Construire les conditions de recherche
    const where = {};
    if (category) {
      where.categoryId = category;
    }
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const articles = await Article.findAndCountAll({
      where,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.sendFormatted({
      success: true,
      data: articles.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: articles.count,
        totalPages: Math.ceil(articles.count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

// Récupérer la liste des articles regroupés en catégories
const getArticlesByCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Récupérer toutes les catégories avec leurs articles
    const categories = await Category.findAll({
      include: [{
        model: Article,
        as: 'articles',
        attributes: ['id', 'title', 'content', 'createdAt', 'updatedAt'],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      }],
      order: [['name', 'ASC']]
    });
    
    // Formater les données pour la réponse
    const formattedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      articlesCount: category.articles.length,
      articles: category.articles
    }));
    
    res.sendFormatted({
      success: true,
      data: formattedCategories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles par catégories:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

// Récupérer la liste des articles appartenant à une catégorie spécifique
const getArticlesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Vérifier que la catégorie existe
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).sendFormatted({
        success: false,
        error: 'Catégorie non trouvée'
      });
    }
    
    const articles = await Article.findAndCountAll({
      where: { categoryId },
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.sendFormatted({
      success: true,
      data: articles.rows,
      category: {
        id: category.id,
        name: category.name
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: articles.count,
        totalPages: Math.ceil(articles.count / limit)
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des articles par catégorie:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

// Récupérer un article par ID
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findByPk(id, {
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name']
      }]
    });
    
    if (!article) {
      return res.status(404).sendFormatted({
        success: false,
        error: 'Article non trouvé'
      });
    }
    
    res.sendFormatted({
      success: true,
      data: article
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).sendFormatted({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
};

module.exports = {
  getAllArticles,
  getArticlesByCategories,
  getArticlesByCategory,
  getArticleById
}; 