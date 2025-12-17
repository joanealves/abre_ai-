import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/types/types";

const CART_STORAGE_KEY = "abreai_cart";

/**
 * Hook de Carrinho - Fonte Única da Verdade
 * 
 * RESPONSABILIDADES:
 * - Gerenciar itens do carrinho
 * - Persistir no localStorage
 * - Sincronizar com UI
 * 
 * NÃO FAZ:
 * - Criar pedidos (responsabilidade de use-orders)
 * - Gerenciar checkout (responsabilidade de CheckoutModal)
 */
export const useCart = () => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      return [];
    }
  });

  // Sincroniza com localStorage sempre que items mudar
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }, [items]);

  /**
   * Adiciona ou atualiza item no carrinho
   */
  const addItem = (
    product: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    if (quantity <= 0) {
      toast.error("Quantidade inválida");
      return;
    }

    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        toast.success(`${product.name} - quantidade atualizada!`);
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      toast.success(`${product.name} adicionado ao carrinho!`);
      return [...prevItems, { ...product, quantity }];
    });
  };

  /**
   * Atualiza quantidade de um item específico
   */
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeItem(id);
      return;
    }

    if (quantity < 0) {
      toast.error("Quantidade não pode ser negativa");
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Remove item do carrinho
   */
  const removeItem = (id: number) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      toast.info(`${item.name} removido do carrinho`);
    }
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  /**
   * Limpa todo o carrinho
   */
  const clearCart = () => {
    setItems([]);
    toast.success("Carrinho limpo!");
  };

  /**
   * Verifica se um item está no carrinho
   */
  const isInCart = (id: number): boolean => {
    return items.some(item => item.id === id);
  };

  /**
   * Retorna quantidade de um item específico no carrinho
   */
  const getItemQuantity = (id: number): number => {
    const item = items.find(i => i.id === id);
    return item?.quantity || 0;
  };

  /**
   * Retorna total de itens (soma de todas as quantidades)
   */
  const getItemCount = (): number => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  /**
   * Retorna preço total do carrinho
   */
  const getTotalPrice = (): number => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return {
    // Estado
    items,
    
    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    
    // Getters
    isInCart,
    getItemQuantity,
    getItemCount,
    getTotalPrice,
  };
};