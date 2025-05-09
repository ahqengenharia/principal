import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { createReport, getReport, generateReportCode, supabase } from '../config/supabaseSchema';
import ReportVersionHistory from './ReportVersionHistory';
import ReportActionButtons from './report/ReportActionButtons';
import ReportsTable from './report/ReportsTable';
import ReportDialog from './report/ReportDialog';
import FileUploadHandler from './report/FileUploadHandler';

const ReportManagementSystem = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<'new' | 'edit' | 'view'>('new');
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    anexos: [] as File[]
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      console.log('Fetching reports');
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) throw error;
      console.log('Reports fetched:', data);
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os relatórios",
        variant: "destructive"
      });
    }
  };

  const handleCreateReport = async () => {
    try {
      console.log('Creating new report');
      const reportCode = generateReportCode();
      const newReport = {
        codigo: reportCode,
        titulo: formData.titulo,
        conteudo: formData.conteudo,
        data_criacao: new Date().toISOString(),
        data_ultima_edicao: new Date().toISOString(),
        usuario_ultima_edicao: 'usuario_atual',
        downloads_count: 0,
        ips_acesso: [],
        status: 'rascunho' as const,
        versao: 1
      };

      await createReport(newReport);
      console.log('Report created successfully');
      
      toast({
        title: "Sucesso",
        description: `Relatório ${reportCode} criado com sucesso`
      });

      setShowDialog(false);
      fetchReports();
    } catch (error) {
      console.error('Error creating report:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o relatório",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="bg-gradient-to-br from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Sistema de Gestão de Relatórios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ReportActionButtons
            onNewReport={() => {
              setDialogMode('new');
              setShowDialog(true);
            }}
            onEditReport={() => {
              setDialogMode('edit');
              setShowDialog(true);
            }}
            onUpload={() => document.getElementById('file-upload')?.click()}
          />

          <ReportsTable
            reports={reports}
            onEdit={(report) => {
              setCurrentReport(report);
              setDialogMode('edit');
              setShowDialog(true);
            }}
            onView={(report) => {
              setCurrentReport(report);
              setDialogMode('view');
              setShowDialog(true);
            }}
            onHistory={(report) => {
              setCurrentReport(report);
              setDialogMode('view');
              setShowDialog(true);
            }}
          />
        </CardContent>
      </Card>

      <FileUploadHandler
        currentReportId={currentReport?.id}
        onUploadSuccess={fetchReports}
      />

      <ReportDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        dialogMode={dialogMode}
        formData={formData}
        setFormData={setFormData}
        handleCreateReport={handleCreateReport}
      />

      {currentReport && <ReportVersionHistory reportId={currentReport.id} />}
    </div>
  );
};

export default ReportManagementSystem;