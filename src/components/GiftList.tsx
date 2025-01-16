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
import { useQuery, useQueryClient } from "@tanstack/react-query";

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

const initialGifts: Gift[] = [
  { id: 1, name: "Saleiro e Pimenteiro", description: "Um conjuntinho de saleiro e pimenteiro divertidos", chosen: false },
  { id: 2, name: "Cesto de Roupa Suja", description: "Um cestinho alto para roupas sujas, gosto daqueles de palha ou materiais naturais", chosen: false },
  { id: 3, name: "Potes Herméticos", description: "Conjuntinho de potes bonitos para colocar arroz, açúcar, farinha etc.", chosen: false },
  { id: 4, name: "Tapetinho Capacho", description: "Com uma mensagem ou imagem divertida", chosen: false },
  { id: 5, name: "Utilitários de Cozinha", description: "Panelas, chaleira, travessas, formas, canecas, cumbucas, utensílios pra comidas no geral", chosen: false },
  { id: 6, name: "Copos", description: "Copos de vidro para água e suco", chosen: false },
  { id: 7, name: "Decorações", description: "Quadrinhos, almofadas, vasinhos de plantas etc.", chosen: false },
  { id: 8, name: "Caixas Organizadoras", description: "De todos os tamanhos, em tons neutros", chosen: false },
  { id: 9, name: "Jogo de Cama Queen", description: "Com uma estampa bonita e/ou em tons pastel", chosen: false },
  { id: 10, name: "Toalha de Rosto", description: "Qualquer tom de verde", chosen: false },
];

const STORAGE_KEY = 'gifts_v2';

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [hasChosen, setHasChosen] = useState(false);

  const { data: gifts = initialGifts, refetch } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      const storedGifts = localStorage.getItem(STORAGE_KEY);
      if (!storedGifts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGifts));
        return initialGifts;
      }
      return JSON.parse(storedGifts);
    },
    refetchInterval: 2000, // Refetch every 2 seconds
    staleTime: 0, // Consider data stale immediately
    cacheTime: 0, // Don't cache the data
  });

  const handleChooseGift = async (giftId: number) => {
    const currentGifts = await queryClient.fetchQuery({
      queryKey: ['gifts'],
      queryFn: async () => {
        const storedGifts = localStorage.getItem(STORAGE_KEY);
        return storedGifts ? JSON.parse(storedGifts) : initialGifts;
      },
    });

    const gift = currentGifts.find((g: Gift) => g.id === giftId);
    
    if (gift?.chosen) {
      toast({
        title: "Presente já escolhido",
        description: "Este presente já foi reservado por outro convidado",
        variant: "destructive",
      });
      return;
    }

    const updatedGifts = currentGifts.map((gift: Gift) => {
      if (gift.id === giftId) {
        return { ...gift, chosen: true, chosenBy: userName };
      }
      return gift;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGifts));
    await queryClient.invalidateQueries({ queryKey: ['gifts'] });
    
    toast({
      title: "Presente escolhido!",
      description: "Sua escolha foi registrada com sucesso",
    });
    
    setSelectedGiftId(null);
    setHasChosen(true);
  };

  const handleReset = async () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGifts));
    await queryClient.invalidateQueries({ queryKey: ['gifts'] });
    toast({
      title: "Lista reiniciada",
      description: "Todos os presentes estão disponíveis novamente",
    });
  };

  if (isAdmin) {
    return (
      <div className="w-full max-w-4xl space-y-6 animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-2">Painel Administrativo</h2>
          <p className="text-muted-foreground mb-4">Lista completa de presentes e escolhas</p>
          <Button 
            onClick={handleReset}
            variant="outline"
            className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
          >
            Reiniciar Lista de Presentes
          </Button>
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
                {gift.chosen && gift.chosenBy && (
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

  if (hasChosen) {
    return (
      <div className="w-full max-w-4xl space-y-6 animate-fadeIn text-center">
        <div className="bg-sage-50 p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-sage-700">Obrigado, {userName}!</h2>
          <p className="text-lg text-sage-600 mb-2">
            Sua escolha foi registrada com sucesso.
          </p>
          <p className="text-muted-foreground">
            Agradecemos sua participação neste momento especial.
          </p>
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