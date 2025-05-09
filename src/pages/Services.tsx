
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/BackButton';
import { ArrowLeft } from 'lucide-react';

// Import refactored components
import ServicesList from '@/components/services/ServicesList';
import RenameDialog from '@/components/services/RenameDialog';
import AnnualReportView from '@/components/services/AnnualReportView';

const Services = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showAnnualReport, setShowAnnualReport] = useState(false);
  const [newFileName, setNewFileName] = useState('Template relatório');
  const [templateBlob, setTemplateBlob] = useState<Blob | null>(null);
  const [clientData, setClientData] = useState({
    razao_social: "NOME DA UHE",
    grupo: "NOME DO GRUPO DO CLIENTE",
    responsavel_tecnico: "Responsável Técnico",
    numero_contrato: "123456",
    logotipo: "/assets/images/templates/LOGOAHQ.png"
  });

  const handleAnnualReport = () => {
    setShowAnnualReport(true);
    toast({
      title: "Carregando template",
      description: "Carregando o template do relatório anual",
    });
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleSupportClick = () => {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/:\/$/, '');
    const supportUrl = `${baseUrl}/api/services/support?${new URLSearchParams({
      razao_social: clientData?.razao_social || '',
      grupo: clientData?.grupo || '',
      numero_contrato: clientData?.numero_contrato || '',
      logotipo: clientData?.logotipo || ''
    })}`;
    
    console.log('Support URL:', supportUrl);
    window.open(supportUrl, '_blank');
  };

  if (showAnnualReport) {
    return <AnnualReportView onBack={() => setShowAnnualReport(false)} />;
  }

  return (
    <div className="container mx-auto p-8 relative min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
      </div>
      
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Serviços Online
      </h1>
      
      <Card className="bg-gradient-to-br from-blue-50 to-white">
        <ServicesList 
          onAnnualReport={handleAnnualReport} 
          onSupportClick={handleSupportClick} 
        />
      </Card>

      <Button
        variant="default"
        className="fixed bottom-8 right-8 bg-blue-900 hover:bg-blue-800 text-white shadow-lg flex items-center gap-2"
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Página Principal
      </Button>

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        fileName={newFileName}
        setFileName={setNewFileName}
      />
    </div>
  );
};

export default Services;
