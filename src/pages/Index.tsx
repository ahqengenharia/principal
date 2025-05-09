
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import ServiceButtons from '@/components/services/ServiceButtons';
import BackgroundImage from '@/components/BackgroundImage';
import CloudConfigurationForm from '@/components/settings/CloudConfigurationForm';
import SupabaseConnectionManager from '@/components/settings/SupabaseConnectionManager';
import PostgresConnectionManager from '@/components/settings/PostgresConnectionManager';
import { supabase } from '@/lib/supabase';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with username:', username);
      
      // Verify password
      if (password !== 'ahq@engenharia1') {
        throw new Error('Senha inválida');
      }

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking user:', fetchError);
        throw fetchError;
      }

      let userData = existingUser;

      // If user doesn't exist, create them
      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ 
            username, 
            role: 'NIVEL_1' 
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user:', insertError);
          throw insertError;
        }

        userData = newUser;
        console.log('Created new user:', newUser);
      }

      // Store user info
      localStorage.setItem('username', username);
      localStorage.setItem('userRole', userData?.role || 'NIVEL_1');
      
      toast({
        title: "Login realizado",
        description: "Bem-vindo à plataforma",
      });
      
      navigate('/modeling');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <BackgroundImage />
      
      <div className="w-full max-w-6xl flex flex-col items-center space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <img 
            src="/lovable-uploads/8d2c67b0-da76-464c-a66e-856a8b897d67.png"
            alt="AHQ Logo"
            className="max-h-48 object-contain"
          />
        </div>
        
        {/* Login Card */}
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-none text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Plataforma de Modelagem Hidrológica
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Sistema de Gestão de Recursos Hídricos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* Supabase Connection Manager */}
        <SupabaseConnectionManager />

        {/* PostgreSQL Connection Manager */}
        <PostgresConnectionManager />

        {/* Cloud Configuration Form */}
        <CloudConfigurationForm />

        <ServiceButtons />
      </div>
    </div>
  );
};

export default Index;
