
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Save } from "lucide-react";

interface FieldDataStepProps {
  isLoading: boolean;
  fieldData: string;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>, stepName: string) => Promise<void>;
  handleSaveData: (stepName: string) => void;
}

const FieldDataStep = ({ isLoading, fieldData, handleUpload, handleSaveData }: FieldDataStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Entrada de Dados de Campo</h3>
      <div className="flex items-center gap-4">
        <Input
          type="file"
          id="field-data-upload"
          className="hidden"
          onChange={(e) => handleUpload(e, 'field')}
          accept=".xlsx,.csv,.json"
        />
        <Button
          onClick={() => document.getElementById('field-data-upload')?.click()}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Carregar Dados de Campo
        </Button>
        <Button
          onClick={() => handleSaveData('field')}
          disabled={isLoading || !fieldData}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Salvar Dados
        </Button>
      </div>
      {fieldData && (
        <div className="p-4 border rounded bg-gray-50">
          <p>{fieldData}</p>
        </div>
      )}
    </div>
  );
};

export default FieldDataStep;
