
import React from 'react';
import { Loader2 } from "lucide-react";

const DocumentLoading = () => {
  return (
    <div className="flex items-center justify-center h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
};

export default DocumentLoading;
