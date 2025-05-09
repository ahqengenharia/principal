import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabaseSchema';

interface ReportVersion {
  id: string;
  report_id: string;
  version: number;
  modified_by: string;
  modified_at: string;
  changes: string;
}

interface AccessLog {
  id: string;
  report_id: string;
  accessed_by: string;
  accessed_at: string;
  ip_address: string;
}

const ReportVersionHistory = ({ reportId }: { reportId: string }) => {
  const { data: versions } = useQuery({
    queryKey: ['reportVersions', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_versions')
        .select('*')
        .eq('report_id', reportId)
        .order('version', { ascending: false });
      
      if (error) throw error;
      return data as ReportVersion[];
    },
  });

  const { data: accessLogs } = useQuery({
    queryKey: ['reportAccess', reportId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('report_access_logs')
        .select('*')
        .eq('report_id', reportId)
        .order('accessed_at', { ascending: false });
      
      if (error) throw error;
      return data as AccessLog[];
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Versões</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Versão</TableHead>
                  <TableHead>Modificado por</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Alterações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions?.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell>{version.version}</TableCell>
                    <TableCell>{version.modified_by}</TableCell>
                    <TableCell>
                      {new Date(version.modified_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{version.changes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Acessos</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessLogs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.accessed_by}</TableCell>
                    <TableCell>
                      {new Date(log.accessed_at).toLocaleString()}
                    </TableCell>
                    <TableCell>{log.ip_address}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportVersionHistory;