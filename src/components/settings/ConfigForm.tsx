import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from 'lucide-react';
import LogoUploader from '../LogoUploader';

interface ConfigFormProps {
  companyData: {
    razao_social: string;
    grupo: string;
    responsavel_tecnico: string;
  };
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  originalData: {
    razao_social: string;
    grupo: string;
    responsavel_tecnico: string;
  };
}

const ConfigForm = ({
  companyData,
  isLoading,
  handleInputChange,
  handleSubmit,
  originalData
}: ConfigFormProps) => {
  const hasChanges = JSON.stringify(companyData) !== JSON.stringify(originalData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="razao_social">Nome da Usina</Label>
          <Input
            id="razao_social"
            name="razao_social"
            value={companyData.razao_social}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="grupo">Nome do Grupo</Label>
          <Input
            id="grupo"
            name="grupo"
            value={companyData.grupo}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="responsavel_tecnico">Responsável Técnico</Label>
          <Input
            id="responsavel_tecnico"
            name="responsavel_tecnico"
            value={companyData.responsavel_tecnico}
            onChange={handleInputChange}
            className="w-full"
            placeholder="WAGNER TRISTÃO"
          />
        </div>

        <div>
          <Label>Logotipo da Empresa</Label>
          <LogoUploader />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full flex items-center justify-center gap-2"
        disabled={isLoading || !hasChanges}
      >
        <Save className="h-4 w-4" />
        {isLoading ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
};

export default ConfigForm;