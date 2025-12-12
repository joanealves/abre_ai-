import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import Cart from "./Cart";
import { useCart } from "../hooks/use-cart";

const Navbar = () => {
  const { items, updateQuantity, removeItem, checkout } = useCart();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-serif font-bold text-cestas-sage">ABRE AÍ!</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#sobre" className="text-sm font-medium hover:text-primary transition-colors">
              Sobre
            </a>
            <a href="#galeria" className="text-sm font-medium hover:text-primary transition-colors">
              Galeria
            </a>
            <a href="#como-funciona" className="text-sm font-medium hover:text-primary transition-colors">
              Como Funciona
            </a>
            <Cart 
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={checkout}
            />
            <Button 
              size="sm" 
              className="bg-primary hover:bg-primary/90"
              onClick={() => window.open("https://wa.me/5511999999999?text=Olá! Gostaria de falar com o atendimento", "_blank")}
            >
              Fale Conosco
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Cart 
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onCheckout={checkout}
            />
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