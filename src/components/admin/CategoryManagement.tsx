
import React, { useState } from 'react';
import { Category } from '../../types/news';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { CategoryForm } from './CategoryForm';
import { useToast } from '@/hooks/use-toast';
import { useApiError } from '@/hooks/useApiError';

export const CategoryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Hooks pour les données
  const { data: categoriesData, isLoading, error } = useCategories();
  
  // Hooks pour les mutations
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const { toast } = useToast();
  useApiError(error, 'Erreur de chargement des catégories');

  const categories = categoriesData?.data || categoriesData || [];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = async (categoryData: Partial<Category>) => {
    try {
      await createCategoryMutation.mutateAsync({
        name: categoryData.name || '',
      });
      setIsFormOpen(false);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleUpdateCategory = async (categoryData: Partial<Category>) => {
    if (!selectedCategory) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: selectedCategory.id,
        data: {
          name: categoryData.name || '',
        }
      });
      setSelectedCategory(null);
      setIsFormOpen(false);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await deleteCategoryMutation.mutateAsync(id);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Chargement des catégories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des catégories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setSelectedCategory(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedCategory ? 'Modifier la catégorie' : 'Créer une nouvelle catégorie'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={selectedCategory}
              onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedCategory(null);
              }}
              isLoading={createCategoryMutation.isPending || updateCategoryMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead>Nombre d'articles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {category.articles?.length || 0} article{(category.articles?.length || 0) > 1 ? 's' : ''}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={deleteCategoryMutation.isPending}
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

      {filteredCategories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'Aucune catégorie trouvée avec ces critères.' : 'Aucune catégorie disponible.'}
          </p>
        </div>
      )}
    </div>
  );
};
