import { createContext, useContext, type ReactNode } from "react";
import { useCart as useCartHook } from "@/hooks/use-cart";
import type { CartItem } from "@/types/types";

/**
 * CartContext - Provedor Global de Estado do Carrinho
 * 
 * IMPORTANTE: Este é o ÚNICO lugar onde useCart hook é chamado.
 * Todos os componentes devem usar useCart() do context, não do hook direto.
 */

interface CartContextType {
  items: CartItem[];
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  isInCart: (id: number) => boolean;
  getItemQuantity: (id: number) => number;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  // ÚNICO lugar onde o hook é instanciado
  const cart = useCartHook();

  return (
    <CartContext.Provider value={cart}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook para acessar o carrinho
 * 
 * SEMPRE use este hook, NUNCA importe useCart de hooks/use-cart.ts diretamente
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider. " +
      "Wrap your app with <CartProvider>"
    );
  }
  
  return context;
};