import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReportStepIndicator from './ReportStepIndicator';
import ReportProgressBar from './ReportProgressBar';

export const REPORT_STEPS = [
  "Entrada de dados estações telemetricas",
  "Entrada de dados de Campo",
  "Consistência de Dados",
  "Consolidação e Construção Curva Chave",
  "Análises Sedimentos e Qualidade da Água",
  "Assinaturas do Relatório"
] as const;

interface ReportStepControlProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ReportStepControl = ({
  currentStep,
  completedSteps,
  onStepClick,
  onNext,
  onPrevious
}: ReportStepControlProps) => {
  const progress = (completedSteps.length / REPORT_STEPS.length) * 100;

  return (
    <div className="w-full space-y-6 p-4 bg-white rounded-lg shadow-md">
      <ReportProgressBar progress={progress} />
      
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-4">
        {REPORT_STEPS.map((_, index) => (
          <div key={index} className="flex items-center">
            <ReportStepIndicator
              step={index + 1}
              isCompleted={completedSteps.includes(index)}
              isActive={currentStep === index}
              onClick={() => onStepClick(index)}
            />
            {index < REPORT_STEPS.length - 1 && (
              <div className="w-8 h-0.5 bg-gray-300 mx-2" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={currentStep === REPORT_STEPS.length - 1}
          className="flex items-center gap-2"
        >
          Avançar
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReportStepControl;