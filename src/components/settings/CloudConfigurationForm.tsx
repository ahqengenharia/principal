
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cloudIntegrationService } from '@/services/cloudIntegrationService';
import { Cloud, Database } from 'lucide-react';

const CloudConfigurationForm = () => {
  const [provider, setProvider] = useState<'aws' | 'databricks'>('aws');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    setIsLoading(true);
    try {
      await cloudIntegrationService.initializeCloudStorage({
        provider,
        region
      });

      await cloudIntegrationService.migrateToCloud(provider);

      toast({
        title: "Sucesso",
        description: `Migração para ${provider === 'aws' ? 'AWS' : 'Databricks'} iniciada com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao iniciar migração para a nuvem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Configuração de Nuvem</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={provider}
          onValueChange={(value: 'aws' | 'databricks') => setProvider(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o provedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="aws">
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                AWS
              </div>
            </SelectItem>
            <SelectItem value="databricks">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Databricks
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Região (ex: us-east-1)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <Button 
          onClick={handleMigration}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Iniciando Migração..." : "Iniciar Migração"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CloudConfigurationForm;
