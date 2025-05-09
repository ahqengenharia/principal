-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configuração das tabelas principais do AHQ HIDRO DATA
CREATE TABLE IF NOT EXISTS stations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_code VARCHAR(50) UNIQUE NOT NULL,
    station_name VARCHAR(255) NOT NULL,
    station_type VARCHAR(50) NOT NULL,
    river_name VARCHAR(255) NOT NULL,
    basin VARCHAR(255) NOT NULL,
    sub_basin VARCHAR(255),
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    altitude DECIMAL(10,2),
    drainage_area DECIMAL(10,2),
    operation_start_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS river_measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES stations(id),
    measurement_date DATE NOT NULL,
    measurement_time TIME NOT NULL,
    water_level DECIMAL(10,2) NOT NULL,
    flow_rate DECIMAL(10,2),
    water_temperature DECIMAL(5,2),
    measurement_method VARCHAR(50),
    measurement_quality VARCHAR(50),
    observer VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rainfall_measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES stations(id),
    measurement_date DATE NOT NULL,
    measurement_time TIME NOT NULL,
    rainfall_amount DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER,
    intensity_mm_h DECIMAL(10,2),
    measurement_type VARCHAR(50),
    measurement_quality VARCHAR(50),
    observer VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sediment_measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES stations(id),
    measurement_date DATE NOT NULL,
    measurement_time TIME NOT NULL,
    suspended_sediment_mg_l DECIMAL(10,2),
    bed_load_kg_day DECIMAL(10,2),
    total_sediment_ton_day DECIMAL(10,2),
    measurement_method VARCHAR(50),
    measurement_quality VARCHAR(50),
    observer VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS water_quality_measurements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    station_id UUID REFERENCES stations(id),
    measurement_date DATE NOT NULL,
    measurement_time TIME NOT NULL,
    ph DECIMAL(4,2),
    dissolved_oxygen_mg_l DECIMAL(5,2),
    conductivity_us_cm DECIMAL(7,2),
    turbidity_ntu DECIMAL(7,2),
    temperature_celsius DECIMAL(4,1),
    total_dissolved_solids_mg_l DECIMAL(7,2),
    measurement_method VARCHAR(50),
    measurement_quality VARCHAR(50),
    observer VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela para armazenar as receitas implementadas
CREATE TABLE IF NOT EXISTS recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipe_code VARCHAR(50) UNIQUE NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    description TEXT,
    steps JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criação de índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_river_measurements_station_date 
ON river_measurements(station_id, measurement_date);

CREATE INDEX IF NOT EXISTS idx_rainfall_measurements_station_date 
ON rainfall_measurements(station_id, measurement_date);

CREATE INDEX IF NOT EXISTS idx_sediment_measurements_station_date 
ON sediment_measurements(station_id, measurement_date);

CREATE INDEX IF NOT EXISTS idx_water_quality_measurements_station_date 
ON water_quality_measurements(station_id, measurement_date);

-- Funções para atualização automática do updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualização automática do updated_at
CREATE TRIGGER update_stations_updated_at
    BEFORE UPDATE ON stations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_river_measurements_updated_at
    BEFORE UPDATE ON river_measurements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rainfall_measurements_updated_at
    BEFORE UPDATE ON rainfall_measurements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sediment_measurements_updated_at
    BEFORE UPDATE ON sediment_measurements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_water_quality_measurements_updated_at
    BEFORE UPDATE ON water_quality_measurements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança (RLS)
ALTER TABLE stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE river_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rainfall_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sediment_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_quality_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
CREATE POLICY "Permitir leitura pública de estações"
ON stations FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Permitir leitura pública de medições de rio"
ON river_measurements FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Permitir leitura pública de medições de chuva"
ON rainfall_measurements FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Permitir leitura pública de medições de sedimentos"
ON sediment_measurements FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Permitir leitura pública de medições de qualidade da água"
ON water_quality_measurements FOR SELECT
TO PUBLIC
USING (true);

CREATE POLICY "Permitir leitura pública de receitas"
ON recipes FOR SELECT
TO PUBLIC
USING (true);