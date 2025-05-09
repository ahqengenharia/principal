import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const TemplateEditor = () => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/ahq'
    : 'https://46613b5a-edb3-4db3-9351-31f58ebd7b12.lovableproject.com/ahq';

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      console.log('Loading template from:', `${API_URL}/api/template/load`);
      const response = await fetch(`${API_URL}/api/template/load`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Template loaded successfully:', data);
      setContent(data.content);
      setIsLoading(false);
      
      toast({
        title: "Sucesso",
        description: "Template carregado com sucesso",
      });
    } catch (error) {
      console.error('Error loading template:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar o template. Por favor, tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
          readOnly
          className="min-h-[400px] p-4 font-mono bg-gray-50"
          placeholder="Carregando conteúdo do template..."
        />
      </CardContent>
    </Card>
  );
};

export default TemplateEditor;