import React from 'react';
import { Button } from "@/components/ui/button";
import { Database, Cloud, LineChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ServiceButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mt-8">
      <Button
        variant="outline"
        onClick={() => navigate('/data-management')}
        className="h-32 bg-transparent hover:bg-white/10 border-2 border-[#00FF00] text-[#00FF00] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 backdrop-blur-sm"
      >
        <Database className="h-8 w-8" />
        <span className="font-semibold">Gestão de Dados</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => navigate('/services')}
        className="h-32 bg-transparent hover:bg-white/10 border-2 border-[#00FFFF] text-[#00FFFF] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 backdrop-blur-sm"
      >
        <Cloud className="h-8 w-8" />
        <span className="font-semibold">Serviços Online</span>
      </Button>

      <Button
        variant="outline"
        onClick={() => navigate('/analysis')}
        className="h-32 bg-transparent hover:bg-white/10 border-2 border-[#00FF00] text-[#00FF00] flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 backdrop-blur-sm"
      >
        <LineChart className="h-8 w-8" />
        <span className="font-semibold">Análises</span>
      </Button>
    </div>
  );
};

export default ServiceButtons;