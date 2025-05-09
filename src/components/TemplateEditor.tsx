import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_PROD_API_URL
  : import.meta.env.VITE_API_URL;

const TemplateEditor = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTemplateContent();
  }, []);

  const loadTemplateContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/template/content`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setContent(data.content);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o conteúdo do template.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/template/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Sucesso",
        description: "Template salvo com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Conteúdo do Template</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] p-4 font-mono"
          placeholder="Conteúdo do template..."
        />
        <Button 
          onClick={handleSave}
          className="w-full"
        >
          Salvar Alterações
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateEditor;