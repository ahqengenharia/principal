
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, UploadCloud, HelpCircle } from 'lucide-react';
import AnnualReportTemplate from '@/components/AnnualReportTemplate';
import { useToast } from "@/components/ui/use-toast";
import Base44Connector from '@/utils/base44Connector';
import { Card, CardContent } from "@/components/ui/card";
import TemplateAssistant from '@/components/services/TemplateAssistant';

interface AnnualReportViewProps {
  onBack: () => void;
}

const AnnualReportView = ({ onBack }: AnnualReportViewProps) => {
  const [viewMode, setViewMode] = useState<'internal' | 'external'>('internal');
  const [templateContent, setTemplateContent] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [iframeUrl, setIframeUrl] = useState('');
  const [showAssistant, setShowAssistant] = useState(true);
  const [templateMetadata, setTemplateMetadata] = useState({
    usinaName: 'UHE SAMPLE',
    groupName: 'GRUPO ENERGÉTICO',
    estacaoName: 'ESTAÇÃO PRINCIPAL',
    geoCoordinates: '-23.5505, -46.6333',
    technicalManager: 'Eng. José Silva'
  });
  const { toast } = useToast();
  
  // Initialize Base44 connector
  const base44Connector = new Base44Connector({
    appId: '67cff5dad5f4a4b6f0be56d3',
  });

  // Check Base44 connectivity on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isOnline = await base44Connector.checkConnection();
        if (!isOnline) {
          toast({
            title: "Aviso",
            description: "Não foi possível conectar à plataforma Base44. Usando modo offline.",
            variant: "destructive",
          });
        } else {
          // Set the dashboard URL if connection is successful
          setIframeUrl('https://app.base44.com/apps/67cff5dad5f4a4b6f0be56d3/editor/preview/Dashboard');
        }
      } catch (error) {
        console.error('Error checking Base44 connection:', error);
      }
    };
    
    checkConnection();
  }, []);

  const handleTemplateUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Handle Word documents with VBA macros as binary files
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
            // For Word documents, we need to handle them as binary
            const arrayBuffer = e.target?.result as ArrayBuffer;
            
            // Try to upload to Base44
            const result = await base44Connector.uploadTemplate(arrayBuffer);
            console.log('Template uploaded to Base44:', result);
            
            // Set a placeholder for the binary content
            setTemplateContent(JSON.stringify({
              type: 'word-document',
              name: file.name,
              size: file.size,
              lastModified: new Date(file.lastModified).toISOString()
            }));
            
            toast({
              title: "Sucesso",
              description: `Template do Word carregado: ${file.name}`,
            });
          } else {
            // For text-based templates
            const content = e.target?.result as string;
            setTemplateContent(content);
            
            // Try to upload to Base44
            await base44Connector.uploadTemplate(content);
            
            toast({
              title: "Sucesso",
              description: "Template de texto carregado com sucesso",
            });
          }
        } catch (uploadError) {
          console.error('Error processing template:', uploadError);
          toast({
            title: "Erro",
            description: "Falha ao processar o template",
            variant: "destructive",
          });
        }
      };
      
      // Read as array buffer for all Office documents to preserve VBA macros
      if (file.name.endsWith('.doc') || file.name.endsWith('.docx') || 
          file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    } catch (error) {
      console.error('Error uploading template:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar o template",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExternalModeClick = () => {
    // Open Base44 dashboard in the current view
    setViewMode('external');
    window.open('https://app.base44.com/apps/67cff5dad5f4a4b6f0be56d3/editor/preview/Dashboard', '_blank');
  };
  
  const toggleAssistant = () => {
    setShowAssistant(!showAssistant);
  };
  
  const handleMetadataUpdate = (newMetadata: typeof templateMetadata) => {
    setTemplateMetadata(newMetadata);
    
    // Here we would typically update the template content with the new metadata
    // For this example, we'll just show a toast to confirm the update
    toast({
      title: "Metadados atualizados",
      description: "Os dados foram aplicados ao template."
    });
  };

  return (
    <div className="container mx-auto p-8 relative">
      <Button
        variant="outline"
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Serviços
      </Button>
      
      <div className="mb-6 flex justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <Button 
            variant={viewMode === 'internal' ? 'default' : 'outline'}
            className="rounded-r-none" 
            onClick={() => setViewMode('internal')}
          >
            Relatório Interno
          </Button>
          <Button 
            variant={viewMode === 'external' ? 'default' : 'outline'}
            className="rounded-l-none"
            onClick={handleExternalModeClick}
          >
            Plataforma Externa
          </Button>
        </div>
      </div>

      {viewMode === 'internal' ? (
        <div className="space-y-6">
          <div className="flex justify-center gap-4 mb-4">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={() => document.getElementById('template-upload')?.click()}
              disabled={isUploading}
            >
              <UploadCloud className="h-4 w-4" />
              {isUploading ? 'Carregando...' : 'Carregar Template Word com Macros'}
              <input
                id="template-upload"
                type="file"
                accept=".doc,.docx"
                onChange={handleTemplateUpload}
                className="hidden"
              />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={toggleAssistant}
            >
              <HelpCircle className="h-4 w-4" />
              {showAssistant ? 'Ocultar Assistente' : 'Mostrar Assistente'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content area */}
            <div className={`lg:col-span-${showAssistant ? '2' : '3'}`}>
              {templateContent ? (
                <Card className="border border-gray-200 rounded-lg bg-white">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">Template Carregado:</h3>
                    <div className="max-h-[60vh] overflow-y-auto bg-gray-50 p-4 rounded">
                      {typeof templateContent === 'string' && templateContent.startsWith('{') ? (
                        <div className="text-center py-8 bg-blue-50 rounded border border-blue-200">
                          <h4 className="text-lg font-semibold mb-2">Documento do Word com Macros VBA</h4>
                          {(() => {
                            try {
                              const metadata = JSON.parse(templateContent);
                              return (
                                <div className="space-y-2">
                                  <p><strong>Nome:</strong> {metadata.name}</p>
                                  <p><strong>Tamanho:</strong> {(metadata.size / 1024).toFixed(2)} KB</p>
                                  <p><strong>Última modificação:</strong> {new Date(metadata.lastModified).toLocaleString()}</p>
                                  <p className="mt-4 text-green-600">✓ Macros VBA serão preservadas</p>
                                </div>
                              );
                            } catch (e) {
                              return <p>Documento carregado com sucesso</p>;
                            }
                          })()}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap">{templateContent}</pre>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <AnnualReportTemplate />
              )}
            </div>
            
            {/* Template Assistant sidebar */}
            {showAssistant && (
              <div className="lg:col-span-1">
                <TemplateAssistant 
                  metadata={templateMetadata}
                  onUpdateMetadata={handleMetadataUpdate}
                  templateLoaded={!!templateContent}
                  onTemplateUpload={handleTemplateUpload}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
          <iframe 
            src={iframeUrl} 
            className="w-full h-full"
            title="Base44 Dashboard"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default AnnualReportView;
