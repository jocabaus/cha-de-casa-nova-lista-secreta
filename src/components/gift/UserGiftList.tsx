import { Gift } from "@/types/gift";
import { GiftCard } from "./GiftCard";

interface UserGiftListProps {
  gifts: Gift[];
  userName: string;
  onChooseGift: (id: number) => void;
}

export const UserGiftList = ({ gifts, userName, onChooseGift }: UserGiftListProps) => {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Olá, {userName}!</h2>
        <p className="text-muted-foreground">Escolha seu presente da lista abaixo</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gifts.map((gift) => (
          <GiftCard 
            key={gift.id} 
            {...gift} 
            onChoose={onChooseGift}
          />
        ))}
      </div>
    </div>
  );
};