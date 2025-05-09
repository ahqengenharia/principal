import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/lib/supabase'
import { Upload } from 'lucide-react'

const HidroDataUpload = () => {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    try {
      console.log('Iniciando upload do arquivo:', file.name)
      
      const formData = new FormData()
      formData.append('file', file)

      const { data, error } = await supabase.functions.invoke('process-hidro-data', {
        body: formData,
      })

      if (error) throw error

      console.log('Resposta do processamento:', data)

      toast({
        title: "Sucesso!",
        description: `Arquivo processado com sucesso. ${data.recordCount} registros importados.`,
      })

    } catch (error) {
      console.error('Erro no upload:', error)
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo. Por favor, tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Upload de Dados HIDRO</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".mdb"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="cursor-pointer"
          />
          <Button 
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              "Processando..."
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Fazer Upload
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default HidroDataUpload