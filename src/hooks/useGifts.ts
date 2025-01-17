import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Gift } from "@/types/gift";
import { initialGifts } from "@/data/initialGifts";
import { useToast } from "@/components/ui/use-toast";

export const useGifts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      let { data: existingGifts, error: checkError } = await supabase
        .from('gifts')
        .select('*');

      if (!existingGifts || existingGifts.length === 0) {
        const { error: insertError } = await supabase
          .from('gifts')
          .insert(initialGifts);

        if (insertError) {
          console.error('Error inserting initial gifts:', insertError);
          return initialGifts;
        }

        return initialGifts;
      }

      if (checkError) {
        console.error('Error fetching gifts:', checkError);
        return initialGifts;
      }

      return existingGifts;
    },
    refetchInterval: 3000,
  });

  const chooseGift = async (giftId: number, userName: string) => {
    try {
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
        return false;
      }

      const { error } = await supabase
        .from('gifts')
        .update({ chosen: true, chosen_by: userName })
        .eq('id', giftId);

      if (error) {
        toast({
          title: "Erro ao escolher presente",
          description: "Por favor, tente novamente",
          variant: "destructive",
        });
        return false;
      }
      
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      return true;
    } catch (error) {
      console.error('Error choosing gift:', error);
      return false;
    }
  };

  const resetGifts = async () => {
    try {
      const { error } = await supabase
        .from('gifts')
        .update({ chosen: false, chosen_by: null })
        .neq('id', 0);

      if (error) {
        toast({
          title: "Erro ao reiniciar lista",
          description: "Por favor, tente novamente",
          variant: "destructive",
        });
        return false;
      }

      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      return true;
    } catch (error) {
      console.error('Error resetting gifts:', error);
      return false;
    }
  };

  return {
    gifts,
    isLoading,
    chooseGift,
    resetGifts
  };
};