import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

interface GiftCardProps {
  id: number;
  name: string;
  description: string;
  chosen: boolean;
  chosenBy?: string;
  isAdmin?: boolean;
  onChoose?: (id: number) => void;
}

export const GiftCard = ({ 
  id, 
  name, 
  description, 
  chosen, 
  chosenBy, 
  isAdmin = false,
  onChoose 
}: GiftCardProps) => {
  if (isAdmin) {
    return (
      <Card className={chosen ? "opacity-75" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-sage-600" />
              {name}
            </div>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              chosen 
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}>
              {chosen ? "Indisponível" : "Disponível"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">{description}</p>
          {chosen && chosenBy && (
            <p className="text-sm font-medium text-sage-600">
              Escolhido por: <span className="font-bold">{chosenBy}</span>
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-sage-600" />
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        {!chosen && onChoose && (
          <Button 
            onClick={() => onChoose(id)}
            className="w-full bg-sage-600 hover:bg-sage-700"
          >
            Escolher Este Presente
          </Button>
        )}
        {chosen && (
          <span className="block text-center text-red-600 font-medium">
            Indisponível
          </span>
        )}
      </CardContent>
    </Card>
  );
};