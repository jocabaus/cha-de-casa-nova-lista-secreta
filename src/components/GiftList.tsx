import { useEffect, useState } from "react";
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
import { supabase } from "@/lib/supabase";

interface GiftListProps {
  userName: string;
  isAdmin?: boolean;
}

export const GiftList = ({ userName, isAdmin = false }: GiftListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedGiftId, setSelectedGiftId] = useState<number | null>(null);
  const [hasChosen, setHasChosen] = useState(false);

  // Configurando o useQuery para usar Supabase
  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('id');
      
      if (error) {
        console.error('Error fetching gifts:', error);
        toast({
          title: "Erro ao carregar presentes",
          description: "Houve um problema ao carregar a lista de presentes",
          variant: "destructive",
        });
        return [];
      }
      
      // Verifica se o usuário já escolheu algum presente
      const userGift = data?.find(gift => gift.chosen_by === userName);
      if (userGift) {
        setHasChosen(true);
      }
      
      return data || [];
    },
    refetchInterval: 3000, // Atualiza a cada 3 segundos
  });

  // Configurando subscription para atualizações em tempo real
  useEffect(() => {
    const channel = supabase
      .channel('gifts_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gifts' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['gifts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleChooseGift = async (giftId: number) => {
    try {
      // Verificando em tempo real antes de fazer a escolha
      const { data: currentGift } = await supabase
        .from('gifts')
        .select('chosen')
        .eq('id', giftId)
        .single();
      
      if (currentGift?.chosen) {
        toast({
          title: "Presente já escolhido",
          description: "Este presente já foi reservado por outro convidado",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('gifts')
        .update({ chosen: true, chosen_by: userName })
        .eq('id', giftId);

      if (error) {
        console.error('Error updating gift:', error);
        toast({
          title: "Erro ao escolher presente",
          description: "Por favor, tente novamente",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Presente escolhido!",
        description: "Sua escolha foi registrada com sucesso",
      });
      
      setSelectedGiftId(null);
      setHasChosen(true);
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    } catch (error) {
      console.error('Error choosing gift:', error);
      toast({
        title: "Erro ao escolher presente",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleReset = async () => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({ chosen: false, chosen_by: null })
        .neq('id', 0);

      if (error) {
        console.error('Error resetting gifts:', error);
        toast({
          title: "Erro ao reiniciar lista",
          description: "Por favor, tente novamente",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Lista reiniciada",
        description: "Todos os presentes estão disponíveis novamente",
      });
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
    } catch (error) {
      console.error('Error resetting gifts:', error);
      toast({
        title: "Erro ao reiniciar lista",
        description: "Por favor, tente novamente",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center">Carregando presentes...</div>;
  }

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