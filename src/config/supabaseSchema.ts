import { supabase } from '../lib/supabase';

// Types
export interface Template {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id?: number;
  codigo: string;
  titulo: string;
  conteudo: string;
  data_criacao: string;
  data_ultima_edicao: string;
  usuario_ultima_edicao: string;
  downloads_count: number;
  ips_acesso: string[];
  status: 'rascunho' | 'publicado' | 'arquivado';
  versao: number;
}

// Helper Functions
export const generateReportCode = () => {
  const timestamp = new Date().getTime().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `REL-${timestamp}-${random}`.toUpperCase();
};

// Database Operations
export const createReport = async (report: Omit<Report, 'id'>) => {
  console.log('Creating report:', report);
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert(report)
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      throw error;
    }
    console.log('Report created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error;
  }
};

export const getReport = async (id: number) => {
  console.log('Fetching report:', id);
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
    console.log('Report fetched successfully:', data);
    return data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};

// Initialize templates table if it doesn't exist
export const initializeTemplatesTable = async () => {
  try {
    console.log('Checking templates table...');
    const { error } = await supabase
      .from('templates')
      .select('id')
      .limit(1);

    if (error) {
      console.log('Creating templates table...');
      await supabase.rpc('create_templates_table');
      console.log('Templates table created successfully');
    } else {
      console.log('Templates table exists');
    }
  } catch (error) {
    console.error('Error initializing templates table:', error);
  }
};

// Call initialization on import
initializeTemplatesTable().catch(console.error);

export { supabase };