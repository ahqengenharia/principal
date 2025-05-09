
import { useState, RefObject } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { saveDocumentToAPI, saveDocumentToSupabase } from '@/services/documentService';

export const useDocumentEditor = (
  editorRef: RefObject<HTMLDivElement>,
  content: string,
  setContent: (content: string) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const toggleEditing = () => {
    if (isEditing && editorRef.current) {
      // Save the edited content
      const newContent = editorRef.current.innerHTML;
      saveContent(newContent);
    }
    setIsEditing(!isEditing);
  };

  const saveContent = async (newContent: string) => {
    try {
      setIsLoading(true);
      
      // Save to API
      try {
        await saveDocumentToAPI(newContent);
      } catch (error) {
        console.error('Error saving to API:', error);
      }
      
      // Fallback save to Supabase
      try {
        await saveDocumentToSupabase(newContent);
      } catch (error) {
        console.error('Error saving to Supabase:', error);
        throw error;
      }

      setContent(newContent);
      
      toast({
        title: "Sucesso",
        description: "Documento salvo com sucesso",
      });
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar o documento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    toggleEditing,
    saveContent
  };
};
