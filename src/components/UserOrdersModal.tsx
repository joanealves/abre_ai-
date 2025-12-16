import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Package, Calendar, DollarSign, MapPin } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import type { OrderStatus } from "@/hooks/use-orders";
import { useAuth } from "@/contexts/AuthContext";
import { ScrollArea } from "./ui/scroll-area";

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserOrdersModal = ({ isOpen, onClose }: UserOrdersModalProps) => {
  const { orders } = useOrders();
  const { user } = useAuth();

  // Filtrar pedidos do usuário logado
  const userOrders = orders.filter(
    (order) => order.customerEmail === user?.email
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "confirmed":
        return "bg-blue-500";
      case "preparing":
        return "bg-purple-500";
      case "dispatched":
        return "bg-orange-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    const labels = {
      pending: "Pendente",
      confirmed: "Confirmado",
      preparing: "Preparando",
      dispatched: "Em Entrega",
      delivered: "Entregue",
      cancelled: "Cancelado",
    };
    return labels[status];
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Meus Pedidos
          </DialogTitle>
          <DialogDescription>
            {userOrders.length === 0
              ? "Você ainda não fez nenhum pedido"
              : `${userOrders.length} ${
                  userOrders.length === 1 ? "pedido" : "pedidos"
                } encontrado(s)`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          {userOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Você ainda não tem pedidos
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Explore nossos produtos e faça seu primeiro pedido!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                      </div>
                      {order.trackingCode && (
                        <p className="text-sm text-muted-foreground">
                          Rastreio: {order.trackingCode}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        R$ {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(order.date)}
                    </div>
                  </div>

                  <Separator className="my-3" />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Itens do Pedido:</h4>
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.deliveryAddress && (
                    <>
                      <Separator className="my-3" />
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Endereço de Entrega:</p>
                          <p className="text-muted-foreground">
                            {order.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default UserOrdersModal;