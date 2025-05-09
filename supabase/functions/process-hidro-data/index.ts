import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as XLSX from 'https://esm.sh/xlsx@0.18.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Iniciando processamento do arquivo')
    
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file) {
      throw new Error('Nenhum arquivo enviado')
    }

    console.log('Arquivo recebido:', file.name)

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Processar arquivo
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer)
    
    // Converter para JSON
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    console.log(`Processando ${jsonData.length} registros`)

    // Mapear dados para as colunas corretas da tabela hidro_data
    const mappedData = jsonData.map((row: any) => ({
      codigo_estacao: row.codigo_estacao || row.CodigoEstacao || null,
      nome_estacao: row.nome_estacao || row.NomeEstacao || null,
      tipo_estacao: row.tipo_estacao || row.TipoEstacao || null,
      rio: row.rio || row.Rio || null,
      bacia: row.bacia || row.Bacia || null,
      sub_bacia: row.sub_bacia || row.SubBacia || null,
      municipio: row.municipio || row.Municipio || null,
      estado: row.estado || row.Estado || null,
      latitude: row.latitude || row.Latitude || null,
      longitude: row.longitude || row.Longitude || null,
      altitude: row.altitude || row.Altitude || null,
      area_drenagem: row.area_drenagem || row.AreaDrenagem || null,
      nivel_consistencia: row.nivel_consistencia || row.NivelConsistencia || null,
      data_medicao: row.data_medicao || row.DataMedicao || null,
      cota_cm: row.cota_cm || row.CotaCm || null,
      vazao_m3s: row.vazao_m3s || row.VazaoM3s || null,
      qualidade_medicao: row.qualidade_medicao || row.QualidadeMedicao || null
    }))

    console.log('Dados mapeados:', mappedData[0])

    const { error } = await supabase
      .from('hidro_data')
      .insert(mappedData)

    if (error) {
      console.error('Erro ao inserir dados:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Dados importados com sucesso',
        recordCount: jsonData.length 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Erro ao processar arquivo:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})