
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/news';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier s'il y a un token et récupérer le profil utilisateur
    const token = localStorage.getItem('authToken');
    if (token) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const userData = await apiService.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // Token invalide, le supprimer
      apiService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ username, password });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const register = async (username: string, password: string, role: 'VISITEUR' | 'EDITEUR' | 'ADMIN' = 'VISITEUR'): Promise<boolean> => {
    try {
      const response = await apiService.register({ username, password, role });
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    apiService.logout();
  };

  const isAuthenticated = !!user;

  const hasRole = (role: 'VISITEUR' | 'EDITEUR' | 'ADMIN'): boolean => {
    if (!user) return role === 'VISITEUR';
    
    if (role === 'VISITEUR') return true;
    if (role === 'EDITEUR') return user.role === 'EDITEUR' || user.role === 'ADMIN';
    if (role === 'ADMIN') return user.role === 'ADMIN';
    
    return false;
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
