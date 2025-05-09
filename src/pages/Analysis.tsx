import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Check, LineChart, BarChart, Droplet, GlassWater } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast"
import BackButton from '@/components/BackButton';

const Analysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleButtonClick = (route: string) => {
    toast({
      title: "Redirecionando",
      description: "Acessando módulo selecionado...",
    });
    navigate(`/analysis/${route}`);
  };

  return (
    <div className="container mx-auto p-8 relative">
      <BackButton />
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Módulo de Análises
      </h1>
      
      <Card className="bg-gradient-to-br from-blue-50 to-white">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          <Button
            variant="outline"
            className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
            onClick={() => handleButtonClick('consistency')}
          >
            <Check className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">CONSISTÊNCIA DE DADOS</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
            onClick={() => handleButtonClick('images')}
          >
            <Database className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">BANCO DE IMAGENS</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
            onClick={() => handleButtonClick('rating-curve')}
          >
            <LineChart className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">CONSTRUÇÃO DE CURVA CHAVE</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
            onClick={() => handleButtonClick('sediments')}
          >
            <BarChart className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">ANÁLISE DE SEDIMENTOS</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
            onClick={() => handleButtonClick('flow')}
          >
            <Droplet className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">VAZÕES</span>
          </Button>

          <Button
            variant="outline"
            className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
            onClick={() => handleButtonClick('water-quality')}
          >
            <GlassWater className="h-8 w-8 text-blue-600" />
            <span className="font-semibold">ANÁLISES QUALIDADE DE ÁGUA</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analysis;