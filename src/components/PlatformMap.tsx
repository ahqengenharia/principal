import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const PlatformMap = () => {
  const recipes = [
    {
      title: "Gestão de Dados",
      features: [
        "Entrada de dados",
        "Alteração de dados",
        "Envio para HIDRO",
        "Relatórios internos/externos",
        "Integração com banco HidroData"
      ]
    },
    {
      title: "Entrada de Dados do Cliente",
      features: [
        "Código ANA",
        "Estação Telemétrica",
        "Tipo de Dados",
        "Período de Medição"
      ]
    },
    {
      title: "Geração de Documentos",
      features: [
        "Criação automatizada de relatórios",
        "Formatos: Excel, Word, PDF",
        "Integração com banco HidroData"
      ]
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Mapa da Plataforma - Receitas Implementadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          {recipes.map((recipe, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-xl font-semibold mb-4">{index + 1}. {recipe.title}</h3>
              <ul className="list-disc pl-6 space-y-2">
                {recipe.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="text-gray-700">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PlatformMap;