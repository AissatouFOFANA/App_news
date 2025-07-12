
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Link2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ imageUrl, onImageChange }) => {
  const [preview, setPreview] = useState<string>(imageUrl || '');
  const [urlInput, setUrlInput] = useState<string>(imageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier que c'est bien une image
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner un fichier image valide.');
        return;
      }

      // Créer une URL temporaire pour la prévisualisation
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim());
      onImageChange(urlInput.trim());
    }
  };

  const handleRemoveImage = () => {
    setPreview('');
    setUrlInput('');
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>Image de l'article</Label>
      
      {preview && (
        <div className="relative">
          <div className="aspect-video w-full max-w-md overflow-hidden rounded-lg border">
            <img 
              src={preview} 
              alt="Aperçu" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemoveImage}
            className="absolute top-2 right-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Télécharger
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center">
            <Link2 className="w-4 h-4 mr-2" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Choisir
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Formats supportés : JPG, PNG, GIF, WebP (max 5MB)
          </p>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
            >
              Valider
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Entrez l'URL d'une image hébergée en ligne
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};
