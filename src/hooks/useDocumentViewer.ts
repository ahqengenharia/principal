
import { useState, RefObject } from 'react';
import { useDocumentLoader } from './useDocumentLoader';
import { useDocumentEditor } from './useDocumentEditor';
import { useDocumentUploader } from './useDocumentUploader';

export const useDocumentViewer = (editorRef: RefObject<HTMLDivElement>) => {
  const [isLoading, setIsLoading] = useState(true);
  
  const {
    content,
    loadDocument,
    setContent
  } = useDocumentLoader();
  
  const {
    isEditing,
    toggleEditing,
    saveContent
  } = useDocumentEditor(editorRef, content, setContent, setIsLoading);
  
  const {
    handleFileUpload
  } = useDocumentUploader(setContent, setIsLoading, loadDocument);

  return {
    content,
    isLoading,
    isEditing,
    loadDocument,
    handleFileUpload,
    toggleEditing,
    saveContent
  };
};
