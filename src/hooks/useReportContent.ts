
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useReportContent = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [telemetryData, setTelemetryData] = useState('');
  const [fieldData, setFieldData] = useState('');
  const [dataConsistency, setDataConsistency] = useState('');
  const [ratingCurve, setRatingCurve] = useState('');
  const [waterQuality, setWaterQuality] = useState('');
  const [signatures, setSignatures] = useState({
    technicalResponsible: '',
    projectManager: '',
    clientRepresentative: ''
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, stepName: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('stepName', stepName);
      
      const response = await fetch('/api/report/upload-data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      toast({
        title: "Upload realizado com sucesso",
        description: `Arquivo ${file.name} carregado com sucesso para ${stepName}`,
      });

      // Update the corresponding state based on step
      if (stepName === 'telemetry') {
        setTelemetryData(`Dados de ${file.name} carregados com sucesso`);
      } else if (stepName === 'field') {
        setFieldData(`Dados de ${file.name} carregados com sucesso`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveData = (stepName: string) => {
    toast({
      title: "Dados salvos",
      description: `Dados para ${stepName} salvos com sucesso`,
    });
  };

  return {
    isLoading,
    telemetryData,
    setTelemetryData,
    fieldData,
    setFieldData,
    dataConsistency,
    setDataConsistency,
    ratingCurve,
    setRatingCurve,
    waterQuality,
    setWaterQuality,
    signatures,
    setSignatures,
    handleUpload,
    handleSaveData
  };
};
