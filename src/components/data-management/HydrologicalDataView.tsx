import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const HydrologicalDataView = () => {
  const [dataType, setDataType] = useState<'river' | 'rainfall'>('river');

  const { data, isLoading, error } = useQuery({
    queryKey: ['hydrological-data', dataType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(dataType === 'river' ? 'river_data' : 'rainfall_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  if (error) {
    return <div>Erro ao carregar dados</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Visualização de Dados</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={dataType}
          onValueChange={(value: 'river' | 'rainfall') => setDataType(value)}
        >
          <SelectTrigger className="mb-4">
            <SelectValue placeholder="Selecione o tipo de dados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="river">Dados de Rio</SelectItem>
            <SelectItem value="rainfall">Dados de Chuva</SelectItem>
          </SelectContent>
        </Select>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Rio</TableHead>
                <TableHead>Estação</TableHead>
                {dataType === 'river' ? (
                  <>
                    <TableHead>Nível (m)</TableHead>
                    <TableHead>Vazão (m³/s)</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>Precipitação (mm)</TableHead>
                    <TableHead>Temperatura (°C)</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((row: any) => (
                <TableRow key={row.id}>
                  <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.river_name}</TableCell>
                  <TableCell>{row.station_code}</TableCell>
                  {dataType === 'river' ? (
                    <>
                      <TableCell>{row.water_level}</TableCell>
                      <TableCell>{row.flow_rate}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{row.precipitation}</TableCell>
                      <TableCell>{row.dry_bulb_temp}</TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HydrologicalDataView;