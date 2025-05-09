
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Save, ChevronRight, Upload } from "lucide-react";

interface TemplateMetadata {
  usinaName: string;
  groupName: string;
  estacaoName: string;
  geoCoordinates: string;
  technicalManager: string;
}

interface TemplateAssistantProps {
  metadata: TemplateMetadata;
  onUpdateMetadata: (metadata: TemplateMetadata) => void;
  templateLoaded: boolean;
  onTemplateUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const TemplateAssistant = ({ 
  metadata, 
  onUpdateMetadata, 
  templateLoaded, 
  onTemplateUpload 
}: TemplateAssistantProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("customize");
  const [localMetadata, setLocalMetadata] = useState<TemplateMetadata>(metadata);
  const [step, setStep] = useState(1);
  
  // Update local metadata when props change
  useEffect(() => {
    setLocalMetadata(metadata);
  }, [metadata]);
  
  const handleInputChange = (key: keyof TemplateMetadata, value: string) => {
    setLocalMetadata({
      ...localMetadata,
      [key]: value
    });
  };
  
  const saveChanges = () => {
    onUpdateMetadata(localMetadata);
    toast({
      title: "Alterações salvas",
      description: "Os metadados do relatório foram atualizados."
    });
  };
  
  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Passo 1: Identificação da UHE</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Usina</label>
              <Input 
                value={localMetadata.usinaName} 
                onChange={(e) => handleInputChange('usinaName', e.target.value)}
                placeholder="Ex: UHE Exemplo"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome do Grupo</label>
              <Input 
                value={localMetadata.groupName} 
                onChange={(e) => handleInputChange('groupName', e.target.value)}
                placeholder="Ex: Grupo Energético"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} className="flex items-center gap-1">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Passo 2: Estação Telemétrica</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Estação</label>
              <Input 
                value={localMetadata.estacaoName} 
                onChange={(e) => handleInputChange('estacaoName', e.target.value)}
                placeholder="Ex: Estação Principal"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Coordenadas Geográficas</label>
              <Input 
                value={localMetadata.geoCoordinates} 
                onChange={(e) => handleInputChange('geoCoordinates', e.target.value)}
                placeholder="Ex: -23.5505, -46.6333"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
              <Button onClick={() => setStep(3)} className="flex items-center gap-1">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold">Passo 3: Responsáveis Técnicos</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Responsável Técnico</label>
              <Input 
                value={localMetadata.technicalManager} 
                onChange={(e) => handleInputChange('technicalManager', e.target.value)}
                placeholder="Ex: Eng. José Silva"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
              <Button onClick={saveChanges} className="flex items-center gap-1">
                <Save className="h-4 w-4" /> Salvar
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Assistente do Template
          <HelpCircle className="h-4 w-4 text-blue-500" />
        </CardTitle>
        <CardDescription>
          Navegue e personalize seu relatório anual
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!templateLoaded ? (
          <div className="text-center p-6 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-600 mb-4">Faça upload de um template para começar.</p>
            {onTemplateUpload && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2 mx-auto"
                onClick={() => document.getElementById('assistant-template-upload')?.click()}
              >
                <Upload className="h-4 w-4" />
                Carregar Template
                <input
                  id="assistant-template-upload"
                  type="file"
                  accept=".doc,.docx"
                  onChange={onTemplateUpload}
                  className="hidden"
                />
              </Button>
            )}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customize">Personalizar</TabsTrigger>
              <TabsTrigger value="navigate">Navegar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="customize" className="mt-4">
              {getStepContent()}
            </TabsContent>
            
            <TabsContent value="navigate" className="mt-4">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Navegue entre as seções do relatório:</p>
                
                <div className="space-y-2">
                  {["Identificação", "Dados Cadastrais", "Estações Telemétricas", 
                    "Dados de Vazão", "Análise de Consistência", "Curva de Descarga", 
                    "Conclusões"].map((section) => (
                      <Button 
                        key={section}
                        variant="outline" 
                        className="w-full justify-start text-left"
                      >
                        <ChevronRight className="h-4 w-4 mr-2" /> {section}
                      </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default TemplateAssistant;
