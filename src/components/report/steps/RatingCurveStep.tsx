
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RatingCurveStepProps {
  ratingCurve: string;
  setRatingCurve: (value: string) => void;
  handleSaveData: (stepName: string) => void;
}

const RatingCurveStep = ({ ratingCurve, setRatingCurve, handleSaveData }: RatingCurveStepProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Consolidação e Construção Curva Chave</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-medium">Parâmetros da Curva</h4>
          <div className="space-y-2">
            <Input placeholder="Coeficiente a" />
            <Input placeholder="Expoente n" />
            <Input placeholder="Cota de referência h0" />
          </div>
          <Button onClick={() => {
            toast({
              title: "Curva calculada",
              description: "A curva-chave foi calculada com sucesso",
            });
          }}>
            Calcular Curva
          </Button>
        </div>
        <div className="border rounded p-4 flex items-center justify-center min-h-[200px] bg-gray-50">
          <div className="text-center">
            <FileText className="h-16 w-16 mx-auto text-gray-400" />
            <p className="mt-2">Visualização da Curva-Chave</p>
          </div>
        </div>
        <div className="col-span-1 md:col-span-2">
          <Textarea 
            placeholder="Observações sobre a curva-chave"
            value={ratingCurve}
            onChange={(e) => setRatingCurve(e.target.value)}
            className="min-h-[100px]"
          />
          <Button className="mt-2" onClick={() => handleSaveData('ratingCurve')}>
            Salvar Curva-Chave
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RatingCurveStep;
