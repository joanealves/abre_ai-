import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  ShoppingCart,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * CheckoutModal - Fluxo Completo de Finalização de Pedido
 * 
 * FLUXO:
 * 1. Revisão do carrinho
 * 2. Dados do cliente (se não autenticado)
 * 3. Endereço de entrega
 * 4. Forma de pagamento
 * 5. Confirmação e criação do pedido
 * 6. Limpeza do carrinho
 * 7. Redirecionamento para WhatsApp (opcional)
 */

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutStep = "review" | "customer" | "delivery" | "payment" | "success";

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  
  const [step, setStep] = useState<CheckoutStep>("review");
  const [orderCode, setOrderCode] = useState<string>("");
  
  // Dados do formulário
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleClose = () => {
    // Reset do formulário
    setStep("review");
    setCustomerName(user?.name || "");
    setCustomerEmail(user?.email || "");
    setCustomerPhone(user?.phone || "");
    setDeliveryAddress("");
    setPaymentMethod("");
    setOrderCode("");
    onClose();
  };

  const validateCustomerData = (): boolean => {
    if (!customerName.trim()) {
      toast.error("Por favor, informe seu nome");
      return false;
    }
    if (!customerEmail.trim() || !customerEmail.includes("@")) {
      toast.error("Por favor, informe um email válido");
      return false;
    }
    if (!customerPhone.trim()) {
      toast.error("Por favor, informe seu telefone");
      return false;
    }
    return true;
  };

  const validateDeliveryData = (): boolean => {
    if (!deliveryAddress.trim()) {
      toast.error("Por favor, informe o endereço de entrega");
      return false;
    }
    return true;
  };

  const validatePaymentData = (): boolean => {
    if (!paymentMethod) {
      toast.error("Por favor, selecione a forma de pagamento");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    switch (step) {
      case "review":
        if (items.length === 0) {
          toast.error("Seu carrinho está vazio!");
          return;
        }
        setStep(user ? "delivery" : "customer");
        break;
        
      case "customer":
        if (validateCustomerData()) {
          setStep("delivery");
        }
        break;
        
      case "delivery":
        if (validateDeliveryData()) {
          setStep("payment");
        }
        break;
        
      case "payment":
        if (validatePaymentData()) {
          handleFinishOrder();
        }
        break;
    }
  };

  const handleFinishOrder = () => {
    try {
      // Cria o pedido
      const order = createOrder(items, {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        deliveryAddress,
        paymentMethod,
      });

      setOrderCode(order.trackingCode || "");
      setStep("success");

      // Prepara mensagem para WhatsApp
      const itemsList = items
        .map(
          (item) =>
            `• ${item.name} (${item.quantity}x) - ${formatPrice(
              item.price * item.quantity
            )}`
        )
        .join("\n");

      const message = `
*Novo Pedido - ABRE AÍ!*

*Código:* ${order.trackingCode}

*Cliente:* ${customerName}
*Telefone:* ${customerPhone}
*Email:* ${customerEmail}

*Endereço de Entrega:*
${deliveryAddress}

*Itens:*
${itemsList}

*Forma de Pagamento:* ${paymentMethod}
*Total:* ${formatPrice(getTotalPrice())}

Obrigado pelo seu pedido! 🎉
      `.trim();

      // Abre WhatsApp (não bloqueia o fluxo)
      setTimeout(() => {
        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
          message
        )}`;
        window.open(whatsappUrl, "_blank");
      }, 1000);

      // Limpa o carrinho após criar o pedido
      setTimeout(() => {
        clearCart();
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao finalizar pedido. Tente novamente.");
    }
  };

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Revise seu pedido</h3>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Seu carrinho está vazio
        </div>
      ) : (
        <>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <p className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete:</span>
              <span>Calculado após confirmação</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-primary">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>

          <Button onClick={handleNextStep} className="w-full" size="lg">
            Continuar
          </Button>
        </>
      )}
    </div>
  );

  const renderCustomerStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Seus dados</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nome completo *</Label>
          <Input
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              placeholder="seu@email.com"
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Telefone (com DDD) *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep("review")} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleNextStep} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderDeliveryStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Endereço de entrega</h3>
      </div>

      <div>
        <Label htmlFor="address">Endereço completo *</Label>
        <Textarea
          id="address"
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Rua, número, complemento, bairro, cidade - CEP"
          rows={4}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Inclua rua, número, complemento, bairro, cidade e CEP
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep(user ? "review" : "customer")}
          className="flex-1"
        >
          Voltar
        </Button>
        <Button onClick={handleNextStep} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-lg">Forma de pagamento</h3>
      </div>

      <div>
        <Label htmlFor="payment">Selecione a forma de pagamento *</Label>
        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
          <SelectTrigger id="payment">
            <SelectValue placeholder="Escolha como deseja pagar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pix">PIX</SelectItem>
            <SelectItem value="credito">Cartão de Crédito</SelectItem>
            <SelectItem value="debito">Cartão de Débito</SelectItem>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentMethod && (
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <p className="text-sm font-medium">Resumo do pedido:</p>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Valor:</span>
            <span className="font-bold">{formatPrice(getTotalPrice())}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Pagamento:</span>
            <span className="capitalize">{paymentMethod}</span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep("delivery")} className="flex-1">
          Voltar
        </Button>
        <Button onClick={handleNextStep} className="flex-1">
          Finalizar Pedido
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-4 text-center py-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-2">Pedido Realizado!</h3>
        <p className="text-muted-foreground">
          Seu pedido foi criado com sucesso
        </p>
      </div>

      {orderCode && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">
            Código de rastreamento:
          </p>
          <p className="text-2xl font-mono font-bold">{orderCode}</p>
        </div>
      )}

      <div className="space-y-2 text-sm text-muted-foreground">
        <p>✅ Pedido confirmado</p>
        <p>📱 Mensagem enviada via WhatsApp</p>
        <p>📧 Você receberá atualizações por email</p>
      </div>

      <Button onClick={handleClose} className="w-full" size="lg">
        Fechar
      </Button>
    </div>
  );

  const getStepContent = () => {
    switch (step) {
      case "review":
        return renderReviewStep();
      case "customer":
        return renderCustomerStep();
      case "delivery":
        return renderDeliveryStep();
      case "payment":
        return renderPaymentStep();
      case "success":
        return renderSuccessStep();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === "success" ? "Pedido Concluído" : "Finalizar Pedido"}
          </DialogTitle>
          <DialogDescription>
            {step === "review" && "Revise os itens do seu pedido"}
            {step === "customer" && "Informe seus dados para contato"}
            {step === "delivery" && "Onde devemos entregar seu pedido?"}
            {step === "payment" && "Como você deseja pagar?"}
            {step === "success" && "Seu pedido foi criado com sucesso!"}
          </DialogDescription>
        </DialogHeader>

        {getStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;