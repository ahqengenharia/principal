import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Header from '@/components/Header';

const getRoleName = (role: string) => {
  switch (role) {
    case 'TOTAL':
      return 'Acesso Total';
    case 'OPERACIONAL':
      return 'Nível Operacional';
    case 'NIVEL_1':
      return 'Nível 1';
    default:
      return 'Nível 1';
  }
};

const Dashboard = () => {
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    setUserEmail(localStorage.getItem('userEmail') || '');
    setUserRole(localStorage.getItem('userRole') || 'NIVEL_1');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Header />
      
      <main className="container mx-auto p-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                EM DESENVOLVIMENTO
              </CardTitle>
              <div className="text-sm text-gray-500">
                <div>Usuário: {userEmail}</div>
                <div>Nível: {getRoleName(userRole)}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Esta página está em desenvolvimento. Em breve novas funcionalidades estarão disponíveis 
              de acordo com seu nível de acesso.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;