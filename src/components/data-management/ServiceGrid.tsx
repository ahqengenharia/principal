import React from 'react';
import { CardContent } from "@/components/ui/card";
import ServiceButton from '@/components/ServiceButton';
import { 
  FileInput, 
  FileEdit, 
  FileText, 
  Send, 
  Mail, 
  Database, 
  Droplet, 
  Layout,
  FileType2,
  Smartphone
} from 'lucide-react';

const ServiceGrid = () => {
  const services = [
    {
      title: "ENTRADA DE DADOS",
      icon: <FileInput className="h-8 w-8" />,
      endpoint: "/data-management/input"
    },
    {
      title: "ALTERAÇÃO DE DADOS",
      icon: <FileEdit className="h-8 w-8" />,
      endpoint: "/api/data/edit"
    },
    {
      title: "DISPOSITIVOS MÓVEIS E WHATSAPP",
      icon: <Smartphone className="h-8 w-8" />,
      endpoint: "/api/mobile/whatsapp"
    },
    {
      title: "ENVIAR RELATÓRIO INTERNO",
      icon: <FileText className="h-8 w-8" />,
      endpoint: "/api/data/internal-report"
    },
    {
      title: "ENVIAR RELATÓRIO EXTERNO",
      icon: <Send className="h-8 w-8" />,
      endpoint: "/api/data/external-report"
    },
    {
      title: "ENVIAR POR EMAIL",
      icon: <Mail className="h-8 w-8" />,
      endpoint: "/api/data/email"
    },
    {
      title: "BANCO DE DADOS CLIENTE",
      icon: <Database className="h-8 w-8" />,
      endpoint: "/api/data/client-db"
    },
    {
      title: "BANCO DE DADOS MODELAGEM HÍDRICA",
      icon: <Droplet className="h-8 w-8" />,
      endpoint: "/api/data/hydric-model"
    },
    {
      title: "GESTÃO VISTA",
      icon: <Layout className="h-8 w-8" />,
      endpoint: "/api/data/management-view"
    },
    {
      title: "TRANSFORMAÇÃO DE ARQUIVOS",
      icon: <FileType2 className="h-8 w-8" />,
      endpoint: "https://www.ilovepdf.com/pt"
    }
  ];

  return (
    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {services.map((service, index) => (
        <ServiceButton
          key={index}
          title={service.title}
          icon={service.icon}
          endpoint={service.endpoint}
        />
      ))}
    </CardContent>
  );
};

export default ServiceGrid;