import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  step: number;
  isCompleted: boolean;
  isActive: boolean;
  onClick: () => void;
}

const ReportStepIndicator = ({ step, isCompleted, isActive, onClick }: StepIndicatorProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center transition-colors relative",
        isCompleted ? "bg-green-500" : isActive ? "bg-blue-500" : "bg-red-500",
        "text-white hover:opacity-90"
      )}
    >
      {isCompleted ? (
        <Check className="w-6 h-6" />
      ) : (
        <span className="text-lg font-semibold">{step}</span>
      )}
    </button>
  );
};

export default ReportStepIndicator;