
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Article } from '../types/news';
import { apiService } from '../services/api';
import ArticleCard from '../components/ArticleCard';
import PaginationComponent from '../components/Pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { useApiError } from '@/hooks/useApiError';

const   HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const articlesPerPage = 6;

  // Récupérer les catégories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiService.getCategories(),
  });

  // Récupérer les articles avec filtres
  const { data: articlesData, isLoading, error } = useQuery({
    queryKey: ['articles', currentPage, searchTerm, selectedCategory],
    queryFn: () => apiService.getArticles({
      page: currentPage,
      limit: articlesPerPage,
      category: selectedCategory ? parseInt(selectedCategory) : undefined,
      search: searchTerm || undefined,
    }),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Retour à la première page lors d'une recherche
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useApiError(error, 'Erreur de chargement');

  const articles = articlesData?.data || articlesData || [];
  const pagination = articlesData?.pagination;
  const categories = categoriesData?.data || categoriesData || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Dernières Actualités
        </h1>
        <p className="text-lg text-muted-foreground">
          Découvrez les dernières nouvelles et analyses de notre équipe de journalistes.
        </p>
      </div>

      {/* Filtres et recherche */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit" variant="outline">
                Rechercher
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Affichage des articles */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement des articles...</p>
        </div>
      ) : articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <PaginationComponent
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Informations sur les résultats */}
          {pagination && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Affichage de {((currentPage - 1) * articlesPerPage) + 1} à{' '}
              {Math.min(currentPage * articlesPerPage, pagination.total)} sur{' '}
              {pagination.total} article{pagination.total > 1 ? 's' : ''}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm || selectedCategory 
              ? 'Aucun article trouvé avec ces critères.' 
              : 'Aucun article disponible pour le moment.'
            }
          </p>
          {(searchTerm || selectedCategory) && (
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setCurrentPage(1);
              }}
            >
              Effacer les filtres
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
