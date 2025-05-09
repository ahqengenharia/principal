import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import DataEntryDialog from './DataEntryDialog';

interface ServiceButtonProps {
  title: string;
  icon: React.ReactNode;
  endpoint: string;
}

const ServiceButton = ({ title, icon, endpoint }: ServiceButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    if (endpoint.startsWith('http')) {
      window.open(endpoint, '_blank');
      toast({
        title: "Redirecionando",
        description: "Abrindo o site em uma nova aba",
      });
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        className="h-32 bg-white hover:bg-blue-100 border-2 border-blue-200 text-blue-900 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 group"
        onClick={handleClick}
      >
        {icon}
        <span className="font-semibold text-center">{title}</span>
      </Button>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {endpoint === "/data-management/input" && (
          <DataEntryDialog onClose={() => setIsOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceButton;