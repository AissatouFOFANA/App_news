
import React, { useState, useEffect } from 'react';
import { Article, Category } from '../../types/news';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ArticleFormProps {
  article?: Article | null;
  categories?: Category[];
  onSubmit: (data: Partial<Article>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ 
  article, 
  categories = [], 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: ''
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        categoryId: article.categoryId.toString()
      });
    }
  }, [article]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      categoryId: parseInt(formData.categoryId)
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Titre de l'article"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
          <Select 
            value={formData.categoryId} 
            onValueChange={(value) => handleChange('categoryId', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenu *</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Contenu complet de l'article"
          rows={10}
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : (article ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
