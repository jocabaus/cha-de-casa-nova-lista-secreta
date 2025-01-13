import { useState } from "react";
import { NameInput } from "@/components/NameInput";
import { GiftList } from "@/components/GiftList";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [userName, setUserName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setShowAdminLogin(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sage-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 title-gradient">
            Chá de Casa Nova
          </h1>
          <h2 className="text-2xl md:text-3xl text-sage-700 mb-8">
            Laura
          </h2>
          
          {!isAdmin && (
            <Button
              variant="ghost"
              className="text-sage-600 hover:text-sage-700 mb-8"
              onClick={() => setShowAdminLogin(true)}
            >
              Área Administrativa
            </Button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          {showAdminLogin ? (
            <AdminLogin onLogin={handleAdminLogin} />
          ) : !userName && !isAdmin ? (
            <NameInput onNameSubmit={handleNameSubmit} />
          ) : (
            <GiftList userName={userName} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;