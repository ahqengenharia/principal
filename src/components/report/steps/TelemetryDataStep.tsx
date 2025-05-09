
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Save } from "lucide-react";
import WordDocumentViewer from '../WordDocumentViewer';

interface TelemetryDataStepProps {
  isLoading: boolean;
  telemetryData: string;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>, stepName: string) => Promise<void>;
  handleSaveData: (stepName: string) => void;
}

const TelemetryDataStep = ({ isLoading, telemetryData, handleUpload, handleSaveData }: TelemetryDataStepProps) => {
  return (
    <div className="space-y-6">
      <WordDocumentViewer />
      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-medium">Upload de Dados Telemétricos</h3>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            id="telemetry-upload"
            className="hidden"
            onChange={(e) => handleUpload(e, 'telemetry')}
            accept=".xlsx,.csv,.json"
          />
          <Button
            onClick={() => document.getElementById('telemetry-upload')?.click()}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Carregar Dados Telemétricos
          </Button>
          <Button
            onClick={() => handleSaveData('telemetry')}
            disabled={isLoading || !telemetryData}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar Dados
          </Button>
        </div>
        {telemetryData && (
          <div className="p-4 border rounded bg-gray-50">
            <p>{telemetryData}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelemetryDataStep;
