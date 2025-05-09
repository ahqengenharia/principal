
import type { PoolClient } from 'pg';

interface PostgresConfig {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
}

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Only import pg in non-browser environments
let PoolClass: any = null;
if (!isBrowser) {
  try {
    // Dynamic import to prevent bundling in browser environments
    const pg = require('pg');
    PoolClass = pg.Pool;
  } catch (e) {
    console.warn('Failed to import pg package. PostgreSQL will not be available.');
  }
}

class PostgresConnector {
  private pool: any = null;
  private config: PostgresConfig;

  constructor(config: PostgresConfig) {
    this.config = config;
  }

  /**
   * Inicializa a conexão com o PostgreSQL
   */
  async initialize(): Promise<boolean> {
    if (isBrowser) {
      console.warn('PostgreSQL connections are not supported in browser environments');
      return false;
    }
    
    if (!PoolClass) {
      console.warn('PostgreSQL Pool is not available');
      return false;
    }
    
    try {
      this.pool = new PoolClass(this.config);
      
      // Testar a conexão
      const client = await this.pool.connect();
      const result = await client.query('SELECT NOW();');
      console.log('Conexão PostgreSQL bem-sucedida:', result.rows[0]);
      client.release();
      
      return true;
    } catch (error) {
      console.error('Falha ao conectar ao PostgreSQL:', error);
      return false;
    }
  }

  /**
   * Executa uma consulta SQL
   */
  async query(sql: string, params: any[] = []): Promise<any> {
    if (isBrowser) {
      console.warn('PostgreSQL queries are not supported in browser environments');
      return [];
    }
    
    if (!this.pool) {
      throw new Error('PostgreSQL não inicializado. Chame initialize() primeiro.');
    }
    
    let client: PoolClient | null = null;
    try {
      client = await this.pool.connect();
      const result = await client.query(sql, params);
      return result.rows;
    } catch (error) {
      console.error('Erro ao executar consulta:', error);
      throw error;
    } finally {
      if (client) client.release();
    }
  }

  /**
   * Fecha a conexão com o PostgreSQL
   */
  async close(): Promise<void> {
    if (isBrowser) {
      return;
    }
    
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('Conexão PostgreSQL fechada.');
    }
  }
}

export default PostgresConnector;
