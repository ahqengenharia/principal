
import { toast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

export const handleJsonUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/data/process-json', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      toast({
        title: "Upload realizado",
        description: "Arquivo JSON processado com sucesso",
      });
      return result.preview;
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    throw error;
  }
};

export const handleFileUpload = async (file: File, endpoint: string) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Falha no upload');
  }

  return response;
};

export const uploadFile = async (file: File, endpoint: string) => {
  try {
    // For browser-side processing, we'll parse the file directly
    if (file.type === 'application/json') {
      const text = await file.text();
      const data = JSON.parse(text);
      return { success: true, data: Array.isArray(data) ? data : [data] };
    }
    
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const text = await file.text();
      const rows = text.split('\n');
      const headers = rows[0].split(',').map(h => h.trim());
      const data = [];
      
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === '') continue;
        
        const values = rows[i].split(',').map(v => v.trim());
        const row: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          const value = values[index];
          // Try to convert to number if possible
          const numValue = Number(value);
          row[header] = isNaN(numValue) ? value : numValue;
        });
        
        data.push(row);
      }
      
      return { success: true, data };
    }
    
    if (file.type.includes('spreadsheetml') || 
        file.name.endsWith('.xlsx') || 
        file.name.endsWith('.xls')) {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      return { success: true, data };
    }
    
    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim() !== '');
      
      // Try to determine delimiter: tab, comma, or space
      const firstLine = lines[0];
      let delimiter = '\t'; // default to tab
      
      if (firstLine.includes(',')) {
        delimiter = ',';
      } else if (!firstLine.includes('\t') && firstLine.includes(' ')) {
        delimiter = ' ';
      }
      
      const headers = lines[0].split(delimiter).map(h => h.trim());
      const data = [];
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(delimiter).map(v => v.trim());
        const row: Record<string, any> = {};
        
        headers.forEach((header, index) => {
          if (index < values.length) {
            const value = values[index];
            // Try to convert to number if possible
            const numValue = Number(value);
            row[header] = isNaN(numValue) ? value : numValue;
          }
        });
        
        data.push(row);
      }
      
      return { success: true, data };
    }
    
    // For PDF files, we would normally need a backend service
    // Since we're limited in browser capabilities for PDF parsing,
    // we'll show a message for now
    if (file.type === 'application/pdf') {
      toast({
        title: "PDF detectado",
        description: "Processamento de PDF requer backend. Este é um exemplo simplificado.",
      });
      
      // Return a mock structure
      return { 
        success: true, 
        data: [
          { valor: 123, data: '2023-01-01', estacao: 'EST-001' },
          { valor: 125, data: '2023-01-02', estacao: 'EST-001' },
          { valor: 12450, data: '2023-01-03', estacao: 'EST-001' }, // Outlier
          { valor: 124, data: '2023-01-04', estacao: 'EST-001' },
          { valor: 126, data: '2023-01-05', estacao: 'EST-001' },
        ] 
      };
    }
    
    // If in-browser processing isn't possible, try server endpoint
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Server upload error:', error);
      throw error;
    }
  } catch (error) {
    console.error('File processing error:', error);
    throw error;
  }
};
