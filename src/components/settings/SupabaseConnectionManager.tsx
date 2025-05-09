
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Database, Check, X, RefreshCw, Table } from "lucide-react";
import { supabaseService } from '@/services/supabaseService';

const SupabaseConnectionManager = () => {
  const [status, setStatus] = useState<{
    connected: boolean;
    version?: string;
    projectId?: string;
    tables?: string[];
    checking: boolean;
  }>({
    connected: false,
    checking: true
  });
  const { toast } = useToast();

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    try {
      const connectionStatus = await supabaseService.testConnection();
      let tables: string[] = [];
      
      if (connectionStatus.connected) {
        tables = await supabaseService.getTables();
      }
      
      setStatus({
        ...connectionStatus,
        tables,
        checking: false
      });
      
      toast({
        title: connectionStatus.connected 
          ? "Conexão com Supabase estabelecida" 
          : "Falha na conexão com Supabase",
        description: connectionStatus.connected 
          ? `Conectado ao projeto: ${connectionStatus.projectId}` 
          : "Verifique suas credenciais e configurações",
        variant: connectionStatus.connected ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Erro ao verificar conexão:', error);
      setStatus({
        connected: false,
        checking: false
      });
      
      toast({
        title: "Erro na verificação",
        description: "Não foi possível verificar o status da conexão com Supabase",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <CardTitle>Conexão Supabase</CardTitle>
          </div>
          <Badge 
            variant={status.connected ? "success" : "destructive"}
            className={`${status.connected ? 'bg-green-500' : 'bg-red-500'} text-white`}
          >
            {status.checking ? 'Verificando...' : (status.connected ? 'Conectado' : 'Desconectado')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status.connected && (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">ID do Projeto:</span>
              <span className="font-medium">{status.projectId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Versão:</span>
              <span className="font-medium">{status.version}</span>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Tabelas disponíveis:</h4>
              <div className="grid grid-cols-2 gap-2">
                {status.tables && status.tables.length > 0 ? (
                  status.tables.map(table => (
                    <div key={table} className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <Table className="h-4 w-4" />
                      <span className="text-sm">{table}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 col-span-2">Nenhuma tabela encontrada</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {!status.connected && !status.checking && (
          <div className="text-center py-4">
            <X className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-gray-500">Não foi possível estabelecer conexão com o Supabase.</p>
            <p className="text-sm text-gray-400 mt-2">
              Verifique se as variáveis de ambiente estão configuradas corretamente.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={checkConnection} 
          disabled={status.checking}
          className="w-full"
          variant="outline"
        >
          {status.checking ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Verificar Conexão
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SupabaseConnectionManager;
