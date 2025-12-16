import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User, LogOut, Package, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "./AuthModal";
import UserOrdersModal from "./UserOrdersModal";
import UserSettingsModal from "./UserSettingsModal";

const UserProfile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
        >
          <User className="h-4 w-4 mr-2" />
          Entrar
        </Button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            {user?.name.split(" ")[0]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsOrdersModalOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Meus Pedidos
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserOrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
      />
      
      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
};

export default UserProfile;