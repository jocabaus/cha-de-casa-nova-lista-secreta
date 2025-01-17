import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Gift } from "@/types/gift";
import { initialGifts } from "@/data/initialGifts";

export const useGifts = () => {
  const queryClient = useQueryClient();

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      const { data: gifts, error } = await supabase
        .from('gifts')
        .select('*');

      if (error) {
        console.error('Error fetching gifts:', error);
        return initialGifts;
      }

      if (!gifts || gifts.length === 0) {
        const { data: newGifts, error: insertError } = await supabase
          .from('gifts')
          .insert(initialGifts)
          .select();

        if (insertError) {
          console.error('Error inserting initial gifts:', insertError);
          return initialGifts;
        }

        return newGifts || initialGifts;
      }

      return gifts;
    }
  });

  const chooseGift = async (giftId: number, userName: string) => {
    const { error } = await supabase
      .from('gifts')
      .update({ chosen: true, chosen_by: userName })
      .eq('id', giftId);

    if (error) {
      console.error('Error choosing gift:', error);
      return false;
    }

    queryClient.invalidateQueries({ queryKey: ['gifts'] });
    return true;
  };

  const resetGifts = async () => {
    const { error } = await supabase
      .from('gifts')
      .update({ chosen: false, chosen_by: null })
      .neq('id', 0);

    if (error) {
      console.error('Error resetting gifts:', error);
      return false;
    }

    queryClient.invalidateQueries({ queryKey: ['gifts'] });
    return true;
  };

  return {
    gifts,
    isLoading,
    chooseGift,
    resetGifts
  };
};