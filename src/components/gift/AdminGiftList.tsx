import { Button } from "@/components/ui/button";
import { Gift } from "@/types/gift";
import { GiftCard } from "./GiftCard";

interface AdminGiftListProps {
  gifts: Gift[];
  onReset: () => void;
}

export const AdminGiftList = ({ gifts, onReset }: AdminGiftListProps) => {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Painel Administrativo</h2>
        <p className="text-muted-foreground mb-4">Lista completa de presentes e escolhas</p>
        <Button 
          onClick={onReset}
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          Reiniciar Lista de Presentes
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {gifts.map((gift) => (
          <GiftCard key={gift.id} {...gift} isAdmin={true} />
        ))}
      </div>
    </div>
  );
};