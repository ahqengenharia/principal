import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Iniciando Edge Function upload-logo')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('logo')

    if (!file) {
      throw new Error('Nenhum arquivo enviado')
    }

    // Criar cliente Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `public/${fileName}`

    // Upload para o Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('logos')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath)

    // Salvar metadados no banco
    const { error: dbError } = await supabase
      .from('logotipos')
      .insert({
        nome_arquivo: file.name,
        caminho_storage: filePath,
        caminho_local: `C:/PLATAFORMA AHQ TESTE/logos/${fileName}`
      })

    if (dbError) {
      throw dbError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        url: publicUrl,
        message: 'Logotipo enviado com sucesso'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erro:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})