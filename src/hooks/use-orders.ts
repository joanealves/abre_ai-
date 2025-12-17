import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/types/types";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "dispatched" 
  | "delivered" 
  | "cancelled";

export interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Order {
  id: string;
  date: Date;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
  trackingCode?: string;
}

const ORDERS_STORAGE_KEY = "abreai_orders";

/**
 * Hook de Pedidos - Gerencia o ciclo de vida dos pedidos
 * 
 * RESPONSABILIDADES:
 * - Criar pedidos a partir do carrinho
 * - Gerenciar status dos pedidos
 * - Persistir pedidos no localStorage
 * - Gerar códigos de rastreamento
 */
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (!saved) return [];
      
      return JSON.parse(saved).map((o: Order) => ({
        ...o,
        date: new Date(o.date),
      }));
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      return [];
    }
  });

  // Sincroniza com localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Erro ao salvar pedidos:", error);
    }
  }, [orders]);

  /**
   * Gera código de rastreamento único
   */
  const generateTrackingCode = (): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "AB";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Garante unicidade
    const exists = orders.some(o => o.trackingCode === code);
    return exists ? generateTrackingCode() : code;
  };

  /**
   * Cria um novo pedido a partir dos itens do carrinho
   */
  const createOrder = (
    cartItems: CartItem[],
    customerData?: {
      name?: string;
      email?: string;
      phone?: string;
      deliveryAddress?: string;
      paymentMethod?: string;
    }
  ): Order => {
    if (cartItems.length === 0) {
      throw new Error("Não é possível criar pedido com carrinho vazio");
    }

    const orderItems: OrderItem[] = cartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
    }));

    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date(),
      items: orderItems,
      total,
      status: "pending",
      trackingCode: generateTrackingCode(),
      ...customerData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    
    toast.success("Pedido criado com sucesso! 🎉", {
      description: `Código de rastreamento: ${newOrder.trackingCode}`,
      duration: 5000,
    });

    return newOrder;
  };

  /**
   * Atualiza status de um pedido
   */
  const updateOrderStatus = (orderId: string, status: OrderStatus): void => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    const statusMessages: Record<OrderStatus, string> = {
      pending: "Pedido aguardando confirmação...",
      confirmed: "Pedido confirmado! ✅",
      preparing: "Preparando seu pedido... 📦",
      dispatched: "Pedido saiu para entrega! 🚚",
      delivered: "Pedido entregue! Aproveite! 🎉",
      cancelled: "Pedido cancelado",
    };

    if (status !== "pending") {
      toast.success(statusMessages[status]);
    }
  };

  /**
   * Busca pedido por ID
   */
  const getOrder = (orderId: string): Order | undefined => {
    return orders.find((order) => order.id === orderId);
  };

  /**
   * Busca pedido por código de rastreamento
   */
  const getOrderByTrackingCode = (trackingCode: string): Order | undefined => {
    return orders.find(
      (order) => order.trackingCode?.toUpperCase() === trackingCode.toUpperCase()
    );
  };

  /**
   * Retorna pedidos de um usuário específico (por email)
   */
  const getUserOrders = (userEmail: string): Order[] => {
    return orders.filter(
      (order) => order.customerEmail?.toLowerCase() === userEmail.toLowerCase()
    );
  };

  /**
   * Cancela um pedido
   */
  const cancelOrder = (orderId: string): void => {
    const order = getOrder(orderId);
    
    if (!order) {
      toast.error("Pedido não encontrado");
      return;
    }

    if (order.status === "delivered") {
      toast.error("Não é possível cancelar um pedido já entregue");
      return;
    }

    if (order.status === "cancelled") {
      toast.info("Este pedido já está cancelado");
      return;
    }

    updateOrderStatus(orderId, "cancelled");
  };

  return {
    // Estado
    orders,
    
    // Actions
    createOrder,
    updateOrderStatus,
    cancelOrder,
    
    // Getters
    getOrder,
    getOrderByTrackingCode,
    getUserOrders,
    ordersCount: orders.length,
  };
};