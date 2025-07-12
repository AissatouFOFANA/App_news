
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { apiService } from '../services/api';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { useApiError } from '@/hooks/useApiError';
import BackendStatus from '../components/BackendStatus';
import DiagnosticPanel from '../components/DiagnosticPanel';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Validation de l'ID
  const articleId = id ? parseInt(id, 10) : null;
  const isValidId = articleId && !isNaN(articleId) && articleId > 0;

  const { data: articleData, isLoading, error } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => {
      if (!isValidId) {
        throw new Error('ID d\'article invalide');
      }
      return apiService.getArticle(articleId);
    },
    enabled: !!isValidId,
    retry: 2,
    retryDelay: 1000,
  });

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Actualités': 'bg-blue-100 text-blue-800',
      'Technologie': 'bg-green-100 text-green-800',
      'Sport': 'bg-red-100 text-red-800',
      'Culture': 'bg-purple-100 text-purple-800',
      'Économie': 'bg-yellow-100 text-yellow-800',
    };
    return colors[categoryName] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  };

  // Gestion des erreurs avec useApiError
  useApiError(error, 'Erreur de chargement de l\'article');

  // Affichage du chargement
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs et cas où l'article n'existe pas
  if (error || !articleData || (!articleData.data && !articleData.success)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Article non trouvé</h1>
          <p className="text-muted-foreground mb-4">
            {error?.message === 'ID d\'article invalide' 
              ? 'L\'identifiant de l\'article est invalide.'
              : 'L\'article que vous cherchez n\'existe pas ou a été supprimé.'
            }
          </p>
          
          {/* Affichage du statut du backend pour le débogage */}
          <div className="mb-4">
            <BackendStatus />
          </div>
          
          {/* Panel de diagnostic en mode développement */}
          {import.meta.env.DEV && (
            <div className="mb-6">
              <DiagnosticPanel />
            </div>
          )}
          
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Extraction de l'article depuis la réponse API
  const article = articleData.data || articleData;

  // Vérification que l'article a les propriétés requises
  if (!article || !article.title || !article.content) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Données d'article incomplètes</h1>
          <p className="text-muted-foreground mb-4">
            Les données de l'article sont incomplètes ou corrompues.
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux articles
          </Button>
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex items-center gap-4 mb-4">
          {article.category && (
            <Badge className={getCategoryColor(article.category.name)}>
              {article.category.name}
            </Badge>
          )}
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(article.createdAt)}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="w-4 h-4 mr-1" />
            News Chronicle
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-6">
          {article.title}
        </h1>

        <div className="prose prose-lg max-w-none">
          <div className="text-foreground leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Article publié le {formatDate(article.createdAt)}
            {article.updatedAt && article.updatedAt !== article.createdAt && (
              <span> • Mis à jour le {formatDate(article.updatedAt)}</span>
            )}
          </p>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
