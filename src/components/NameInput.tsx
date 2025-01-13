import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface NameInputProps {
  onNameSubmit: (name: string) => void;
}

export const NameInput = ({ onNameSubmit }: NameInputProps) => {
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      toast({
        title: "Nome muito curto",
        description: "Por favor, digite seu nome completo",
        variant: "destructive",
      });
      return;
    }
    onNameSubmit(name.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 animate-fadeIn">
      <Input
        type="text"
        placeholder="Digite seu nome completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="text-lg py-6"
      />
      <Button type="submit" className="w-full bg-sage-600 hover:bg-sage-700 text-white">
        Acessar Lista de Presentes
      </Button>
    </form>
  );
};