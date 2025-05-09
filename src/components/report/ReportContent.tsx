
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { REPORT_STEPS } from './ReportStepControl';
import { useReportContent } from '@/hooks/useReportContent';

// Import step components
import TelemetryDataStep from './steps/TelemetryDataStep';
import FieldDataStep from './steps/FieldDataStep';
import DataConsistencyStep from './steps/DataConsistencyStep';
import RatingCurveStep from './steps/RatingCurveStep';
import WaterQualityStep from './steps/WaterQualityStep';
import SignaturesStep from './steps/SignaturesStep';

interface ReportContentProps {
  currentStep: number;
}

const ReportContent = ({ currentStep }: ReportContentProps) => {
  const {
    isLoading,
    telemetryData,
    fieldData,
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
  } = useReportContent();

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // "Entrada de dados estações telemetricas"
        return (
          <TelemetryDataStep 
            isLoading={isLoading} 
            telemetryData={telemetryData} 
            handleUpload={handleUpload} 
            handleSaveData={handleSaveData} 
          />
        );

      case 1: // "Entrada de dados de Campo"
        return (
          <FieldDataStep 
            isLoading={isLoading} 
            fieldData={fieldData} 
            handleUpload={handleUpload} 
            handleSaveData={handleSaveData} 
          />
        );

      case 2: // "Consistência de Dados"
        return (
          <DataConsistencyStep 
            dataConsistency={dataConsistency} 
            setDataConsistency={setDataConsistency} 
            handleSaveData={handleSaveData} 
          />
        );

      case 3: // "Consolidação e Construção Curva Chave"
        return (
          <RatingCurveStep 
            ratingCurve={ratingCurve} 
            setRatingCurve={setRatingCurve} 
            handleSaveData={handleSaveData} 
          />
        );

      case 4: // "Análises Sedimentos e Qualidade da Água"
        return (
          <WaterQualityStep 
            waterQuality={waterQuality} 
            setWaterQuality={setWaterQuality} 
            handleUpload={handleUpload} 
            handleSaveData={handleSaveData} 
          />
        );

      case 5: // "Assinaturas do Relatório"
        return (
          <SignaturesStep 
            signatures={signatures} 
            setSignatures={setSignatures} 
            handleSaveData={handleSaveData} 
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <p>Conteúdo não disponível para esta etapa.</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          {REPORT_STEPS[currentStep]}
        </h2>
        
        {renderStepContent()}
      </CardContent>
    </Card>
  );
};

export default ReportContent;
