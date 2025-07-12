
import React, { useState, useEffect } from 'react';
import { Category } from '../../types/news';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: Partial<Category>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nom de la catégorie"
          required
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : (category ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
