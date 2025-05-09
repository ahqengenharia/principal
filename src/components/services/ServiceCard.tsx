
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ServiceCardProps {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
  endpoint?: string;
}

const ServiceCard = ({ title, icon, onClick, endpoint }: ServiceCardProps) => {
  const { toast } = useToast();

  const handleClick = () => {
    if (onClick) {
      // If an onClick handler is provided, use it
      onClick();
    } else if (endpoint) {
      // If it's an external URL, open it in a new tab
      if (endpoint.startsWith('http')) {
        window.open(endpoint, '_blank');
        toast({
          title: "Redirecionando",
          description: "Abrindo o site em uma nova aba",
        });
      } else {
        // For internal endpoints, show a toast for now
        toast({
          title: "Em desenvolvimento",
          description: `A funcionalidade ${title} está em implementação`,
        });
      }
    }
  };

  return (
    <Button
      variant="outline"
      className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 group"
      onClick={handleClick}
    >
      {icon}
      <span className="font-semibold text-center">{title}</span>
    </Button>
  );
};

export default ServiceCard;
