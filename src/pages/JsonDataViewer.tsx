import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JsonPreview {
  fields: string[];
  values: Record<string, any>[];
  summary: {
    total_rows: number;
    total_columns: number;
  };
  raw_json: any;
}

const JsonDataViewer = () => {
  const navigate = useNavigate();
  
  const { data: jsonData, isLoading, error } = useQuery<JsonPreview>({
    queryKey: ['jsonPreview'],
    queryFn: async () => {
      const response = await fetch('/api/data/preview');
      if (!response.ok) {
        throw new Error('Falha ao buscar dados JSON');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return <div className="p-8 text-center">Carregando dados...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Erro ao carregar dados</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <Button
        variant="outline"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Button>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Resumo dos Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Total de Registros:</p>
              <p>{jsonData?.summary.total_rows}</p>
            </div>
            <div>
              <p className="font-semibold">Total de Campos:</p>
              <p>{jsonData?.summary.total_columns}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Visualização em Tabela</TabsTrigger>
          <TabsTrigger value="json">Visualização JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Dados em Tabela</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {jsonData?.fields.map((field, index) => (
                        <TableHead key={index} className="font-bold">
                          {field}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jsonData?.values.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {jsonData.fields.map((field, colIndex) => (
                          <TableCell key={colIndex}>
                            {JSON.stringify(row[field])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Dados JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] w-full rounded-md border bg-gray-50 p-4">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(jsonData?.raw_json, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JsonDataViewer;