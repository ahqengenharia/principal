
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { REPORT_STEPS } from '@/components/report/ReportStepControl';

export const useReportState = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const handleStepClick = (step: number) => {
    if (completedSteps.includes(step) || step === currentStep) {
      setCurrentStep(step);
    } else {
      toast({
        title: "Ação não permitida",
        description: "Complete as etapas anteriores primeiro",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (currentStep < REPORT_STEPS.length - 1) {
      setCompletedSteps(prev => 
        prev.includes(currentStep) ? prev : [...prev, currentStep]
      );
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return {
    currentStep,
    completedSteps,
    handleStepClick,
    handleNext,
    handlePrevious
  };
};
