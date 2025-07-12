import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface BackendStatusProps {
  className?: string;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string>('');

  const checkBackendStatus = async () => {
    setStatus('checking');
    setError('');
    
    try {
      await apiService.healthCheck();
      setStatus('online');
    } catch (err) {
      setStatus('offline');
      setError(err instanceof Error ? err.message : 'Erreur de connexion');
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'Vérification...';
      case 'online':
        return 'Backend connecté';
      case 'offline':
        return 'Backend déconnecté';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'checking':
        return 'bg-yellow-100 text-yellow-800';
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusIcon()}
      <Badge className={getStatusColor()}>
        {getStatusText()}
      </Badge>
      {status === 'offline' && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={checkBackendStatus}
          className="h-6 px-2"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
      {error && status === 'offline' && (
        <span className="text-xs text-red-600 ml-2">{error}</span>
      )}
    </div>
  );
};

export default BackendStatus; 