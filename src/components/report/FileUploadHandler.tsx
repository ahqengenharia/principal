import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/config/supabaseSchema';

interface FileUploadHandlerProps {
  currentReportId: string | null;
  onUploadSuccess: () => void;
}

const FileUploadHandler = ({ currentReportId, onUploadSuccess }: FileUploadHandlerProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !currentReportId) return;

    try {
      const { data, error } = await supabase.storage
        .from('report-attachments')
        .upload(`${currentReportId}/${files[0].name}`, files[0]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Anexo adicionado com sucesso"
      });
      
      onUploadSuccess();
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer upload do arquivo",
        variant: "destructive"
      });
    }
  };

  return (
    <input
      type="file"
      id="file-upload"
      className="hidden"
      onChange={handleFileUpload}
      multiple
    />
  );
};

export default FileUploadHandler;