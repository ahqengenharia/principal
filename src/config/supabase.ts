import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://afgruahlfvcdtpvnoyfo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const initializeHidroData = async () => {
  // Create tables if they don't exist
  const { error } = await supabase.rpc('initialize_hidro_data');
  if (error) console.error('Error initializing HidroData:', error);
};