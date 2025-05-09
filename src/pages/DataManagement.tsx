import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from '@/components/BackButton';
import HelpButton from '@/components/data-management/HelpButton';
import ServiceGrid from '@/components/data-management/ServiceGrid';
import HydrologicalDataEntry from '@/components/data-management/HydrologicalDataEntry';
import HydrologicalDataView from '@/components/data-management/HydrologicalDataView';

const DataManagement = () => {
  return (
    <div className="container mx-auto p-8 relative">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <HelpButton />
      </div>
      
      <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
        Gestão de Dados
      </h1>
      
      <Card className="bg-gradient-to-br from-blue-50 to-white">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="entry">Entrada de Dados</TabsTrigger>
            <TabsTrigger value="view">Visualização</TabsTrigger>
          </TabsList>
          <TabsContent value="services">
            <ServiceGrid />
          </TabsContent>
          <TabsContent value="entry">
            <HydrologicalDataEntry />
          </TabsContent>
          <TabsContent value="view">
            <HydrologicalDataView />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default DataManagement;