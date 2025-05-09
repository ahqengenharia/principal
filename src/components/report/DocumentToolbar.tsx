
import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Save, Upload } from "lucide-react";

interface DocumentToolbarProps {
  isEditing: boolean;
  toggleEditing: () => void;
  handleUploadClick: () => void;
}

const DocumentToolbar = ({ isEditing, toggleEditing, handleUploadClick }: DocumentToolbarProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={toggleEditing}
        className="flex items-center gap-2"
        variant={isEditing ? "default" : "outline"}
      >
        {isEditing ? (
          <>
            <Save className="h-4 w-4" />
            Salvar
          </>
        ) : (
          <>
            <Edit className="h-4 w-4" />
            Editar
          </>
        )}
      </Button>
      <Button
        onClick={handleUploadClick}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        Enviar Novo Modelo
      </Button>
    </div>
  );
};

export default DocumentToolbar;
