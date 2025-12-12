import { useState, useEffect } from "react";
import { toast } from "sonner";

export type OrderStatus = 
  | "pending" 
  | "confirmed" 
  | "preparing" 
  | "dispatched" 
  | "delivered" 
  | "cancelled";

export interface Order {
  id: string;
  date: Date;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: OrderStatus;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  trackingCode?: string;
}

const ORDERS_STORAGE_KEY = "abreai_orders";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved).map((o: Order) => ({
      ...o,
      date: new Date(o.date),
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      date: new Date(),
      status: "pending",
      trackingCode: generateTrackingCode(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    toast.success("Pedido criado com sucesso! 🎉", {
      description: `Código: ${newOrder.trackingCode}`,
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    const statusMessages = {
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

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  const getOrderByTrackingCode = (trackingCode: string) => {
    return orders.find((order) => order.trackingCode === trackingCode);
  };

  const generateTrackingCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "AB";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  return {
    orders,
    createOrder,
    updateOrderStatus,
    getOrder,
    getOrderByTrackingCode,
    ordersCount: orders.length,
  };
};