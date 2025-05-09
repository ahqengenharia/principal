import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';

const Modeling = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (!storedUsername) {
      navigate('/');
      return;
    }
    setUsername(storedUsername);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Header />
      
      <main className="container mx-auto p-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold">
                ACESSO AO MÓDULO DE MODELAGEM
              </CardTitle>
              <div className="text-sm text-gray-500">
                <div>Usuário: {username}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Bem-vindo ao módulo de modelagem. Selecione uma opção no menu para começar.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Modeling;