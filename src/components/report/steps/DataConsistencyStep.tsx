
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, FileSpreadsheet, Files } from 'lucide-react';
import { validateData } from '@/utils/dataValidation';
import { uploadFile } from '@/utils/fileUpload';

interface DataConsistencyStepProps {
  dataConsistency: string;
  setDataConsistency: (value: string) => void;
  handleSaveData: (stepName: string) => void;
}

const DataConsistencyStep = ({ dataConsistency, setDataConsistency, handleSaveData }: DataConsistencyStepProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileData, setFileData] = useState<any[]>([]);
  const [outliers, setOutliers] = useState<any[]>([]);
  const [validationMethod, setValidationMethod] = useState<'zScore' | 'modifiedZScore'>('zScore');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      toast({
        title: "Processando arquivo",
        description: `Carregando ${file.name}...`,
      });

      const result = await uploadFile(file, '/api/data/upload-consistency');
      
      if (result && result.data) {
        setFileData(result.data);
        toast({
          title: "Arquivo carregado com sucesso",
          description: `${file.name} foi processado. ${result.data.length} registros encontrados.`,
        });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível processar o arquivo. Verifique o formato.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleValidateData = async () => {
    if (fileData.length === 0) {
      toast({
        title: "Sem dados",
        description: "Faça upload de um arquivo para analisar.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const columnToAnalyze = Object.keys(fileData[0])[0]; // Default to first column
      
      // Validate data using Z-Score or Modified Z-Score
      const result = await validateData(fileData, columnToAnalyze, validationMethod);
      
      setOutliers(result.outliers);
      
      toast({
        title: "Análise concluída",
        description: `Encontrados ${result.outliers.length} possíveis outliers usando ${validationMethod === 'zScore' ? 'Z-Score' : 'Z-Score Modificado'}.`,
      });
      
      // Create analysis text
      const analysisText = `\n\nAnálise de ${new Date().toLocaleString()}: 
        - Método: ${validationMethod === 'zScore' ? 'Z-Score' : 'Z-Score Modificado'}
        - ${result.outliers.length} outliers encontrados em ${fileData.length} registros
        - Valores extremos: ${result.outliers.length > 0 ? result.outliers.slice(0, 3).map(o => o[columnToAnalyze]).join(', ') : 'Nenhum'}
        `;
      
      // Fix the TypeScript error by concatenating strings directly
      setDataConsistency(dataConsistency + analysisText);
    } catch (error) {
      console.error('Erro na validação:', error);
      toast({
        title: "Erro na validação",
        description: "Ocorreu um erro ao validar os dados.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Consistência de Dados</h3>
      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="validation">Validação</TabsTrigger>
          <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
          <TabsTrigger value="correction">Correção</TabsTrigger>
        </TabsList>
        
        <TabsContent value="validation" className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className={validationMethod === 'zScore' ? 'border-blue-500' : ''}
              onClick={() => setValidationMethod('zScore')}
            >
              Método Z-Score
            </Button>
            <Button 
              variant="outline"
              className={validationMethod === 'modifiedZScore' ? 'border-blue-500' : ''}
              onClick={() => setValidationMethod('modifiedZScore')}
            >
              Z-Score Modificado
            </Button>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md text-sm">
            {validationMethod === 'zScore' ? (
              <div>
                <p className="font-bold mb-2">Método Z-Score:</p>
                <p>Z=(X-μ_X)/σ_X ~N(0,1)</p>
                <p>Onde ZS=(x-x̄)/s_x</p>
                <p>Valores com |ZS| {">"} 3 são considerados outliers.</p>
              </div>
            ) : (
              <div>
                <p className="font-bold mb-2">Método Z-Score Modificado:</p>
                <p>MAD=mediana(|x-x̃|)</p>
                <p>ZSM=(0,6745(x-x̃))/MAD</p>
                <p>Valores com |ZSM| {">"} 3,5 são considerados outliers.</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={handleValidateData}
            disabled={isProcessing || fileData.length === 0}
            className="w-full"
          >
            {isProcessing ? 'Processando...' : 'Iniciar Validação'}
          </Button>
          
          {fileData.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Resumo dos Dados</h4>
                <p>Total de registros: {fileData.length}</p>
                
                <ScrollArea className="h-[200px] mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fileData.length > 0 && Object.keys(fileData[0]).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fileData.slice(0, 10).map((row, i) => (
                        <TableRow key={i}>
                          {Object.values(row).map((value: any, j) => (
                            <TableCell key={j}>
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                
                {outliers.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2 text-red-500">Outliers Detectados</h4>
                    <ScrollArea className="h-[200px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {Object.keys(outliers[0]).map((key) => (
                              <TableHead key={key}>{key}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {outliers.map((row, i) => (
                            <TableRow key={i} className="bg-red-50">
                              {Object.values(row).map((value: any, j) => (
                                <TableCell key={j}>
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-4 p-4">
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p>Faça upload de arquivos para análise de consistência de dados.</p>
            <p>Formatos suportados: Excel (.xlsx), CSV (.csv), Texto (.txt), PDF (.pdf)</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="grid grid-cols-4 gap-2">
                  <FileSpreadsheet className="mx-auto h-8 w-8 text-blue-500" />
                  <Files className="mx-auto h-8 w-8 text-green-500" />
                  <FileText className="mx-auto h-8 w-8 text-orange-500" />
                  <FileText className="mx-auto h-8 w-8 text-red-500" />
                </div>
              </div>
              <Input
                type="file"
                accept=".xlsx,.xls,.csv,.txt,.pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Button variant="outline" className="mb-2" disabled={isUploading}>
                  <Upload className="mr-2 h-4 w-4" />
                  {isUploading ? 'Carregando...' : 'Selecionar arquivo'}
                </Button>
                <p className="text-sm text-gray-500">
                  Arraste um arquivo ou clique para selecionar
                </p>
              </label>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="correction" className="space-y-4 p-4">
          <p>Correção manual de inconsistências encontradas nos dados.</p>
          <Textarea 
            placeholder="Insira observações sobre as correções realizadas"
            value={dataConsistency}
            onChange={(e) => setDataConsistency(e.target.value)}
            className="min-h-[150px]"
          />
          <Button onClick={() => handleSaveData('consistency')}>
            Salvar Correções
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataConsistencyStep;
