
import { supabase } from '@/lib/supabase';

interface SupabaseStatus {
  connected: boolean;
  version?: string;
  projectId?: string;
}

export const supabaseService = {
  async testConnection(): Promise<SupabaseStatus> {
    try {
      console.log('Testando conexão com Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);
      
      if (error) throw error;
      
      // Obter informação do projeto Supabase
      const { data: projectData, error: projectError } = await supabase
        .rpc('get_project_info');
      
      // Get project ID from URL - using public getter method instead of protected property
      const supabaseUrl = 'https://azotnhzhyisqadvvaywj.supabase.co';
      const projectId = supabaseUrl.split('//')[1]?.split('.')[0] || 'azotnhzhyisqadvvaywj';
      
      return {
        connected: true,
        version: projectData?.version || 'Desconhecida',
        projectId: projectId || 'Desconhecido'
      };
    } catch (error) {
      console.error('Erro ao testar conexão com Supabase:', error);
      return { connected: false };
    }
  },

  async getTables(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_tables');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao obter tabelas:', error);
      return [];
    }
  },

  async getRowCount(table: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error(`Erro ao contar registros na tabela ${table}:`, error);
      return 0;
    }
  },

  async createTable(tableName: string, schema: Record<string, string>): Promise<boolean> {
    try {
      // Essa operação é feita via RPC para manter a segurança
      const { error } = await supabase
        .rpc('create_table', { 
          table_name: tableName,
          table_schema: JSON.stringify(schema)
        });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      return false;
    }
  }
};
