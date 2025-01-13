import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Gift {
  id: number;
  name: string;
  description: string;
  chosen: boolean;
}

interface GiftListProps {
  userName: string;
}

export const GiftList = ({ userName }: GiftListProps) => {
  const { toast } = useToast();
  const [gifts, setGifts] = useState<Gift[]>([
    { id: 1, name: "Jogo de Talheres", description: "Conjunto com 24 peças em inox", chosen: false },
    { id: 2, name: "Jogo de Copos", description: "6 copos para água em vidro", chosen: false },
    { id: 3, name: "Jogo de Panelas", description: "Conjunto com 5 peças antiaderentes", chosen: false },
    { id: 4, name: "Cafeteira", description: "Cafeteira elétrica 110V", chosen: false },
    { id: 5, name: "Toalhas de Banho", description: "Jogo com 4 toalhas felpudas", chosen: false },
  ]);

  const handleChooseGift = (giftId: number) => {
    setGifts(gifts.map(gift => {
      if (gift.id === giftId) {
        if (gift.chosen) {
          toast({
            title: "Presente já escolhido",
            description: "Este presente já foi reservado por outro convidado",
            variant: "destructive",
          });
          return gift;
        }
        toast({
          title: "Presente escolhido!",
          description: "Sua escolha foi registrada com sucesso",
        });
        return { ...gift, chosen: true };
      }
      return gift;
    }));
  };

  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Olá, {userName}!</h2>
        <p className="text-muted-foreground">Escolha seu presente da lista abaixo</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gifts.filter(gift => !gift.chosen).map((gift) => (
          <Card key={gift.id} className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-sage-600" />
                {gift.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{gift.description}</p>
              <Button 
                onClick={() => handleChooseGift(gift.id)}
                className="w-full bg-sage-600 hover:bg-sage-700"
              >
                Escolher Este Presente
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};