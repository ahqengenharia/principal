
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface SignaturesStepProps {
  signatures: {
    technicalResponsible: string;
    projectManager: string;
    clientRepresentative: string;
  };
  setSignatures: (signatures: any) => void;
  handleSaveData: (stepName: string) => void;
}

const SignaturesStep = ({ signatures, setSignatures, handleSaveData }: SignaturesStepProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Assinaturas do Relatório</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Responsável Técnico</label>
          <Input 
            placeholder="Nome do Responsável Técnico"
            value={signatures.technicalResponsible}
            onChange={(e) => setSignatures({...signatures, technicalResponsible: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gerente do Projeto</label>
          <Input 
            placeholder="Nome do Gerente do Projeto"
            value={signatures.projectManager}
            onChange={(e) => setSignatures({...signatures, projectManager: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Representante do Cliente</label>
          <Input 
            placeholder="Nome do Representante do Cliente"
            value={signatures.clientRepresentative}
            onChange={(e) => setSignatures({...signatures, clientRepresentative: e.target.value})}
          />
        </div>
        <Button 
          className="w-full mt-4"
          onClick={() => {
            handleSaveData('signatures');
            toast({
              title: "Relatório finalizado",
              description: "O relatório foi finalizado e está pronto para geração do PDF",
            });
          }}
        >
          Finalizar Relatório
        </Button>
      </div>
    </div>
  );
};

export default SignaturesStep;
