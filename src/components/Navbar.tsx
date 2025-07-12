
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      'VISITEUR': 'Visiteur',
      'EDITEUR': 'Éditeur',
      'ADMIN': 'Administrateur'
    };
    return labels[role] || role;
  };

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              News Chronicle
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Accueil
            </Link>
            
            <Link 
              to="/categories" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/categories') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Catégories
            </Link>

            {hasRole('EDITEUR') && (
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-1" />
                Administration
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {user?.username} ({getRoleLabel(user?.role || 'VISITEUR')})
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="default" size="sm">
                  <User className="w-4 h-4 mr-1" />
                  Connexion
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
