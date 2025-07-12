
import React, { useState, useEffect } from 'react';
import { User } from '../../types/news';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: Partial<User>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ 
  user, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'VISITEUR' as 'VISITEUR' | 'EDITEUR' | 'ADMIN'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        password: '', // On ne pré-remplit pas le mot de passe pour la sécurité
        role: user.role
      });
    }
  }, [user]);

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

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'VISITEUR': 'Visiteur',
      'EDITEUR': 'Éditeur',
      'ADMIN': 'Administrateur'
    };
    return labels[role] || role;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur *</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          placeholder="nom_utilisateur"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          {user ? 'Nouveau mot de passe' : 'Mot de passe'} *
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          placeholder={user ? "Laissez vide pour ne pas changer" : "Mot de passe"}
          required={!user} // Requis seulement pour la création
          disabled={isLoading}
        />
        {user && (
          <p className="text-xs text-muted-foreground">
            Laissez vide pour conserver le mot de passe actuel
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Rôle *</Label>
        <Select 
          value={formData.role} 
          onValueChange={(value) => handleChange('role', value)}
          disabled={isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="VISITEUR">Visiteur</SelectItem>
            <SelectItem value="EDITEUR">Éditeur</SelectItem>
            <SelectItem value="ADMIN">Administrateur</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-muted p-3 rounded-md text-sm">
        <p className="font-medium">Permissions par rôle :</p>
        <ul className="mt-1 space-y-1 text-muted-foreground">
          <li>• <strong>Visiteur</strong> : Lecture seule des articles</li>
          <li>• <strong>Éditeur</strong> : Gestion des articles et catégories</li>
          <li>• <strong>Administrateur</strong> : Accès complet à toutes les fonctionnalités</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : (user ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
};
