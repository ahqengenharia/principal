import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export const saveDataEntry = async (data: any) => {
  const { data: result, error } = await supabase
    .from('hidrodata')
    .insert([data]);

  if (error) throw error;
  return result;
};

export const getDataPreview = async () => {
  const { data, error } = await supabase
    .from('hidrodata')
    .select('*')
    .limit(100);

  if (error) throw error;
  return data;
};