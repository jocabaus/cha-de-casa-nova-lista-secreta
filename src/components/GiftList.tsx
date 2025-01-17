import { useState } from "react";
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
import { Gift } from "@/types/gift";
import { AdminGiftList } from "./gift/AdminGiftList";
import { UserGiftList } from "./gift/UserGiftList";
import { ThankYouMessage } from "./gift/ThankYouMessage";

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

// Usando uma chave única e global para o storage
const STORAGE_KEY = 'gifts_global_v1';

interface GiftListProps {
  userName: string;
  isAdmin?: boolean;
}

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [hasChosen, setHasChosen] = useState(false);

  // Configurando o useQuery para atualizar mais frequentemente
  const { data: gifts = initialGifts } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      const storedGifts = localStorage.getItem(STORAGE_KEY);
      if (!storedGifts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGifts));
        return initialGifts;
      }
      return JSON.parse(storedGifts);
    },
    refetchInterval: 1000, // Atualizando a cada 1 segundo
    staleTime: 0,
    gcTime: 0,
  });

  const handleChooseGift = async (giftId: number) => {
    // Verificando em tempo real antes de fazer a escolha
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
    return <AdminGiftList gifts={gifts} onReset={handleReset} />;
  }

  if (hasChosen) {
    return <ThankYouMessage userName={userName} />;
  }

  return (
    <>
      <UserGiftList 
        gifts={gifts}
        userName={userName}
        onChooseGift={(id) => setSelectedGiftId(id)}
      />

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
    </>
  );
};