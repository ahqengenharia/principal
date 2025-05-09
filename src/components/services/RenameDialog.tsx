
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Save } from 'lucide-react';

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

const RenameDialog = ({ open, onOpenChange, fileName, setFileName }: RenameDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renomear Arquivo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Nome do arquivo"
          />
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            variant="secondary"
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RenameDialog;
