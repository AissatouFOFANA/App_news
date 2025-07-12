import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { apiService } from '../services/api';
import { ENV_CONFIG } from '../config/environment';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const DiagnosticPanel: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: DiagnosticResult[] = [];

    // 1. Vérifier la configuration
    try {
      diagnostics.push({
        name: 'Configuration',
        status: 'success',
        message: `API URL: ${ENV_CONFIG.API_URL}`,
        details: {
          isDev: ENV_CONFIG.IS_DEV,
          isProd: ENV_CONFIG.IS_PROD,
          enableDebug: ENV_CONFIG.ENABLE_DEBUG,
        }
      });
    } catch (error) {
      diagnostics.push({
        name: 'Configuration',
        status: 'error',
        message: 'Erreur de configuration',
        details: error
      });
    }

    // 2. Vérifier la connectivité API
    try {
      await apiService.healthCheck();
      diagnostics.push({
        name: 'Connectivité API',
        status: 'success',
        message: 'Backend accessible'
      });
    } catch (error) {
      diagnostics.push({
        name: 'Connectivité API',
        status: 'error',
        message: 'Backend inaccessible',
        details: error
      });
    }

    // 3. Vérifier les articles
    try {
      const articles = await apiService.getArticles({ limit: 1 });
      if (articles && articles.data && articles.data.length > 0) {
        diagnostics.push({
          name: 'Données Articles',
          status: 'success',
          message: `${articles.data.length} article(s) disponible(s)`
        });
      } else {
        diagnostics.push({
          name: 'Données Articles',
          status: 'warning',
          message: 'Aucun article trouvé'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: 'Données Articles',
        status: 'error',
        message: 'Erreur lors de la récupération des articles',
        details: error
      });
    }

    // 4. Vérifier les catégories
    try {
      const categories = await apiService.getCategories();
      if (categories && categories.data && categories.data.length > 0) {
        diagnostics.push({
          name: 'Données Catégories',
          status: 'success',
          message: `${categories.data.length} catégorie(s) disponible(s)`
        });
      } else {
        diagnostics.push({
          name: 'Données Catégories',
          status: 'warning',
          message: 'Aucune catégorie trouvée'
        });
      }
    } catch (error) {
      diagnostics.push({
        name: 'Données Catégories',
        status: 'error',
        message: 'Erreur lors de la récupération des catégories',
        details: error
      });
    }

    // 5. Vérifier l'environnement
    diagnostics.push({
      name: 'Environnement',
      status: 'success',
      message: `Mode: ${ENV_CONFIG.IS_DEV ? 'Développement' : 'Production'}`,
      details: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
      }
    });

    setResults(diagnostics);
    setIsRunning(false);
  };

  useEffect(() => {
    // Auto-run diagnostics in development
    if (ENV_CONFIG.IS_DEV) {
      runDiagnostics();
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Diagnostic de l'Application
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runDiagnostics} 
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? 'Diagnostic en cours...' : 'Lancer le diagnostic'}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Masquer les détails' : 'Afficher les détails'}
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.name}</span>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.message}
                  </p>
                  {showDetails && result.details && (
                    <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          )}

          {ENV_CONFIG.IS_DEV && (
            <div className="text-xs text-muted-foreground">
              💡 Le diagnostic s'exécute automatiquement en mode développement
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticPanel; 