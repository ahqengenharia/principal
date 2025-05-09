import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, RotateCcw } from 'lucide-react';
import axios from 'axios';
import ConfigForm from '@/components/settings/ConfigForm';

const API_URL = import.meta.env.VITE_API_URL;

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [originalData, setOriginalData] = useState({
    razao_social: "",
    grupo: "",
    responsavel_tecnico: "WAGNER TRISTÃO"
  });
  const [companyData, setCompanyData] = useState({
    razao_social: "",
    grupo: "",
    responsavel_tecnico: "WAGNER TRISTÃO"
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        console.log('Fetching configuration...');
        const response = await axios.get(`${API_URL}/config`);
        const data = response.data;
        setCompanyData(data);
        setOriginalData(data);
      } catch (error) {
        console.error('Error fetching configuration:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as configurações.",
          variant: "destructive"
        });
      }
    };

    fetchConfig();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Saving configuration:', companyData);
      const response = await axios.post(`${API_URL}/config/update`, companyData);
      
      if (response.data.success) {
        // Save to localStorage for persistence
        localStorage.setItem('razao_social', companyData.razao_social);
        localStorage.setItem('grupo', companyData.grupo);
        localStorage.setItem('responsavel_tecnico', companyData.responsavel_tecnico);
        
        setOriginalData(companyData);
        toast({
          title: "Sucesso",
          description: "Configurações salvas com sucesso.",
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    setCompanyData(originalData);
    toast({
      title: "Alterações desfeitas",
      description: "As alterações foram descartadas.",
    });
  };

  const handleBack = () => {
    if (JSON.stringify(companyData) !== JSON.stringify(originalData)) {
      if (confirm('Existem alterações não salvas. Deseja realmente sair?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button
          variant="ghost"
          onClick={handleUndo}
          className="flex items-center gap-2"
          disabled={JSON.stringify(companyData) === JSON.stringify(originalData)}
        >
          <RotateCcw className="h-4 w-4" />
          Desfazer Alterações
        </Button>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigForm
            companyData={companyData}
            isLoading={isLoading}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            originalData={originalData}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;