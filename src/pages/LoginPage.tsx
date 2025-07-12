
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Erreur de connexion',
          description: 'Nom d\'utilisateur ou mot de passe incorrect.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la connexion.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register(username, password);
      if (success) {
        toast({
          title: 'Inscription réussie',
          description: 'Votre compte a été créé et vous êtes connecté.',
        });
        navigate('/');
      } else {
        toast({
          title: 'Erreur d\'inscription',
          description: 'Impossible de créer le compte. Vérifiez vos informations.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'inscription.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Authentification</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous ou créez un compte pour accéder aux fonctionnalités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Connexion</TabsTrigger>
              <TabsTrigger value="register">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="votre_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Nom d'utilisateur</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="nouveau_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Inscription...' : 'S\'inscrire'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Comptes de démonstration
                </span>
              </div>
            </div>
            
            <div className="mt-4 space-y-2 text-sm">
              <p className="text-muted-foreground">Utilisez ces comptes pour tester :</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin :</strong> admin / admin123</p>
                <p><strong>Éditeur :</strong> editeur1 / editeur123</p>
                <p><strong>Visiteur :</strong> visiteur1 / visiteur123</p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-primary hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
