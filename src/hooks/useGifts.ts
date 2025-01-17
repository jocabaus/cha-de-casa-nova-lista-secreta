import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Gift } from "@/types/gift";
import { initialGifts } from "@/data/initialGifts";

export const useGifts = () => {
  const queryClient = useQueryClient();

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      const { data: gifts } = await supabase
        .from('gifts')
        .select('*');

      if (!gifts || gifts.length === 0) {
        const { data: newGifts } = await supabase
          .from('gifts')
          .insert(initialGifts)
          .select();
        return newGifts || [];
      }

      return gifts;
    },
    refetchInterval: 3000
  });

  const chooseGift = async (giftId: number, userName: string) => {
    const { data } = await supabase
      .from('gifts')
      .update({ chosen: true, chosen_by: userName })
      .eq('id', giftId)
      .select()
      .single();

    if (data) {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      return true;
    }
    return false;
  };

  const resetGifts = async () => {
    const { error } = await supabase
      .from('gifts')
      .update({ chosen: false, chosen_by: null })
      .neq('id', 0);

    if (!error) {
      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      return true;
    }
    return false;
  };

  return {
    gifts,
    isLoading,
    chooseGift,
    resetGifts
  };
};