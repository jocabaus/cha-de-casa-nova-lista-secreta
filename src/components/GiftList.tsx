import { useState } from "react";
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
import { Gift } from "lucide-react";
import { AdminGiftList } from "./gift/AdminGiftList";
import { UserGiftList } from "./gift/UserGiftList";
import { ThankYouMessage } from "./gift/ThankYouMessage";
import { useGifts } from "@/hooks/useGifts";
import { useToast } from "@/components/ui/use-toast";

interface GiftListProps {
  userName: string;
  isAdmin?: boolean;
}

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const { gifts, isLoading, chooseGift, resetGifts } = useGifts();
  const { toast } = useToast();

  const handleChooseGift = async (giftId: number) => {
    try {
      const success = await chooseGift(giftId, userName);
      if (success) {
        setSelectedGiftId(null);
        setHasChosen(true);
        toast({
          title: "Presente escolhido com sucesso!",
          description: "Obrigado por participar do nosso chá de casa nova!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro ao escolher presente",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Gift className="h-6 w-6 animate-spin text-sage-600" />
        <span className="text-sage-600">Carregando presentes...</span>
      </div>
    );
  }

  if (isAdmin) {
    return <AdminGiftList gifts={gifts} onReset={resetGifts} />;
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
            <AlertDialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-sage-600" />
              Confirmar escolha do presente
            </AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que gostaria de selecionar este presente? 
              Esta ação não poderá ser desfeita.
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