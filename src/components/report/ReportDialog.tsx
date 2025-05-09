import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReportDialogProps {
  showDialog: boolean;
  setShowDialog: (show: boolean) => void;
  dialogMode: 'new' | 'edit' | 'view';
  formData: {
    titulo: string;
    conteudo: string;
    anexos: File[];
  };
  setFormData: (data: any) => void;
  handleCreateReport: () => Promise<void>;
}

const ReportDialog = ({
  showDialog,
  setShowDialog,
  dialogMode,
  formData,
  setFormData,
  handleCreateReport
}: ReportDialogProps) => {
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {dialogMode === 'new' ? 'Novo Relatório' : 
             dialogMode === 'edit' ? 'Editar Relatório' : 
             'Visualizar Relatório'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            value={formData.titulo}
            onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
            placeholder="Título do relatório"
            disabled={dialogMode === 'view'}
          />
          <Textarea
            value={formData.conteudo}
            onChange={(e) => setFormData(prev => ({ ...prev, conteudo: e.target.value }))}
            placeholder="Conteúdo do relatório"
            className="min-h-[200px]"
            disabled={dialogMode === 'view'}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setShowDialog(false)}
          >
            Cancelar
          </Button>
          {dialogMode !== 'view' && (
            <Button
              onClick={handleCreateReport}
            >
              {dialogMode === 'new' ? 'Criar' : 'Salvar'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;