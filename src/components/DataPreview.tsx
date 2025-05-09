import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface DataPreviewProps {
  data: any[];
  onContinue: () => void;
}

const DataPreview = ({ data, onContinue }: DataPreviewProps) => {
  const { toast } = useToast();
  
  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Prévia dos Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i}>
                  {columns.map((column) => (
                    <TableCell key={column}>{row[column]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <Button 
          onClick={() => {
            onContinue();
            toast({
              title: "Processamento concluído",
              description: "Os dados foram salvos com sucesso",
            });
          }}
          className="mt-4 w-full"
        >
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataPreview;