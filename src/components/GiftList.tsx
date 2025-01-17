import { useState } from "react";
import { Gift } from "lucide-react";
import { useGifts } from "@/hooks/useGifts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface GiftListProps {
  userName: string;
  isAdmin?: boolean;
}

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const { gifts, isLoading, chooseGift, resetGifts } = useGifts();
  const { toast } = useToast();

  const handleChooseGift = async (giftId: number) => {
    const success = await chooseGift(giftId, userName);
    if (success) {
      toast({
        title: "Presente escolhido!",
        description: "Obrigado por participar do nosso chá de casa nova!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Gift className="h-6 w-6 animate-spin" />
        <span>Carregando presentes...</span>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Lista de Presentes - Admin</h2>
          <Button onClick={resetGifts} variant="outline" className="mb-8">
            Reiniciar Lista
          </Button>
        </div>
        <div className="grid gap-4">
          {gifts.map((gift) => (
            <Card key={gift.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{gift.name}</span>
                  <span className={gift.chosen ? "text-red-500" : "text-green-500"}>
                    {gift.chosen ? "Escolhido" : "Disponível"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{gift.description}</p>
                {gift.chosen && (
                  <p className="mt-2 text-sm font-medium">
                    Escolhido por: {gift.chosen_by}
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
    <div className="w-full max-w-4xl space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Olá, {userName}!</h2>
        <p className="text-gray-600">Escolha seu presente da lista abaixo</p>
      </div>
      <div className="grid gap-4">
        {gifts.map((gift) => (
          <Card key={gift.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{gift.name}</span>
                <span className={gift.chosen ? "text-red-500" : "text-green-500"}>
                  {gift.chosen ? "Indisponível" : "Disponível"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{gift.description}</p>
              {!gift.chosen && (
                <Button 
                  onClick={() => handleChooseGift(gift.id)}
                  className="w-full"
                >
                  Escolher Este Presente
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};