
import { useToast } from "@/components/ui/use-toast";
import { uploadDocumentToAPI, uploadDocumentToSupabase } from '@/services/documentService';

export const useDocumentUploader = (
  setContent: (content: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  loadDocument: () => Promise<void>
) => {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      // Upload the file to our template API
      try {
        const data = await uploadDocumentToAPI(file);
        
        if (data.content) {
          setContent(data.content);
        }
        
        toast({
          title: "Sucesso",
          description: "Documento enviado com sucesso",
        });
        return;
      } catch (error) {
        console.error('Upload error:', error);
        
        // Fallback to Supabase Storage
        try {
          await uploadDocumentToSupabase(file);

          toast({
            title: "Sucesso",
            description: "Documento enviado para o Supabase Storage",
          });

          await loadDocument();
        } catch (fallbackError) {
          console.error('Fallback upload error:', fallbackError);
          toast({
            title: "Erro",
            description: "Falha no upload do documento",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleFileUpload
  };
};
