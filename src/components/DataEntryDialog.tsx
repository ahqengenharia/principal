import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Eye, FileSpreadsheet, Send } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DataEntryDialogProps {
  onClose: () => void;
}

const DataEntryDialog = ({ onClose }: DataEntryDialogProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<any[]>([]);
  const [messages, setMessages] = useState<{ text: string; sender: 'user' | 'bot' }[]>([
    { text: 'Olá! Qual o código ANA?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [data, setData] = useState({
    codigoANA: '',
    estacaoTelemetrica: '',
    tipoDados: '',
  });
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        setFileContent(Array.isArray(content) ? content : [content]);
        setUploadComplete(true);
        
        toast({
          title: "Arquivo carregado com sucesso",
          description: "O conteúdo do arquivo está pronto para visualização.",
        });
      } catch (error) {
        toast({
          title: "Erro ao ler arquivo",
          description: "O arquivo deve estar no formato JSON válido.",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const handleExportToExcel = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/data/export-excel', {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Falha ao exportar dados');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dados_exportados.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Exportação concluída",
        description: "Dados exportados com sucesso para Excel.",
      });
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados para Excel.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    let botResponse = '';
    if (!data.codigoANA) {
      setData(prev => ({ ...prev, codigoANA: input }));
      botResponse = 'Qual estação telemétrica?';
    } else if (!data.estacaoTelemetrica) {
      setData(prev => ({ ...prev, estacaoTelemetrica: input }));
      botResponse = 'Dados de Rio ou Pluviométricos?';
    } else if (!data.tipoDados) {
      setData(prev => ({ ...prev, tipoDados: input }));
      botResponse = 'Agora você pode fazer upload do arquivo JSON.';
    }

    if (botResponse) {
      setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
    }
    
    setInput('');
  };

  return (
    <div className="space-y-4">
      <div className="h-96 overflow-y-auto p-4 border rounded-lg">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg mb-2 ${
              message.sender === 'user' 
                ? 'bg-blue-100 ml-auto max-w-[80%]' 
                : 'bg-gray-100 max-w-[80%]'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Digite sua mensagem..."
        />
        <Button onClick={handleSendMessage}>Enviar</Button>
      </div>

      <div className="mt-4 space-y-4">
        <Input
          type="file"
          onChange={handleFileUpload}
          accept=".json"
          className="cursor-pointer"
        />
        
        {uploadComplete && fileContent.length > 0 && (
          <Card className="p-4">
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {Object.keys(fileContent[0]).map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileContent.map((row, index) => (
                    <TableRow key={index}>
                      {Object.values(row).map((value, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            
            <Button
              onClick={handleExportToExcel}
              className="mt-4 w-full flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar para Excel
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DataEntryDialog;