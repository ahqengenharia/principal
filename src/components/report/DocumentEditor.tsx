
import React, { forwardRef } from 'react';

interface DocumentEditorProps {
  content: string;
  isEditing: boolean;
}

const DocumentEditor = forwardRef<HTMLDivElement, DocumentEditorProps>(
  ({ content, isEditing }, ref) => {
    return (
      <div 
        ref={ref}
        className={`prose max-w-none p-6 bg-white rounded-lg shadow ${isEditing ? 'border-2 border-blue-400 min-h-[400px]' : ''}`}
        dangerouslySetInnerHTML={{ __html: content }}
        contentEditable={isEditing}
      />
    );
  }
);

DocumentEditor.displayName = 'DocumentEditor';

export default DocumentEditor;
