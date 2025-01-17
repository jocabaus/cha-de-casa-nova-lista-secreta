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
import { AdminGiftList } from "./gift/AdminGiftList";
import { UserGiftList } from "./gift/UserGiftList";
import { ThankYouMessage } from "./gift/ThankYouMessage";
import { useGifts } from "@/hooks/useGifts";

interface GiftListProps {
  userName: string;
  isAdmin?: boolean;
}

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const { gifts, isLoading, chooseGift, resetGifts } = useGifts();

  const handleChooseGift = async (giftId: number) => {
    const success = await chooseGift(giftId, userName);
    if (success) {
      setSelectedGiftId(null);
      setHasChosen(true);
    }
  };

  if (isLoading) {
    return <div className="text-center">Carregando presentes...</div>;
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