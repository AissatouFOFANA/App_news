import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, RefreshCw, Key, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';

interface SoapToken {
  id: string;
  token: string;
  description: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

const SoapTokenManagement: React.FC = () => {
  const [tokens, setTokens] = useState<SoapToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [description, setDescription] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Charger les tokens existants
  const loadTokens = async () => {
    setLoading(true);
    try {
      const response = await apiService.getSoapTokens();
      console.log('Response from getSoapTokens:', response); // Debug
      setTokens(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tokens SOAP",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Générer un nouveau token
  const generateToken = async () => {
    if (!description.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez fournir une description pour le token",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await apiService.generateSoapToken({
        description: description.trim()
      });
      
      console.log('Response from generateSoapToken:', response); // Debug
      const newToken = response.data;
      setTokens(prev => [newToken, ...prev]);
      setDescription('');
      
      toast({
        title: "Succès",
        description: "Token SOAP généré avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le token SOAP",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  // Révoquer un token
  const revokeToken = async (tokenId: string) => {
    try {
      await apiService.revokeSoapToken(tokenId);
      setTokens(prev => prev.filter(token => token.id !== tokenId));
      
      toast({
        title: "Succès",
        description: "Token révoqué avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la révocation du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de révoquer le token",
        variant: "destructive"
      });
    }
  };

  // Copier un token dans le presse-papiers
  const copyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      toast({
        title: "Copié",
        description: "Token copié dans le presse-papiers",
      });
      
      setTimeout(() => setCopiedToken(null), 2000);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le token",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const isExpired = (expiresAt: string) => {
    if (!expiresAt) return true;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Génération de token */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="w-5 h-5 mr-2" />
            Générer un Token SOAP
          </CardTitle>
          <CardDescription>
            Créez un nouveau token d'authentification pour accéder aux services SOAP.
            Ce token sera valide pendant 30 jours.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description du token</Label>
            <Input
              id="description"
              placeholder="Ex: Token pour l'intégration système externe"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={generating}
            />
          </div>
          <Button 
            onClick={generateToken} 
            disabled={generating || !description.trim()}
            className="w-full"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Générer le Token
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Liste des tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Tokens SOAP Actifs</CardTitle>
          <CardDescription>
            Gérez les tokens d'authentification existants pour les services SOAP.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Chargement des tokens...
            </div>
          ) : tokens.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Aucun token SOAP n'a été généré pour le moment.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div key={token.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium">{token.description || 'Description manquante'}</h4>
                        <Badge variant={token.isActive && !isExpired(token.expiresAt) ? "default" : "destructive"}>
                          {token.isActive && !isExpired(token.expiresAt) ? "Actif" : "Expiré"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Créé le {formatDate(token.createdAt)}
                        {!isExpired(token.expiresAt) && (
                          <span> • Expire le {formatDate(token.expiresAt)}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToken(token.token)}
                        disabled={copiedToken === token.token}
                      >
                        {copiedToken === token.token ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => revokeToken(token.id)}
                      >
                        Révoquer
                      </Button>
                    </div>
                  </div>
                  
                  {token.isActive && !isExpired(token.expiresAt) && (
                    <div className="bg-muted rounded p-3">
                      <Label className="text-xs font-medium mb-2 block">Token d'authentification</Label>
                      <div className="flex items-center space-x-2">
                        <Textarea
                          value={token.token || 'Token manquant'}
                          readOnly
                          className="font-mono text-xs"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations sur l'utilisation */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisation des Tokens SOAP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important :</strong> Les tokens SOAP sont utilisés pour authentifier les appels aux services web SOAP.
              Gardez-les en sécurité et ne les partagez qu'avec les systèmes autorisés.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <h4 className="font-medium">Endpoints SOAP disponibles :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code className="bg-muted px-1 rounded">authenticateUser(username, password)</code> - Authentifier un utilisateur</li>
              <li>• <code className="bg-muted px-1 rounded">listUsers(token)</code> - Lister tous les utilisateurs (ADMIN)</li>
              <li>• <code className="bg-muted px-1 rounded">addUser(token, username, password, role)</code> - Ajouter un utilisateur (ADMIN)</li>
              <li>• <code className="bg-muted px-1 rounded">updateUser(token, userId, username, password, role)</code> - Modifier un utilisateur (ADMIN)</li>
              <li>• <code className="bg-muted px-1 rounded">deleteUser(token, userId)</code> - Supprimer un utilisateur (ADMIN)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoapTokenManagement; 