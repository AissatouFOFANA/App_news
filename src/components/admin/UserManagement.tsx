
import React, { useState } from 'react';
import { User } from '../../types/news';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Shield, User as UserIcon } from 'lucide-react';
import { UserForm } from './UserForm';
import { useToast } from '@/hooks/use-toast';
import { useApiError } from '@/hooks/useApiError';

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Hooks pour les données
  const { data: usersData, isLoading, error } = useUsers();
  
  // Hooks pour les mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const { toast } = useToast();
  useApiError(error, 'Erreur de chargement des utilisateurs');

  const users = usersData?.data || usersData || [];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateUser = async (userData: Partial<User>) => {
    try {
      await createUserMutation.mutateAsync({
        username: userData.username || '',
        password: userData.password || '',
        role: userData.role || 'VISITEUR',
      });
      setIsFormOpen(false);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleUpdateUser = async (userData: Partial<User>) => {
    if (!selectedUser) return;

    try {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: {
          username: userData.username,
          password: userData.password,
          role: userData.role,
        }
      });
      setSelectedUser(null);
      setIsFormOpen(false);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUserMutation.mutateAsync(id);
    } catch (error) {
      // L'erreur est gérée par le hook
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'EDITEUR':
        return <Edit className="w-4 h-4" />;
      default:
        return <UserIcon className="w-4 h-4" />;
    }
  };

  const getRoleVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'EDITEUR':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'VISITEUR': 'Visiteur',
      'EDITEUR': 'Éditeur',
      'ADMIN': 'Administrateur'
    };
    return labels[role] || role;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Chargement des utilisateurs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des utilisateurs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setSelectedUser(null);
                setIsFormOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={selectedUser}
              onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
              onCancel={() => {
                setIsFormOpen(false);
                setSelectedUser(null);
              }}
              isLoading={createUserMutation.isPending || updateUserMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>
                  <Badge variant={getRoleVariant(user.role)} className="flex items-center w-fit">
                    {getRoleIcon(user.role)}
                    <span className="ml-1">{getRoleLabel(user.role)}</span>
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setIsFormOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={deleteUserMutation.isPending}
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {searchTerm ? 'Aucun utilisateur trouvé avec ces critères.' : 'Aucun utilisateur disponible.'}
          </p>
        </div>
      )}
    </div>
  );
};
