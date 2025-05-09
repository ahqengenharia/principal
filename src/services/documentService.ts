
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";

export const fetchDocumentFromAPI = async () => {
  console.log('Fetching document template from API...');
  
  const response = await fetch('/api/template/fetch-google-drive-template');
  
  if (!response.ok) {
    throw new Error(`API response error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.content) {
    throw new Error('No content received from API');
  }
  
  console.log('Document loaded successfully');
  return data.content;
};

export const fetchDocumentFromSupabase = async () => {
  console.log('Falling back to Supabase...');
  const { data, error } = await supabase
    .from('templates')
    .select('content')
    .single();

  if (error) {
    throw error;
  }

  return data?.content;
};

export const createDefaultTemplate = async () => {
  const defaultContent = '<p>Template padrão - Faça upload de um novo modelo ou aguarde o carregamento do template online.</p>';
  const { error } = await supabase
    .from('templates')
    .insert({ content: defaultContent, id: 1 });

  if (error) {
    throw error;
  }

  return defaultContent;
};

export const uploadDocumentToAPI = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/template/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload template');
  }
  
  return await response.json();
};

export const uploadDocumentToSupabase = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('templates')
    .upload(`documents/${file.name}`, file);

  if (error) {
    throw error;
  }

  return data;
};

export const saveDocumentToAPI = async (content: string) => {
  const response = await fetch('/api/template/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save content to API');
  }
  
  return await response.json();
};

export const saveDocumentToSupabase = async (content: string) => {
  const { error } = await supabase
    .from('templates')
    .upsert({ id: 1, content });

  if (error) {
    throw error;
  }

  return content;
};
