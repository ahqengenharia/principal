import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FilePlus, Eye, Globe } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import BackButton from '@/components/BackButton';

const ImageBank = () => {
  const [showImage, setShowImage] = useState(false);

  return (
    <div className="container mx-auto p-8 relative">
      <BackButton />
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Banco de Imagens
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <Button
          variant="outline"
          className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
          onClick={() => console.log("Novo Projeto clicked")}
        >
          <FilePlus className="h-8 w-8 text-blue-600" />
          <span className="font-semibold">NOVO PROJETO</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
          onClick={() => setShowImage(true)}
        >
          <Eye className="h-8 w-8 text-blue-600" />
          <span className="font-semibold">VISUALIZAR PROJETO</span>
        </Button>

        <Button
          variant="outline"
          className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
          onClick={() => console.log("QGIS clicked")}
        >
          <Globe className="h-8 w-8 text-blue-600" />
          <span className="font-semibold">ACESSO AO QGIS</span>
        </Button>
      </div>

      <Dialog open={showImage} onOpenChange={setShowImage}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
          <img 
            src="/lovable-uploads/bc87f6f7-8eda-499e-815e-1a6caf34bc16.png"
            alt="Monitoramento Hidrológico"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageBank;