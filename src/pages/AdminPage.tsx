
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArticleManagement } from '../components/admin/ArticleManagement';
import { CategoryManagement } from '../components/admin/CategoryManagement';
import { UserManagement } from '../components/admin/UserManagement';
import { Settings, FileText, FolderOpen, Users } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user, hasRole } = useAuth();

  if (!user || !hasRole('EDITEUR')) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = hasRole('ADMIN');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center">
          <Settings className="w-8 h-8 mr-3" />
          Panel d'Administration
        </h1>
        <p className="text-lg text-muted-foreground">
          Gérez les articles, catégories{isAdmin && ' et utilisateurs'} de votre site d'actualités.
        </p>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="articles" className="flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            Articles
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center">
            <FolderOpen className="w-4 h-4 mr-2" />
            Catégories
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="articles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Articles</CardTitle>
              <CardDescription>
                Créez, modifiez et gérez tous les articles du site.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ArticleManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Catégories</CardTitle>
              <CardDescription>
                Organisez et gérez les catégories d'articles.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les comptes utilisateurs et leurs permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AdminPage;
