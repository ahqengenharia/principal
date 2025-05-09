
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Database, Check, X, RefreshCw, Table, AlertCircle } from "lucide-react";
import { databaseService } from '@/services/databaseService';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

const PostgresConnectionManager = () => {
  const [status, setStatus] = useState({
    connected: false,
    checking: false
  });
  const [config, setConfig] = useState({
    host: '',
    port: '5432',
    database: '',
    user: '',
    password: ''
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const checkConnection = async () => {
    if (isBrowser) {
      toast({
        title: "Funcionalidade indisponível no navegador",
        description: "Conexões PostgreSQL não são suportadas diretamente no navegador. Esta funcionalidade está disponível apenas no servidor.",
        variant: "destructive",
      });
      return;
    }

    setStatus(prev => ({ ...prev, checking: true }));
    try {
      const connected = await databaseService.connect({
        host: config.host,
        port: parseInt(config.port),
        database: config.database,
        user: config.user,
        password: config.password
      });
      
      setStatus({
        connected,
        checking: false
      });
      
      toast({
        title: connected 
          ? "Conexão PostgreSQL estabelecida" 
          : "Falha na conexão PostgreSQL",
        description: connected 
          ? `Conectado ao banco de dados: ${config.database}` 
          : "Verifique suas credenciais e configurações",
        variant: connected ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      setStatus({
        connected: false,
        checking: false
      });
      
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o status da conexão PostgreSQL",
        variant: "destructive",
      });
    }
  };

  const disconnectDatabase = async () => {
    if (isBrowser) {
      return;
    }
    
    if (status.connected) {
      await databaseService.disconnect();
      setStatus({
        connected: false,
        checking: false
      });
      
      toast({
        title: "Desconectado",
        description: "Conexão com o PostgreSQL encerrada",
      });
    }
  };

  // If in browser, display a notice
  if (isBrowser) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <CardTitle>Conexão PostgreSQL</CardTitle>
            </div>
            <Badge variant="destructive" className="bg-yellow-500 text-white">
              Indisponível no navegador
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-800 rounded-md">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">
              Conexões diretas com PostgreSQL não são suportadas no navegador. Esta funcionalidade requer um ambiente de servidor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle>Conexão PostgreSQL</CardTitle>
          </div>
          <Badge 
            variant={status.connected ? "default" : "destructive"}
            className={`${status.connected ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {status.checking ? 'Verificando...' : (status.connected ? 'Conectado' : 'Desconectado')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">Host</Label>
            <Input 
              id="host" 
              name="host" 
              value={config.host} 
              onChange={handleChange} 
              placeholder="localhost"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="port">Porta</Label>
            <Input 
              id="port" 
              name="port" 
              value={config.port} 
              onChange={handleChange} 
              placeholder="5432"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="database">Banco de Dados</Label>
          <Input 
            id="database" 
            name="database" 
            value={config.database} 
            onChange={handleChange} 
            placeholder="postgres"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="user">Usuário</Label>
            <Input 
              id="user" 
              name="user" 
              value={config.user} 
              onChange={handleChange} 
              placeholder="postgres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              value={config.password} 
              onChange={handleChange} 
              placeholder="********"
            />
          </div>
        </div>
        
        {status.connected && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <div className="flex items-center space-x-2 text-green-500">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">Conectado ao banco de dados</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={disconnectDatabase} 
          disabled={!status.connected}
          variant="outline"
        >
          Desconectar
        </Button>
        <Button 
          onClick={checkConnection} 
          disabled={status.checking}
          variant="default"
        >
          {status.checking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Conectar
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostgresConnectionManager;
