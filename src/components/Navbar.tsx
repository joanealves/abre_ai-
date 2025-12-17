import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Cart from "./Cart";
import Favorites from "./Favorites";
import OrderTracking from "./OrderTracking";
import UserProfile from "./UserProfile";

/**
 * Navbar - Barra de Navegação Principal
 * 
 * COMPONENTES:
 * - UserProfile: Perfil do usuário
 * - OrderTracking: Rastreamento de pedidos
 * - Favorites: Favoritos
 * - Cart: Carrinho de compras
 */

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-serif font-bold text-cestas-sage">
              ABRE AÍ!
            </h1>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#sobre"
              className="text-sm font-medium text-white hover:text-primary transition-colors"
            >
              Sobre
            </a>
            <a
              href="#galeria"
              className="text-sm font-medium text-white hover:text-primary transition-colors"
            >
              Galeria
            </a>
            <a
              href="#como-funciona"
              className="text-sm font-medium text-white hover:text-primary transition-colors"
            >
              Como Funciona
            </a>

            {/* Perfil do Usuário */}
            <UserProfile />

            {/* Rastreamento de Pedidos */}
            <OrderTracking />

            {/* Favoritos */}
            <Favorites />

            {/* Carrinho */}
            <Cart />

            {/* Fale Conosco */}
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() =>
                window.open(
                  "https://wa.me/5511999999999?text=Olá! Gostaria de falar com o atendimento",
                  "_blank"
                )
              }
            >
              Fale Conosco
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <UserProfile />
            <OrderTracking />
            <Favorites />
            <Cart />
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;