import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Iniciando Edge Function client/data')

serve(async (req) => {
  // Adicionar headers CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Dados mockados para desenvolvimento
    const clientData = {
      razao_social: "NOME DA UHE",
      grupo: "NOME DO GRUPO DO CLIENTE",
      responsavel_tecnico: "Responsável Técnico"
    }

    console.log('Retornando dados do cliente:', clientData)

    return new Response(
      JSON.stringify(clientData),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Erro na Edge Function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    )
  }
})