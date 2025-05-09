import React, { useState, useEffect } from 'react';
import { Settings, User, Clock, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_API_URL;

const Header = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [clientData, setClientData] = useState({
    razao_social: localStorage.getItem('razao_social') || "NOME DA UHE",
    grupo: localStorage.getItem('grupo') || "NOME DO GRUPO DO CLIENTE",
    responsavel_tecnico: localStorage.getItem('responsavel_tecnico') || "WAGNER TRISTÃO"
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/client/data`);
        if (response.status === 200) {
          setClientData(prev => ({
            ...response.data,
            razao_social: localStorage.getItem('razao_social') || response.data.razao_social,
            grupo: localStorage.getItem('grupo') || response.data.grupo,
            responsavel_tecnico: localStorage.getItem('responsavel_tecnico') || "WAGNER TRISTÃO"
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Aviso",
          description: "Usando dados salvos localmente",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900/90 via-blue-800/90 to-blue-900/90 text-white p-4 relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img 
            src="/lovable-uploads/dc8fbeaa-fe06-4287-9ccf-05a3f6ec3623.png"
            alt="Logo Cliente" 
            className="w-24 h-16 object-contain bg-white/10 rounded p-1"
          />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold">
              {isLoading ? 'Carregando...' : clientData.razao_social}
            </h1>
            <p className="text-sm text-blue-200">
              RESPONSÁVEL TÉCNICO [{isLoading ? 'Carregando...' : clientData.responsavel_tecnico}]
            </p>
          </div>
        </div>
        <nav className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          {user && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>
                ID: {user.id.substring(0, 8)}
              </span>
              <span className="px-2 py-1 bg-blue-700 rounded text-xs">
                {user.user_metadata.role || 'NIVEL_1'}
              </span>
            </div>
          )}
          <Link to="/settings">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <Settings className="mr-2 h-4 w-4" /> Configurações
            </Button>
          </Link>
          {user && (
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;