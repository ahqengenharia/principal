import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for river data
export interface RiverData {
  id: string;
  date: string;
  time: string;
  coordinate_x: number;
  coordinate_y: number;
  coordinate_z: number;
  river_name: string;
  tributaries: string[];
  basin: string;
  sub_basin: string;
  water_level: number;
  flow_rate: number;
  river_section: string;
  station_code: string;
  station_type: string;
  nearby_station_a: string;
  nearby_station_b: string;
  coordinate_xa: number;
  coordinate_ya: number;
  coordinate_za: number;
  coordinate_xb: number;
  coordinate_yb: number;
  coordinate_zb: number;
  created_at: string;
}

// Types for rainfall data
export interface RainfallData {
  id: string;
  date: string;
  time: string;
  coordinate_x: number;
  coordinate_y: number;
  coordinate_z: number;
  river_name: string;
  tributaries: string[];
  basin: string;
  sub_basin: string;
  precipitation: number;
  radiation: number;
  dry_bulb_temp: number;
  wet_bulb_temp: number;
  psychrometer_emv: number;
  station_code: string;
  station_type: string;
  nearby_station_a: string;
  nearby_station_b: string;
  coordinate_xa: number;
  coordinate_ya: number;
  coordinate_za: number;
  coordinate_xb: number;
  coordinate_yb: number;
  coordinate_zb: number;
  created_at: string;
}

// Database operations for river data
export const saveRiverData = async (data: Omit<RiverData, 'id' | 'created_at'>) => {
  const { data: result, error } = await supabase
    .from('river_data')
    .insert([data])
    .select();

  if (error) throw error;
  return result;
};

export const getRiverData = async () => {
  const { data, error } = await supabase
    .from('river_data')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Database operations for rainfall data
export const saveRainfallData = async (data: Omit<RainfallData, 'id' | 'created_at'>) => {
  const { data: result, error } = await supabase
    .from('rainfall_data')
    .insert([data])
    .select();

  if (error) throw error;
  return result;
};

export const getRainfallData = async () => {
  const { data, error } = await supabase
    .from('rainfall_data')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// Statistical analysis functions
export const calculateRatingCurve = async (stationCode: string) => {
  const { data, error } = await supabase
    .from('river_data')
    .select('water_level, flow_rate')
    .eq('station_code', stationCode)
    .order('water_level', { ascending: true });

  if (error) throw error;
  
  // Simple power law rating curve: Q = a(h-h0)^b
  // This is a basic implementation - you may want to use more sophisticated methods
  if (data && data.length > 0) {
    const n = data.length;
    const x = data.map(d => Math.log(d.water_level));
    const y = data.map(d => Math.log(d.flow_rate));
    
    // Calculate coefficients using least squares
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumX2 = x.reduce((a, b) => a + b * b, 0);
    
    const b = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const a = Math.exp((sumY - b * sumX) / n);
    
    return { a, b };
  }
  
  return null;
};