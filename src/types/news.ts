
// Types pour les articles
export interface Article {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

// Types pour les catégories
export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  articles?: Article[];
}

// Types pour les utilisateurs
export interface User {
  id: number;
  username: string;
  role: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// Types pour l'authentification
export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, role?: 'VISITEUR' | 'EDITEUR' | 'ADMIN') => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: 'VISITEUR' | 'EDITEUR' | 'ADMIN') => boolean;
}

// Types pour la pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

// Types pour les formulaires
export interface ArticleFormData {
  title: string;
  content: string;
  categoryId: number;
}

export interface CategoryFormData {
  name: string;
}

export interface UserFormData {
  username: string;
  password: string;
  role: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
}

// Types pour les filtres
export interface ArticleFilters {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
}
