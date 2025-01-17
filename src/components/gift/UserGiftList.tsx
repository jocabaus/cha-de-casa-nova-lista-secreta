import { Gift } from "@/types/gift";
import { GiftCard } from "./GiftCard";

interface UserGiftListProps {
  gifts: Gift[];
  userName: string;
  onChooseGift: (id: number) => void;
}

export const UserGiftList = ({ gifts, userName, onChooseGift }: UserGiftListProps) => {
  const availableGifts = gifts.filter(gift => !gift.chosen);
  const chosenGifts = gifts.filter(gift => gift.chosen);

  return (
    <div className="w-full max-w-4xl space-y-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Olá, {userName}!</h2>
        <p className="text-muted-foreground">Escolha seu presente da lista abaixo</p>
      </div>
      
      {availableGifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-sage-700">Presentes Disponíveis</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableGifts.map((gift) => (
              <GiftCard 
                key={gift.id} 
                {...gift} 
                onChoose={onChooseGift}
              />
            ))}
          </div>
        </div>
      )}

      {chosenGifts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-sage-700">Presentes já Escolhidos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-75">
            {chosenGifts.map((gift) => (
              <GiftCard 
                key={gift.id} 
                {...gift}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};