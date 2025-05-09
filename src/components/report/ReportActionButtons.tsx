import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, PenLine, Upload, History, Search } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ReportActionButtonsProps {
  onNewReport: () => void;
  onEditReport: () => void;
  onUpload: () => void;
}

const ReportActionButtons = ({ onNewReport, onEditReport, onUpload }: ReportActionButtonsProps) => {
  const { toast } = useToast();

  const reportActions = [
    {
      title: "NOVO RELATÓRIO",
      icon: <Plus className="h-8 w-8" />,
      onClick: onNewReport
    },
    {
      title: "EDITAR RELATÓRIO",
      icon: <PenLine className="h-8 w-8" />,
      onClick: onEditReport
    },
    {
      title: "ANEXAR ARQUIVOS",
      icon: <Upload className="h-8 w-8" />,
      onClick: onUpload
    },
    {
      title: "HISTÓRICO DE VERSÕES",
      icon: <History className="h-8 w-8" />,
      onClick: () => toast({ 
        title: "Em desenvolvimento",
        description: "Funcionalidade em implementação"
      })
    },
    {
      title: "PESQUISAR RELATÓRIO",
      icon: <Search className="h-8 w-8" />,
      onClick: () => toast({
        title: "Em desenvolvimento",
        description: "Funcionalidade em implementação"
      })
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reportActions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
          onClick={action.onClick}
        >
          {action.icon}
          <span className="font-semibold text-center">{action.title}</span>
        </Button>
      ))}
    </div>
  );
};

export default ReportActionButtons;