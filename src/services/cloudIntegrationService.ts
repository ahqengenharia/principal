
import { supabase } from '@/lib/supabase';

interface CloudStorageConfig {
  provider: 'aws' | 'databricks';
  region?: string;
  bucket?: string;
}

export const cloudIntegrationService = {
  async getCloudConfig(): Promise<CloudStorageConfig> {
    try {
      const { data, error } = await supabase
        .from('cloud_config')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cloud configuration:', error);
      throw error;
    }
  },

  async initializeCloudStorage(config: CloudStorageConfig): Promise<void> {
    try {
      // Store configuration in Supabase
      const { error } = await supabase
        .from('cloud_config')
        .upsert({ 
          provider: config.provider,
          region: config.region,
          bucket: config.bucket,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error initializing cloud storage:', error);
      throw error;
    }
  },

  async migrateToCloud(provider: 'aws' | 'databricks'): Promise<void> {
    try {
      // Call Supabase Edge Function to handle cloud migration
      const { error } = await supabase.functions.invoke('cloud-migration', {
        body: { provider }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error migrating to cloud:', error);
      throw error;
    }
  }
};
