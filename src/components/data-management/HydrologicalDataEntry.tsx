import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';

const HydrologicalDataEntry = () => {
  const { toast } = useToast();
  const [dataType, setDataType] = useState<'river' | 'rainfall'>('river');
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    coordinate_x: '',
    coordinate_y: '',
    coordinate_z: '',
    river_name: '',
    tributaries: '',
    basin: '',
    sub_basin: '',
    station_code: '',
    station_type: '',
    nearby_station_a: '',
    nearby_station_b: '',
    coordinate_xa: '',
    coordinate_ya: '',
    coordinate_za: '',
    coordinate_xb: '',
    coordinate_yb: '',
    coordinate_zb: '',
    // Campos específicos para rio
    water_level: '',
    flow_rate: '',
    river_section: '',
    // Campos específicos para chuva
    precipitation: '',
    radiation: '',
    dry_bulb_temp: '',
    wet_bulb_temp: '',
    psychrometer_emv: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Enviando dados:', formData);

    try {
      const table = dataType === 'river' ? 'river_data' : 'rainfall_data';
      const { data, error } = await supabase
        .from(table)
        .insert([formData])
        .select();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Dados salvos com sucesso",
      });

      // Limpar formulário
      setFormData({
        date: '',
        time: '',
        coordinate_x: '',
        coordinate_y: '',
        coordinate_z: '',
        river_name: '',
        tributaries: '',
        basin: '',
        sub_basin: '',
        station_code: '',
        station_type: '',
        nearby_station_a: '',
        nearby_station_b: '',
        coordinate_xa: '',
        coordinate_ya: '',
        coordinate_za: '',
        coordinate_xb: '',
        coordinate_yb: '',
        coordinate_zb: '',
        water_level: '',
        flow_rate: '',
        river_section: '',
        precipitation: '',
        radiation: '',
        dry_bulb_temp: '',
        wet_bulb_temp: '',
        psychrometer_emv: '',
      });
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar os dados",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Entrada de Dados Hidrológicos</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            value={dataType}
            onValueChange={(value: 'river' | 'rainfall') => setDataType(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de dados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="river">Dados de Rio</SelectItem>
              <SelectItem value="rainfall">Dados de Chuva</SelectItem>
            </SelectContent>
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="Data"
            />
            <Input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleInputChange}
              placeholder="Hora"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              name="coordinate_x"
              type="number"
              value={formData.coordinate_x}
              onChange={handleInputChange}
              placeholder="Coordenada X"
            />
            <Input
              name="coordinate_y"
              type="number"
              value={formData.coordinate_y}
              onChange={handleInputChange}
              placeholder="Coordenada Y"
            />
            <Input
              name="coordinate_z"
              type="number"
              value={formData.coordinate_z}
              onChange={handleInputChange}
              placeholder="Coordenada Z"
            />
          </div>

          <Input
            name="river_name"
            value={formData.river_name}
            onChange={handleInputChange}
            placeholder="Nome do Rio"
          />

          <Input
            name="tributaries"
            value={formData.tributaries}
            onChange={handleInputChange}
            placeholder="Afluentes"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="basin"
              value={formData.basin}
              onChange={handleInputChange}
              placeholder="Bacia"
            />
            <Input
              name="sub_basin"
              value={formData.sub_basin}
              onChange={handleInputChange}
              placeholder="Sub-bacia"
            />
          </div>

          {dataType === 'river' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="water_level"
                type="number"
                value={formData.water_level}
                onChange={handleInputChange}
                placeholder="Nível da Água"
              />
              <Input
                name="flow_rate"
                type="number"
                value={formData.flow_rate}
                onChange={handleInputChange}
                placeholder="Vazão"
              />
              <Input
                name="river_section"
                value={formData.river_section}
                onChange={handleInputChange}
                placeholder="Seção do Rio"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                name="precipitation"
                type="number"
                value={formData.precipitation}
                onChange={handleInputChange}
                placeholder="Precipitação"
              />
              <Input
                name="radiation"
                type="number"
                value={formData.radiation}
                onChange={handleInputChange}
                placeholder="Radiação"
              />
              <Input
                name="dry_bulb_temp"
                type="number"
                value={formData.dry_bulb_temp}
                onChange={handleInputChange}
                placeholder="Temperatura Bulbo Seco"
              />
              <Input
                name="wet_bulb_temp"
                type="number"
                value={formData.wet_bulb_temp}
                onChange={handleInputChange}
                placeholder="Temperatura Bulbo Úmido"
              />
              <Input
                name="psychrometer_emv"
                type="number"
                value={formData.psychrometer_emv}
                onChange={handleInputChange}
                placeholder="EMV Psicrômetro"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="station_code"
              value={formData.station_code}
              onChange={handleInputChange}
              placeholder="Código da Estação"
            />
            <Input
              name="station_type"
              value={formData.station_type}
              onChange={handleInputChange}
              placeholder="Tipo da Estação"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="nearby_station_a"
              value={formData.nearby_station_a}
              onChange={handleInputChange}
              placeholder="Estação Próxima A"
            />
            <Input
              name="nearby_station_b"
              value={formData.nearby_station_b}
              onChange={handleInputChange}
              placeholder="Estação Próxima B"
            />
          </div>

          <Button type="submit" className="w-full">
            Salvar Dados
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HydrologicalDataEntry;