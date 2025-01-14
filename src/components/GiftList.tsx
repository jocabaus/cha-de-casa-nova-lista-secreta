import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Gift {
  id: number;
  name: string;
  description: string;
  chosen: boolean;
  chosenBy?: string;
}

interface GiftListProps {
  userName: string;
  isAdmin?: boolean;
}

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const { toast } = useToast();
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
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
        return { ...gift, chosen: true, chosenBy: userName };
      }
      return gift;
    }));
    setSelectedGiftId(null);
  };

  if (isAdmin) {
    return (
      <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Painel Administrativo</h2>
          <p className="text-muted-foreground">Lista completa de presentes e escolhas</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {gifts.map((gift) => (
            <Card key={gift.id} className={gift.chosen ? "opacity-75" : ""}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-sage-600" />
                    {gift.name}
                  </div>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    gift.chosen 
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {gift.chosen ? "Indisponível" : "Disponível"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{gift.description}</p>
                {gift.chosen && (
                  <p className="text-sm font-medium text-sage-600">
                    Escolhido por: <span className="font-bold">{gift.chosenBy}</span>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
                onClick={() => setSelectedGiftId(gift.id)}
                className="w-full bg-sage-600 hover:bg-sage-700"
              >
                Escolher Este Presente
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={selectedGiftId !== null} onOpenChange={() => setSelectedGiftId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar escolha do presente</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que gostaria de selecionar este presente?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vou pensar um pouco mais</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedGiftId && handleChooseGift(selectedGiftId)}
              className="bg-sage-600 hover:bg-sage-700"
            >
              Confirmar seleção
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};