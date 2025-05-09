
import React from 'react';
import { CardContent } from "@/components/ui/card";
import ServiceCard from './ServiceCard';
import { 
  FileText, 
  TreePine, 
  Clipboard, 
  Upload, 
  Radio, 
  HelpCircle,
  Droplet,
  Mountain,
  BarChart3,
  Factory,
  Signal,
  LayoutDashboard,
  BookOpen
} from 'lucide-react';

interface ServicesListProps {
  onAnnualReport: () => void;
  onSupportClick: () => void;
}

const ServicesList = ({ onAnnualReport, onSupportClick }: ServicesListProps) => {
  const services = [
    {
      title: "MODO RELATÓRIO ANUAL",
      icon: <FileText className="h-8 w-8" />,
      onClick: onAnnualReport
    },
    {
      title: "LEGISLAÇÃO HIDROLÓGICA",
      icon: <BookOpen className="h-8 w-8" />,
      endpoint: "/legislation"
    },
    {
      title: "MODO DE ESTUDOS AMBIENTAIS",
      icon: <TreePine className="h-8 w-8" />,
      endpoint: "/api/services/environmental-studies"
    },
    {
      title: "MODO DADOS DE CAMPO",
      icon: <Clipboard className="h-8 w-8" />,
      endpoint: "/api/services/field-data"
    },
    {
      title: "ENVIO DADOS PARA HIDRO",
      icon: <Upload className="h-8 w-8" />,
      endpoint: "/api/services/hydro-data"
    },
    {
      title: "CADASTRO DE ESTAÇÃO TELEMÉTRICA",
      icon: <Radio className="h-8 w-8" />,
      endpoint: "/api/services/telemetric-station"
    },
    {
      title: "SUPORTE AHQ USUÁRIO",
      icon: <HelpCircle className="h-8 w-8" />,
      onClick: onSupportClick
    },
    {
      title: "MODO ENTRADA DE DADOS ANÁLISES DE ÁGUA",
      icon: <Droplet className="h-8 w-8" />,
      endpoint: "/api/services/water-analysis"
    },
    {
      title: "MODO ENTRADA DE DADOS SEDIMENTOS",
      icon: <Mountain className="h-8 w-8" />,
      endpoint: "/api/services/sediments"
    },
    {
      title: "MODO CARTOGRAFIA E TOPOGRAFIA",
      icon: <BarChart3 className="h-8 w-8" />,
      endpoint: "/api/services/cartography"
    },
    {
      title: "DASHBOARD USINA",
      icon: <Factory className="h-8 w-8" />,
      endpoint: "/api/services/plant-dashboard"
    },
    {
      title: "DASHBOARD ESTAÇÕES",
      icon: <Signal className="h-8 w-8" />,
      endpoint: "/api/services/stations-dashboard"
    },
    {
      title: "DASHBOARD GERAL",
      icon: <LayoutDashboard className="h-8 w-8" />,
      endpoint: "/api/services/general-dashboard"
    }
  ];

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          title={service.title}
          icon={service.icon}
          onClick={service.onClick}
          endpoint={service.endpoint}
        />
      ))}
    </CardContent>
  );
};

export default ServicesList;
