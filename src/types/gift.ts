export interface Gift {
  id: number;
  name: string;
  description: string;
  chosen: boolean;
  chosenBy?: string;
}