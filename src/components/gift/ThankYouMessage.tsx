interface ThankYouMessageProps {
  userName: string;
}

export const ThankYouMessage = ({ userName }: ThankYouMessageProps) => {
  return (
    <div className="w-full max-w-4xl space-y-6 animate-fadeIn text-center">
      <div className="bg-sage-50 p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-sage-700">Obrigado, {userName}!</h2>
        <p className="text-lg text-sage-600 mb-2">
          Sua escolha foi registrada com sucesso.
        </p>
        <p className="text-muted-foreground">
          Agradecemos sua participação neste momento especial.
        </p>
      </div>
    </div>
  );
};