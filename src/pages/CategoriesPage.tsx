
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCategories, useArticlesByCategory } from '../hooks/useApi';
import ArticleCard from '../components/ArticleCard';
import { useApiError } from '@/hooks/useApiError';

const CategoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Récupérer toutes les catégories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  
  // Récupérer les articles par catégorie si une catégorie est sélectionnée
  const { data: articlesData, isLoading: articlesLoading, error: articlesError } = useArticlesByCategory(
    selectedCategory!,
    { page: 1, limit: 50 }
  );

  useApiError(categoriesError, 'Erreur de chargement des catégories');
  useApiError(articlesError, 'Erreur de chargement des articles');

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Actualités': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Technologie': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Sport': 'bg-red-100 text-red-800 hover:bg-red-200',
      'Culture': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Économie': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const categories = categoriesData?.data || categoriesData || [];
  const articles = articlesData?.data || articlesData || [];
  const selectedCategoryData = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)
    : null;

  if (categoriesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Catégories d'Actualités
        </h1>
        <p className="text-lg text-muted-foreground">
          Explorez nos articles par catégorie pour trouver les sujets qui vous intéressent.
        </p>
      </div>

      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id}
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(category.name)}>
                    {category.name}
                  </Badge>
                </div>
                <CardTitle className="hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
                <CardDescription>
                  Découvrez tous nos articles dans cette catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Cliquez pour voir tous les articles de cette catégorie
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-primary hover:underline text-sm"
            >
              ← Retour aux catégories
            </button>
            
            {selectedCategoryData && (
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(selectedCategoryData.name)}>
                  {selectedCategoryData.name}
                </Badge>
                <span className="text-muted-foreground">
                  {articles.length} article{articles.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {selectedCategoryData && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedCategoryData.name}
              </h2>
              <p className="text-muted-foreground">
                Tous les articles de la catégorie {selectedCategoryData.name}
              </p>
            </div>
          )}

          {articlesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement des articles...</p>
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucun article disponible dans cette catégorie pour le moment.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
