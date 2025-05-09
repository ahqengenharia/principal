
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  fetchDocumentFromAPI, 
  fetchDocumentFromSupabase, 
  createDefaultTemplate 
} from '@/services/documentService';

export const useDocumentLoader = () => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDocument();
  }, []);

  const loadDocument = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API first
      try {
        const apiContent = await fetchDocumentFromAPI();
        setContent(apiContent);
        
        toast({
          title: "Sucesso",
          description: "Documento carregado com sucesso",
        });
        return;
      } catch (error) {
        console.error('Error loading document from API:', error);
        
        // Fallback to Supabase if API fails
        try {
          const supabaseContent = await fetchDocumentFromSupabase();
          
          if (supabaseContent) {
            setContent(supabaseContent);
            return;
          }
          
          // If no template exists, create default
          const defaultContent = await createDefaultTemplate();
          setContent(defaultContent);
        } catch (fallbackError) {
          console.error('Fallback error:', fallbackError);
          toast({
            title: "Erro",
            description: "Falha ao carregar o documento.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    content,
    isLoading,
    loadDocument,
    setContent
  };
};
