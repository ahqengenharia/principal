
import React from 'react';
import ReportStepControl from './report/ReportStepControl';
import ReportHeader from './report/ReportHeader';
import ReportContent from './report/ReportContent';
import { useReportState } from '@/hooks/useReportState';

const AnnualReportTemplate = () => {
  const {
    currentStep,
    completedSteps,
    handleStepClick,
    handleNext,
    handlePrevious
  } = useReportState();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ReportHeader />
      
      <ReportStepControl
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      <ReportContent currentStep={currentStep} />
    </div>
  );
};

export default AnnualReportTemplate;
