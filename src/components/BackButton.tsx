import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  onClick?: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/');
    }
  };

  return (
    <Button
      variant="outline"
      className="fixed top-4 right-4 z-50 bg-transparent border-2 border-neon-blue text-neon-blue hover:bg-neon-blue/10 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.5)] flex items-center gap-2"
      onClick={handleClick}
    >
      <ChevronLeft className="h-4 w-4" />
      Voltar
    </Button>
  );
};

export default BackButton;