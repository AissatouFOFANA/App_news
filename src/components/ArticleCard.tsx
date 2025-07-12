
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Article } from '../types/news';
import { Calendar, User } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
      <CardHeader className="flex-1">
        <div className="flex items-center justify-between mb-2">
          {article.category && (
            <Badge className={getCategoryColor(article.category.name)}>
              {article.category.name}
            </Badge>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(article.createdAt)}
          </div>
        </div>
        
        <CardTitle className="hover:text-primary transition-colors line-clamp-2">
          <Link to={`/article/${article.id}`}>
            {article.title}
          </Link>
        </CardTitle>
        
        <CardDescription className="line-clamp-3">
          {article.content.length > 150 
            ? `${article.content.substring(0, 150)}...` 
            : article.content
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="mt-auto">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>News Chronicle</span>
          </div>
          <Link 
            to={`/article/${article.id}`}
            className="text-primary hover:underline text-sm font-medium"
          >
            Lire la suite →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
