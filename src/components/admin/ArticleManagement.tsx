
import React, { useState } from 'react';
import { Article } from '../../types/news';
import { useArticles, useCategories, useCreateArticle, useUpdateArticle, useDeleteArticle } from '../../hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { ArticleForm } from './ArticleForm';
import { useToast } from '@/hooks/use-toast';
import { useApiError } from '@/hooks/useApiError';

export const ArticleManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Hooks pour les données
  const { data: articlesData, isLoading, error } = useArticles({ limit: 100 });
  const { data: categoriesData } = useCategories();
  
  // Hooks pour les mutations
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();

  const { toast } = useToast();
  useApiError(error, 'Erreur de chargement des articles');

  const articles = articlesData?.data || articlesData || [];
  const categories = categoriesData?.data || categoriesData || [];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateArticle = async (articleData: Partial<Article>) => {
    try {
      await createArticleMutation.mutateAsync({
        title: articleData.title || '',
        content: articleData.content || '',
        categoryId: articleData.categoryId || 1,
      });
      setIsFormOpen(false);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleUpdateArticle = async (articleData: Partial<Article>) => {
    if (!selectedArticle) return;

    try {
      await updateArticleMutation.mutateAsync({
        id: selectedArticle.id,
        data: {
          title: articleData.title,
          content: articleData.content,
          categoryId: articleData.categoryId,
        }
      });
      setSelectedArticle(null);
      setIsFormOpen(false);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      await deleteArticleMutation.mutateAsync(id);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sans catégorie';
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Actualités': 'bg-blue-100 text-blue-800',
      'Technologie': 'bg-green-100 text-green-800',
      'Sport': 'bg-red-100 text-red-800',
      'Culture': 'bg-purple-100 text-purple-800',
      'Économie': 'bg-yellow-100 text-yellow-800',
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Chargement des articles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setSelectedArticle(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedArticle ? 'Modifier l\'article' : 'Créer un nouvel article'}
              </DialogTitle>
            </DialogHeader>
            <ArticleForm
              article={selectedArticle}
              categories={categories}
              onSubmit={selectedArticle ? handleUpdateArticle : handleCreateArticle}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedArticle(null);
              }}
              isLoading={createArticleMutation.isPending || updateArticleMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Date de publication</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="max-w-xs">
                  <div>
                    <p className="font-medium truncate">{article.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {article.content.substring(0, 100)}...
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getCategoryColor(getCategoryName(article.categoryId))}>
                    {getCategoryName(article.categoryId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(article.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant="default">Publié</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedArticle(article);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id)}
                      disabled={deleteArticleMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'Aucun article trouvé avec ces critères.' : 'Aucun article disponible.'}
          </p>
        </div>
      )}
    </div>
  );
};
