import React, { useState, useEffect } from 'react';
import ModuleTemplate from './ModuleTemplate';
import { 
  fetchLegislationDocuments, 
  searchOnlineForLegislation,
  downloadLegislationDocument,
  type LegislationDocument 
} from '@/services/legislationService';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { FileText, FileSpreadsheet, File, Download, Search } from "lucide-react";

const Legislation = () => {
  const [documents, setDocuments] = useState<LegislationDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('ana-aneel');
  const { toast } = useToast();

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await fetchLegislationDocuments();
      setDocuments(docs);
    };
    
    loadDocuments();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Erro na pesquisa",
        description: "Por favor, digite um termo para pesquisar",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    try {
      const results = await searchOnlineForLegislation(searchQuery);
      setDocuments(results);
      setActiveTab('search-results');
      
      toast({
        title: "Pesquisa concluída",
        description: `${results.length} documentos encontrados`,
      });
    } catch (error) {
      toast({
        title: "Erro na pesquisa",
        description: "Não foi possível completar a pesquisa",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleDownload = async (document: LegislationDocument) => {
    try {
      await downloadLegislationDocument(document);
      toast({
        title: "Download iniciado",
        description: `Baixando ${document.title}`,
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o documento",
        variant: "destructive",
      });
    }
  };

  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'word':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'excel':
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
      case 'csv':
        return <File className="h-5 w-5 text-yellow-600" />;
      case 'pdf':
      default:
        return <FileText className="h-5 w-5 text-red-600" />;
    }
  };

  const filteredDocuments = (agency: string) => {
    return documents.filter(doc => 
      agency === 'all' || 
      doc.agency.toLowerCase() === agency.toLowerCase() ||
      (agency === 'ana-aneel' && (doc.agency === 'ANA' || doc.agency === 'ANEEL'))
    );
  };

  return (
    <ModuleTemplate title="Legislação Hidrológica para Usinas Hidrelétricas">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Pesquisar legislação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow"
              />
              <Button 
                onClick={handleSearch} 
                disabled={isSearching}
                className="flex items-center gap-2"
              >
                {isSearching ? "Pesquisando..." : "Pesquisar"}
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full mb-4">
                <TabsTrigger value="ana-aneel" className="flex-1">ANA/ANEEL</TabsTrigger>
                <TabsTrigger value="mma" className="flex-1">MMA</TabsTrigger>
                <TabsTrigger value="all" className="flex-1">Todos</TabsTrigger>
                {activeTab === 'search-results' && (
                  <TabsTrigger value="search-results" className="flex-1">Resultados da Pesquisa</TabsTrigger>
                )}
              </TabsList>
              
              {['ana-aneel', 'mma', 'all', 'search-results'].map(tab => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {filteredDocuments(tab).length === 0 ? (
                    <p className="text-center text-gray-500 py-8">
                      Nenhum documento encontrado
                    </p>
                  ) : (
                    filteredDocuments(tab).map(doc => (
                      <Card key={doc.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              {getDocumentIcon(doc.documentType)}
                              <div>
                                <h3 className="font-semibold">{doc.title}</h3>
                                <p className="text-sm text-gray-600">{doc.description}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {doc.tags.map(tag => (
                                    <span 
                                      key={tag} 
                                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex items-center gap-2"
                              onClick={() => handleDownload(doc)}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-sm text-gray-500">
          <p className="font-semibold mb-1">Sobre a legislação hidrológica:</p>
          <p>
            A Resolução ANA/ANEEL nº 127 de 2022 estabelece diretrizes e procedimentos para o monitoramento 
            hidrológico em usinas hidrelétricas. Este documento e seus anexos são essenciais para a 
            conformidade regulatória no setor.
          </p>
        </div>
      </div>
    </ModuleTemplate>
  );
};

export default Legislation;
