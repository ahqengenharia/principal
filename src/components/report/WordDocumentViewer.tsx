
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DocumentToolbar from './DocumentToolbar';
import DocumentEditor from './DocumentEditor';
import DocumentLoading from './DocumentLoading';
import { useDocumentViewer } from '@/hooks/useDocumentViewer';

const WordDocumentViewer = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const {
    content,
    isLoading,
    isEditing,
    handleFileUpload,
    toggleEditing
  } = useDocumentViewer(editorRef);

  if (isLoading) {
    return <DocumentLoading />;
  }

  const handleUploadClick = () => {
    document.getElementById('document-upload')?.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Visualizador de Documento</span>
          <DocumentToolbar 
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            handleUploadClick={handleUploadClick}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DocumentEditor 
          content={content} 
          isEditing={isEditing} 
          ref={editorRef} 
        />
        <input
          type="file"
          id="document-upload"
          accept=".doc,.docx,.html,.htm"
          onChange={handleFileUpload}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};

export default WordDocumentViewer;
