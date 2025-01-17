export interface Gift {
  id: number;
  name: string;
  description: string;
  chosen: boolean;
  chosen_by?: string | null;
}