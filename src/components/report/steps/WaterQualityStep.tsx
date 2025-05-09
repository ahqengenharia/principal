
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";

interface WaterQualityStepProps {
  waterQuality: string;
  setWaterQuality: (value: string) => void;
  handleUpload: (event: React.ChangeEvent<HTMLInputElement>, stepName: string) => Promise<void>;
  handleSaveData: (stepName: string) => void;
}

const WaterQualityStep = ({ 
  waterQuality, 
  setWaterQuality, 
  handleUpload, 
  handleSaveData 
}: WaterQualityStepProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Análises Sedimentos e Qualidade da Água</h3>
      <Tabs defaultValue="sediments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sediments">Sedimentos</TabsTrigger>
          <TabsTrigger value="waterQuality">Qualidade da Água</TabsTrigger>
        </TabsList>
        <TabsContent value="sediments" className="space-y-4 p-4">
          <Input
            type="file"
            id="sediments-upload"
            className="hidden"
            onChange={(e) => handleUpload(e, 'sediments')}
            accept=".xlsx,.csv,.pdf"
          />
          <Button
            onClick={() => document.getElementById('sediments-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Carregar Laudos de Sedimentos
          </Button>
        </TabsContent>
        <TabsContent value="waterQuality" className="space-y-4 p-4">
          <Input
            type="file"
            id="water-quality-upload"
            className="hidden"
            onChange={(e) => handleUpload(e, 'waterQuality')}
            accept=".xlsx,.csv,.pdf"
          />
          <Button
            onClick={() => document.getElementById('water-quality-upload')?.click()}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Carregar Laudos de Qualidade da Água
          </Button>
          <Textarea 
            placeholder="Observações sobre a qualidade da água"
            value={waterQuality}
            onChange={(e) => setWaterQuality(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={() => handleSaveData('waterQuality')}>
            Salvar Análises
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WaterQualityStep;
