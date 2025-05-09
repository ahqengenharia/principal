import React from 'react';
import { Input } from "@/components/ui/input";

export interface ChatbotData {
  codigoANA: string;
  estacaoTelemetrica: string;
  tipoDados: string;
  periodoMedicao: string;
}

interface ChatbotFormProps {
  data: ChatbotData;
  onInputChange: (field: keyof ChatbotData, value: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ChatbotForm = ({ data, onInputChange, onFileChange }: ChatbotFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Input
        type="text"
        placeholder="Código ANA"
        value={data.codigoANA}
        onChange={(e) => onInputChange('codigoANA', e.target.value)}
      />
      <Input
        type="text"
        placeholder="Estação Telemétrica"
        value={data.estacaoTelemetrica}
        onChange={(e) => onInputChange('estacaoTelemetrica', e.target.value)}
      />
      <Input
        type="text"
        placeholder="Dados de Rio ou Pluviométricos?"
        value={data.tipoDados}
        onChange={(e) => onInputChange('tipoDados', e.target.value)}
      />
      <Input
        type="text"
        placeholder="Período de Medição"
        value={data.periodoMedicao}
        onChange={(e) => onInputChange('periodoMedicao', e.target.value)}
      />
      <Input
        type="file"
        onChange={onFileChange}
        className="cursor-pointer"
      />
    </div>
  );
};

export default ChatbotForm;