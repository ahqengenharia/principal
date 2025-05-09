import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from 'lucide-react';
import { supabase } from "@/lib/supabase";

const LogoUploader = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem.",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      console.log('Starting logo upload...');
      
      // Upload to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      console.log('Logo uploaded successfully:', uploadData);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('logotipos')
        .insert({
          nome_arquivo: selectedFile.name,
          caminho_storage: fileName,
          url_publica: publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Logotipo enviado com sucesso!",
      });
      
      setSelectedFile(null);
      
      // Refresh the page to show the new logo
      window.location.reload();
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer upload do logotipo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="flex-1"
        />
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Enviando...' : 'Upload Logo'}
        </Button>
      </div>
      {selectedFile && (
        <p className="text-sm text-gray-500">
          Arquivo selecionado: {selectedFile.name}
        </p>
      )}
    </div>
  );
};

export default LogoUploader;