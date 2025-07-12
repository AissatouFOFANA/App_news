import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Article, Category, User, ArticleFormData, CategoryFormData, UserFormData } from '../types/news';
import { useToast } from './use-toast';

// Clés de cache pour React Query
export const queryKeys = {
  articles: 'articles',
  article: (id: number) => ['article', id],
  categories: 'categories',
  category: (id: number) => ['category', id],
  users: 'users',
  user: (id: number) => ['user', id],
  profile: 'profile',
} as const;

// Hook pour les articles
export const useArticles = (params?: {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [queryKeys.articles, params],
    queryFn: () => apiService.getArticles(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useArticle = (id: number) => {
  return useQuery({
    queryKey: queryKeys.article(id),
    queryFn: () => apiService.getArticle(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useArticlesByCategory = (categoryId: number, params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: [queryKeys.articles, 'category', categoryId, params],
    queryFn: () => apiService.getArticlesByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ArticleFormData) => apiService.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.articles] });
      toast({
        title: "Succès",
        description: "Article créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création de l'article",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ArticleFormData> }) =>
      apiService.updateArticle(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.articles] });
      queryClient.invalidateQueries({ queryKey: queryKeys.article(id) });
      toast({
        title: "Succès",
        description: "Article mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de l'article",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.articles] });
      toast({
        title: "Succès",
        description: "Article supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression de l'article",
        variant: "destructive",
      });
    },
  });
};

// Hook pour les catégories
export const useCategories = () => {
  return useQuery({
    queryKey: [queryKeys.categories],
    queryFn: () => apiService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => apiService.getCategory(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CategoryFormData) => apiService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      toast({
        title: "Succès",
        description: "Catégorie créée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création de la catégorie",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormData }) =>
      apiService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      queryClient.invalidateQueries({ queryKey: queryKeys.category(id) });
      toast({
        title: "Succès",
        description: "Catégorie mise à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de la catégorie",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.categories] });
      toast({
        title: "Succès",
        description: "Catégorie supprimée avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression de la catégorie",
        variant: "destructive",
      });
    },
  });
};

// Hook pour les utilisateurs (ADMIN uniquement)
export const useUsers = () => {
  return useQuery({
    queryKey: [queryKeys.users],
    queryFn: () => apiService.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiService.getUser(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UserFormData) => apiService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création de l'utilisateur",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<UserFormData> }) =>
      apiService.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de l'utilisateur",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.users] });
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression de l'utilisateur",
        variant: "destructive",
      });
    },
  });
};

// Hook pour le profil utilisateur
export const useProfile = () => {
  return useQuery({
    queryKey: [queryKeys.profile],
    queryFn: () => apiService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 