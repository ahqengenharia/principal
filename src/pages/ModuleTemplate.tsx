import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from '@/components/BackButton';

interface ModuleTemplateProps {
  title: string;
  children: React.ReactNode;
}

const ModuleTemplate = ({ title, children }: ModuleTemplateProps) => {
  return (
    <div className="container mx-auto p-8 relative">
      <BackButton />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleTemplate;