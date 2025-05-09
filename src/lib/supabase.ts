
import { createClient } from '@supabase/supabase-js';

// Use environment variables from .env file
const supabaseUrl = 'https://azotnhzhyisqadvvaywj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6b3RuaHpoeWlzcWFkdnZheXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NDk1ODQsImV4cCI6MjA0OTAyNTU4NH0.J2WqvvZw-BjZGVKLI0YyD_1027j6D_PODf-dO30Oe1g';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase configuration. Please check your environment variables.');
}

console.log('Initializing Supabase client with:', {
  url: supabaseUrl,
  keyLength: supabaseKey?.length || 0
});

// Create the Supabase client with valid auth configuration
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection
const testConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return;
    }
    
    console.log('Supabase connection successful:', { hasData: !!data });
  } catch (err) {
    console.error('Error testing Supabase connection:', err);
  }
};

testConnection();

export default supabase;
