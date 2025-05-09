
import PostgresConnector from '@/utils/postgresConnector';

interface DbConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

class DatabaseService {
  private static instance: DatabaseService;
  private postgresConnector: PostgresConnector | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Conecta ao banco de dados PostgreSQL
   */
  async connect(config: DbConfig): Promise<boolean> {
    if (isBrowser) {
      console.warn('Database connections are not supported in browser environments');
      return false;
    }
    
    try {
      this.postgresConnector = new PostgresConnector(config);
      this.isConnected = await this.postgresConnector.initialize();
      return this.isConnected;
    } catch (error) {
      console.error('Erro ao conectar ao banco de dados:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Executa uma consulta SQL
   */
  async query(sql: string, params: any[] = []): Promise<any> {
    if (isBrowser) {
      console.warn('Database queries are not supported in browser environments');
      return [];
    }
    
    if (!this.isConnected || !this.postgresConnector) {
      throw new Error('Banco de dados não conectado');
    }
    return await this.postgresConnector.query(sql, params);
  }

  /**
   * Verifica se o banco de dados está online
   */
  async checkConnection(): Promise<boolean> {
    if (isBrowser) {
      return false;
    }
    
    if (!this.postgresConnector) return false;
    
    try {
      await this.postgresConnector.query('SELECT 1');
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fecha a conexão com o banco de dados
   */
  async disconnect(): Promise<void> {
    if (isBrowser) {
      return;
    }
    
    if (this.postgresConnector) {
      await this.postgresConnector.close();
      this.isConnected = false;
    }
  }
}

export const databaseService = DatabaseService.getInstance();
