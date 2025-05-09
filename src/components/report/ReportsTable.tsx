import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, PenLine, History } from 'lucide-react';

interface Report {
  id: string;
  codigo: string;
  titulo: string;
  data_criacao: string;
  data_ultima_edicao: string;
  status: string;
}

interface ReportsTableProps {
  reports: Report[];
  onEdit: (report: Report) => void;
  onView: (report: Report) => void;
  onHistory: (report: Report) => void;
}

const ReportsTable = ({ reports, onEdit, onView, onHistory }: ReportsTableProps) => {
  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Data Criação</TableHead>
            <TableHead>Última Edição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.codigo}</TableCell>
              <TableCell>{report.titulo}</TableCell>
              <TableCell>{new Date(report.data_criacao).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(report.data_ultima_edicao).toLocaleDateString()}</TableCell>
              <TableCell>{report.status}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(report)}
                >
                  <PenLine className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(report)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHistory(report)}
                >
                  <History className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};

export default ReportsTable;