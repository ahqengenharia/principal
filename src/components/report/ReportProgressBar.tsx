import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ReportProgressBarProps {
  progress: number;
}

const ReportProgressBar = ({ progress }: ReportProgressBarProps) => {
  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-gray-600 text-right">{Math.round(progress)}% Concluído</p>
    </div>
  );
};

export default ReportProgressBar;