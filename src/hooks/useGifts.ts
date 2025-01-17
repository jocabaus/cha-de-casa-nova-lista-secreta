import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Gift } from "@/types/gift";
import { initialGifts } from "@/data/initialGifts";

export const useGifts = () => {
  const queryClient = useQueryClient();

  const { data: gifts = [], isLoading } = useQuery({
    queryKey: ['gifts'],
    queryFn: async () => {
      try {
        const { data: gifts, error } = await supabase
          .from('gifts')
          .select('*');

        if (error) {
          console.error('Error fetching gifts:', error);
          return initialGifts;
        }

        if (!gifts || gifts.length === 0) {
          console.log('No gifts found in database, using initial gifts');
          return initialGifts;
        }

        return gifts;
      } catch (error) {
        console.error('Failed to fetch gifts:', error);
        return initialGifts;
      }
    },
    initialData: initialGifts
  });

  const chooseGift = async (giftId: number, userName: string) => {
    try {
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
    } catch (error) {
      console.error('Failed to choose gift:', error);
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
        console.error('Error resetting gifts:', error);
        return false;
      }

      queryClient.invalidateQueries({ queryKey: ['gifts'] });
      return true;
    } catch (error) {
      console.error('Failed to reset gifts:', error);
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