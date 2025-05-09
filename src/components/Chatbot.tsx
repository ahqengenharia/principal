import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import BackButton from './BackButton';

const Chatbot = () => {
  const { toast } = useToast()
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    codigoANA: '',
    estacaoTelemetrica: '',
    tipoDados: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    // Initial bot message
    setMessages([{ text: 'Olá! Qual o código ANA?', sender: 'bot' }]);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    setInput('');

    let botResponse = '';
    switch (step) {
      case 0:
        setData(prev => ({ ...prev, codigoANA: input }));
        botResponse = 'Qual estação telemétrica quer entrar com dados?';
        setStep(1);
        break;
      case 1:
        setData(prev => ({ ...prev, estacaoTelemetrica: input }));
        botResponse = 'Dados de Rio ou Pluviométricos?';
        setStep(2);
        break;
      case 2:
        setData(prev => ({ ...prev, tipoDados: input }));
        botResponse = 'Obrigado! Agora você pode fazer upload do arquivo com os dados.';
        setStep(3);
        break;
      default:
        botResponse = 'Desculpe, não entendi. Por favor, faça o upload do arquivo.';
    }

    setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('data', JSON.stringify(data));

    try {
      const response = await fetch('http://localhost/ahq/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Upload realizado com sucesso",
          description: `Arquivo ${selectedFile.name} (${selectedFile.type}) foi carregado.`,
        });
        setMessages(prev => [...prev, { text: `Arquivo ${selectedFile.name} carregado com sucesso.`, sender: 'bot' }]);
      } else {
        throw new Error('Falha no upload');
      }
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao fazer o upload do arquivo.",
        variant: "destructive",
      });
      setMessages(prev => [...prev, { text: "Ocorreu um erro ao fazer o upload do arquivo.", sender: 'bot' }]);
    }
  };

  return (
    <div className="relative">
      <BackButton />
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Chatbot - Gestão de Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 h-96 overflow-y-auto mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`p-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <Input 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua mensagem..."
            />
            <Button onClick={handleSendMessage}>Enviar</Button>
          </div>
          {step === 3 && (
            <div className="mt-4">
              <Input type="file" onChange={handleFileUpload} />
              {file && (
                <p className="mt-2">
                  Arquivo selecionado: {file.name} ({file.type})
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;