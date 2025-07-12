import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useApiError = (error: any, title?: string) => {
  useEffect(() => {
    if (error) {
      // Éviter d'afficher les erreurs d'ID invalide comme des toasts
      if (error?.message === 'ID d\'article invalide') {
        return;
      }
      
      const errorMessage = error?.message || 'Une erreur est survenue';
      
      // Messages d'erreur plus spécifiques selon le type d'erreur
      let finalMessage = errorMessage;
      if (errorMessage.includes('fetch')) {
        finalMessage = 'Erreur de connexion au serveur. Vérifiez que le backend est démarré.';
      } else if (errorMessage.includes('404')) {
        finalMessage = 'Ressource non trouvée sur le serveur.';
      } else if (errorMessage.includes('500')) {
        finalMessage = 'Erreur interne du serveur.';
      }
      
      toast({
        title: title || 'Erreur',
        description: finalMessage,
        variant: 'destructive',
      });
    }
  }, [error, title]);
}; 