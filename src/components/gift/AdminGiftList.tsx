import { Button } from "@/components/ui/button";
import { Gift } from "@/types/gift";
import { GiftCard } from "./GiftCard";
import { Gift as GiftIcon } from "lucide-react";

interface AdminGiftListProps {
  gifts: Gift[];
  onReset: () => void;
}

export const AdminGiftList = ({ gifts, onReset }: AdminGiftListProps) => {
  const chosenGifts = gifts.filter(gift => gift.chosen);
  const availableGifts = gifts.filter(gift => !gift.chosen);

  return (
    <div className="w-full max-w-4xl space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2 flex items-center justify-center gap-2">
          <GiftIcon className="h-6 w-6 text-sage-600" />
          Painel Administrativo
        </h2>
        <p className="text-muted-foreground mb-4">Lista completa de presentes e escolhas</p>
        <Button 
          onClick={onReset}
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          Reiniciar Lista de Presentes
        </Button>
      </div>
      
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-sage-700 flex items-center gap-2">
            Presentes Disponíveis ({availableGifts.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {availableGifts.map((gift) => (
              <GiftCard key={gift.id} {...gift} isAdmin={true} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-sage-700 flex items-center gap-2">
            Presentes Escolhidos ({chosenGifts.length})
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {chosenGifts.map((gift) => (
              <GiftCard key={gift.id} {...gift} isAdmin={true} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};