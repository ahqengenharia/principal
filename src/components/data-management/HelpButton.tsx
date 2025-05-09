import React from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';

const HelpButton = () => {
  const { toast } = useToast();

  const { data: clientData } = useQuery({
    queryKey: ['clientData'],
    queryFn: async () => {
      const response = await fetch('/api/client/data');
      return response.json();
    }
  });

  const openHelp = async () => {
    try {
      const supportUrl = `${process.env.GLPI_URL}/front/helpdesk.public.php?${new URLSearchParams({
        razao_social: clientData?.razao_social || '',
        grupo: clientData?.grupo || '',
        numero_contrato: clientData?.numero_contrato || '',
        logotipo: clientData?.logotipo || ''
      })}`;

      window.open(supportUrl, '_blank');
      
      toast({
        title: "Suporte",
        description: "Portal de suporte aberto em nova janela",
      });
    } catch (error) {
      console.error('Error opening support:', error);
      toast({
        title: "Erro",
        description: "Não foi possível abrir o portal de suporte",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={openHelp}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      <HelpCircle className="mr-2 h-4 w-4" />
      Ajuda
    </Button>
  );
};

export default HelpButton;