import { API_CONFIG, getAuthHeaders } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

// Types pour l'API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  role?: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
}

// Classe pour gérer les appels API
export class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      ...getAuthHeaders(this.token),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Vérifier si la réponse est OK avant de parser le JSON
      if (!response.ok) {
        // Essayer de parser le JSON pour obtenir le message d'erreur
        let errorMessage = `Erreur HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Si le parsing JSON échoue, utiliser le message par défaut
        }
        throw new Error(errorMessage);
      }

      // Parser le JSON seulement si la réponse est OK
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Réponse invalide du serveur');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Gestion spécifique des erreurs réseau
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
      }
      
      // Relancer l'erreur avec un message plus clair
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error('Une erreur inattendue s\'est produite');
    }
  }

  // Méthodes d'authentification
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<{ message: string; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Le backend renvoie directement { message, token, user }
    if (response.token && response.user) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      return { token: response.token, user: response.user };
    }

    throw new Error('Login failed');
  }

  async register(userData: RegisterRequest): Promise<LoginResponse> {
    const response = await this.request<{ message: string; token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Le backend renvoie directement { message, token, user }
    if (response.token && response.user) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
      return { token: response.token, user: response.user };
    }

    throw new Error('Registration failed');
  }

  async getProfile(): Promise<any> {
    const response = await this.request<{ user: any }>('/auth/profile');
    return response.user;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Méthodes pour les articles
  async getArticles(params?: {
    page?: number;
    limit?: number;
    category?: number;
    search?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category.toString());
    if (params?.search) searchParams.append('search', params.search);

    const queryString = searchParams.toString();
    const endpoint = `/articles${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getArticle(id: number): Promise<any> {
    return this.request(`/articles/${id}`);
  }

  async getArticlesByCategory(categoryId: number, params?: {
    page?: number;
    limit?: number;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/articles/category/${categoryId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async createArticle(articleData: {
    title: string;
    content: string;
    categoryId: number;
  }): Promise<any> {
    return this.request('/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  async updateArticle(id: number, articleData: {
    title?: string;
    content?: string;
    categoryId?: number;
  }): Promise<any> {
    return this.request(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: number): Promise<any> {
    return this.request(`/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthodes pour les catégories
  async getCategories(): Promise<any> {
    return this.request('/categories');
  }

  async getCategory(id: number): Promise<any> {
    return this.request(`/categories/${id}`);
  }

  async createCategory(categoryData: { name: string }): Promise<any> {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: number, categoryData: { name: string }): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<any> {
    return this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthodes pour les utilisateurs (ADMIN uniquement)
  async getUsers(): Promise<any> {
    return this.request('/users');
  }

  async getUser(id: number): Promise<any> {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: {
    username: string;
    password: string;
    role: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
  }): Promise<any> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: number, userData: {
    username?: string;
    password?: string;
    role?: 'VISITEUR' | 'EDITEUR' | 'ADMIN';
  }): Promise<any> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<any> {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Méthode pour vérifier la santé de l'API
  async healthCheck(): Promise<any> {
    return this.request('/health');
  }
}

// Instance exportée pour utilisation dans les hooks
export const apiService = new ApiService(API_BASE_URL);
