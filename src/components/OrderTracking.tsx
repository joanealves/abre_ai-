import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Package,
  Search,
  CheckCircle,
  Clock,
  Truck,
  Home,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useOrders } from "@/hooks/use-orders";
import type { Order, OrderStatus } from "@/hooks/use-orders";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type StatusInfo = {
  label: string;
  icon: LucideIcon;
  color: string;
  description: string;
};

const statusMap: Record<OrderStatus, StatusInfo> = {
  pending: {
    label: "Aguardando Confirmação",
    icon: Clock,
    color: "bg-yellow-500",
    description: "Seu pedido está sendo processado",
  },
  confirmed: {
    label: "Confirmado",
    icon: CheckCircle,
    color: "bg-blue-500",
    description: "Pedido confirmado e em preparação",
  },
  preparing: {
    label: "Em Preparação",
    icon: Package,
    color: "bg-purple-500",
    description: "Estamos preparando seu pedido com carinho",
  },
  dispatched: {
    label: "Em Transporte",
    icon: Truck,
    color: "bg-orange-500",
    description: "Seu pedido saiu para entrega",
  },
  delivered: {
    label: "Entregue",
    icon: Home,
    color: "bg-green-500",
    description: "Pedido entregue! Aproveite!",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-500",
    description: "Pedido cancelado",
  },
};

const progressMap: Record<OrderStatus, number> = {
  pending: 20,
  confirmed: 40,
  preparing: 60,
  dispatched: 80,
  delivered: 100,
  cancelled: 0,
};

const OrderTracking = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const { getOrderByTrackingCode } = useOrders();
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  const handleTrack = () => {
    if (!trackingCode.trim()) {
      toast.error("Digite um código de rastreamento");
      return;
    }

    const order = getOrderByTrackingCode(trackingCode.toUpperCase());

    if (!order) {
      toast.error("Pedido não encontrado", {
        description: "Verifique o código e tente novamente",
      });
      setTrackedOrder(null);
      return;
    }

    setTrackedOrder(order);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Package className="h-4 w-4" />
          Rastrear Pedido
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Rastreamento de Pedido</DialogTitle>
          <DialogDescription>
            Digite o código de rastreamento para acompanhar seu pedido
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="tracking">Código de Rastreamento</Label>
              <Input
                id="tracking"
                placeholder="Ex: AB12345678"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                className="mt-1"
                maxLength={10}
              />
            </div>
            <Button onClick={handleTrack} className="mt-6">
              <Search className="h-4 w-4 mr-2" />
              Rastrear
            </Button>
          </div>

          {trackedOrder && (
            <Card className="border-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      Pedido #{trackedOrder.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {format(trackedOrder.date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>

                  <Badge className={statusMap[trackedOrder.status].color}>
                    {statusMap[trackedOrder.status].label}
                  </Badge>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${statusMap[trackedOrder.status].color}`}
                    style={{ width: `${progressMap[trackedOrder.status]}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderTracking;
