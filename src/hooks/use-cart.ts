// import { useState, useEffect } from "react";
// import { toast } from "sonner";
// import type { CartItem } from "@/components/Cart";

// const CART_STORAGE_KEY = "abreai_cart";

// export const useCart = () => {
//   const [items, setItems] = useState<CartItem[]>(() => {
//     const savedCart = localStorage.getItem(CART_STORAGE_KEY);
//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
//   }, [items]);

//   const addItem = (
//     product: Omit<CartItem, "quantity">,
//     quantity: number = 1
//   ) => {
//     setItems((prevItems) => {
//       const existingItem = prevItems.find((item) => item.id === product.id);

//       if (existingItem) {
//         toast.success(`${product.name} - quantidade atualizada!`);
//         return prevItems.map((item) =>
//           item.id === product.id
//             ? { ...item, quantity: item.quantity + quantity }
//             : item
//         );
//       }

//       toast.success(`${product.name} adicionado ao carrinho!`);
//       return [...prevItems, { ...product, quantity }];
//     });
//   };

//   const updateQuantity = (id: number, quantity: number) => {
//     if (quantity === 0) {
//       removeItem(id);
//       return;
//     }

//     setItems((prevItems) =>
//       prevItems.map((item) =>
//         item.id === id ? { ...item, quantity } : item
//       )
//     );
//   };

//   const removeItem = (id: number) => {
//     const item = items.find((i) => i.id === id);
//     if (item) {
//       toast.info(`${item.name} removido do carrinho`);
//     }
//     setItems((prevItems) => prevItems.filter((item) => item.id !== id));
//   };

//   const clearCart = () => {
//     setItems([]);
//     toast.success("Carrinho limpo!");
//   };

//   const getItemCount = () => {
//     return items.reduce((sum, item) => sum + item.quantity, 0);
//   };

//   const getTotalPrice = () => {
//     return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   };

//   const checkout = () => {
//     if (items.length === 0) {
//       toast.error("Seu carrinho está vazio!");
//       return;
//     }

//     const itemsList = items
//       .map(
//         (item) =>
//           `• ${item.name} (${item.quantity}x) - R$ ${(
//             item.price * item.quantity
//           ).toFixed(2)}`
//       )
//       .join("\n");

//     const total = getTotalPrice();

//     const message = `
// *Novo Pedido - ABRE AÍ!*

// *Itens:*
// ${itemsList}

// *Total: R$ ${total.toFixed(2)}*

// Gostaria de finalizar este pedido!
//     `.trim();

//     const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
//       message
//     )}`;

//     window.open(whatsappUrl, "_blank");
//     toast.success("Redirecionando para WhatsApp!");

//     // Limpa o carrinho após 2 segundos
//     setTimeout(() => {
//       clearCart();
//     }, 2000);
//   };

//   return {
//     items,
//     addItem,
//     updateQuantity,
//     removeItem,
//     clearCart,
//     getItemCount,
//     getTotalPrice,
//     checkout,
//   };
// };


import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: "rolee" | "cestas" | "bebidas" | "chocolates" | "petiscos";
  image?: string;
  description?: string;
}

const CART_STORAGE_KEY = "abreai_cart";

export const useCart = () => {
  // Estado inicial lendo do localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Erro ao carregar carrinho:", error);
      return [];
    }
  });

  // Salva no localStorage sempre que items mudar
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      console.log("Carrinho atualizado:", items); // Debug
    } catch (error) {
      console.error("Erro ao salvar carrinho:", error);
    }
  }, [items]);

  const addItem = (
    product: Omit<CartItem, "quantity">,
    quantity: number = 1
  ) => {
    console.log("Adicionando item:", product, "Quantidade:", quantity); // Debug
    
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex !== -1) {
        // Item já existe, atualiza quantidade
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity,
        };
        
        toast.success(`${product.name} atualizado!`, {
          description: `Quantidade: ${newItems[existingItemIndex].quantity} unidades`,
        });
        
        console.log("Item atualizado:", newItems); // Debug
        return newItems;
      }

      // Item novo
      toast.success(`${product.name} adicionado!`, {
        description: `${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}`,
      });
      
      const newItems = [...prevItems, { ...product, quantity }];
      console.log("Novo item adicionado:", newItems); // Debug
      return newItems;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    console.log("Atualizando quantidade:", id, quantity); // Debug
    
    if (quantity === 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      console.log("Quantidade atualizada:", newItems); // Debug
      return newItems;
    });
  };

  const removeItem = (id: number) => {
    console.log("Removendo item:", id); // Debug
    
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (item) {
        toast.info(`${item.name} removido`);
      }
      const newItems = prevItems.filter((item) => item.id !== id);
      console.log("Item removido:", newItems); // Debug
      return newItems;
    });
  };

  const clearCart = () => {
    console.log("Limpando carrinho"); // Debug
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.success("Carrinho limpo!");
  };

  const getItemCount = () => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    console.log("Total de itens:", count); // Debug
    return count;
  };

  const getTotalPrice = () => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    console.log("Preço total:", total); // Debug
    return total;
  };

  const checkout = () => {
    if (items.length === 0) {
      toast.error("Seu carrinho está vazio!");
      return;
    }

    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} (${item.quantity}x) - R$ ${(
            item.price * item.quantity
          ).toFixed(2)}`
      )
      .join("\n");

    const total = getTotalPrice();

    const message = `
*Novo Pedido - ABRE AÍ!*

*Itens:*
${itemsList}

*Total: R$ ${total.toFixed(2)}*

Gostaria de finalizar este pedido!
    `.trim();

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    toast.success("Redirecionando para WhatsApp!");

    // Limpa o carrinho após 2 segundos
    setTimeout(() => {
      clearCart();
    }, 2000);
  };

  console.log("Hook useCart renderizado. Items:", items.length); // Debug

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemCount,
    getTotalPrice,
    checkout,
  };
};