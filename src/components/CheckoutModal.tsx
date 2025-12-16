import { useState, useEffect } from "react";
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
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { toast } from "sonner";
import { 
  ShoppingCart, 
  Tag, 
  Mail, 
  Phone, 
  MapPin, 
  User as UserIcon, 
  Percent,
  CreditCard,
  Check,
  ArrowLeft,
  ArrowRight,
  Package,
  Truck,
  Clock
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/use-orders";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DiscountCoupon = {
  discount: number;
  label: string;
  freeShipping?: boolean;
};

type PaymentMethod = "pix" | "card_link" | "mercado_pago";
type DeliveryMethod = "standard" | "express" | "pickup";

type CheckoutStep = 1 | 2 | 3 | 4;

type DeliveryOptions = {
  [K in DeliveryMethod]: {
    label: string;
    price: number;
    days: string;
  };
};

// Cupons de desconto disponíveis
const DISCOUNT_COUPONS: Record<string, DiscountCoupon> = {
  PRIMEIRA: { discount: 10, label: "10% OFF - Primeira Compra" },
  ABREAI10: { discount: 10, label: "10% OFF" },
  ABREAI15: { discount: 15, label: "15% OFF" },
  ABREAI20: { discount: 20, label: "20% OFF" },
  FRETEGRATIS: { discount: 0, label: "Frete Grátis", freeShipping: true },
};

const DELIVERY_OPTIONS: DeliveryOptions = {
  standard: { label: "Padrão", price: 15, days: "5-7 dias úteis" },
  express: { label: "Express", price: 35, days: "2-3 dias úteis" },
  pickup: { label: "Retirada", price: 0, days: "Disponível amanhã" },
};

const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrders();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<keyof typeof DISCOUNT_COUPONS | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");

  // Preencher dados do usuário automaticamente se estiver logado
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address || "",
        notes: "",
      });
    }
  }, [isAuthenticated, user]);

  // Reset ao fechar
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      if (!isAuthenticated) {
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
        });
      }
      setCouponCode("");
      setAppliedCoupon(null);
      setPaymentMethod("pix");
      setDeliveryMethod("standard");
    }
  }, [isOpen, isAuthenticated]);

  const subtotal = getTotalPrice();
  const deliveryPrice = appliedCoupon && DISCOUNT_COUPONS[appliedCoupon]?.freeShipping 
    ? 0 
    : DELIVERY_OPTIONS[deliveryMethod].price;
  const discount = appliedCoupon ? (subtotal * DISCOUNT_COUPONS[appliedCoupon].discount) / 100 : 0;
  const total = subtotal + deliveryPrice - discount;

  const handleApplyCoupon = () => {
    const upperCoupon = couponCode.toUpperCase() as keyof typeof DISCOUNT_COUPONS;
    
    if (DISCOUNT_COUPONS[upperCoupon]) {
      setAppliedCoupon(upperCoupon);
      toast.success("Cupom aplicado! 🎉", {
        description: DISCOUNT_COUPONS[upperCoupon].label,
      });
    } else {
      toast.error("Cupom inválido");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Cupom removido");
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return items.length > 0;
      case 2:
        return formData.name && formData.email && formData.phone && formData.address;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      setCurrentStep((prev) => Math.min(4, prev + 1) as CheckoutStep);
    } else {
      if (currentStep === 2) {
        toast.error("Preencha todos os campos obrigatórios");
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as CheckoutStep);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      // Criar pedido
      const order = createOrder({
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
      });

      // Preparar mensagem WhatsApp
      const itemsList = items
        .map((item) => `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`)
        .join("\n");

      const paymentMethodLabel: Record<PaymentMethod, string> = {
        pix: "PIX",
        card_link: "Cartão de Crédito (Link de Pagamento)",
        mercado_pago: "Mercado Pago"
      };

      const whatsappMessage = `
*🎉 NOVO PEDIDO - ABRE AÍ!*

*Código de Rastreamento:* ${order.trackingCode}
*Pedido:* ${order.id}

*Cliente:*
Nome: ${formData.name}
Email: ${formData.email}
Telefone: ${formData.phone}

*Endereço de Entrega:*
${formData.address}

*Itens:*
${itemsList}

*Resumo do Pedido:*
Subtotal: R$ ${subtotal.toFixed(2)}
Entrega (${DELIVERY_OPTIONS[deliveryMethod].label}): R$ ${deliveryPrice.toFixed(2)}
${appliedCoupon ? `Desconto (${DISCOUNT_COUPONS[appliedCoupon].label}): -R$ ${discount.toFixed(2)}` : ""}
*TOTAL: R$ ${total.toFixed(2)}*

*Forma de Pagamento:* ${paymentMethodLabel[paymentMethod]}
*Prazo de Entrega:* ${DELIVERY_OPTIONS[deliveryMethod].days}

${formData.notes ? `*Observações:*\n${formData.notes}` : ""}

Confirme este pedido para prosseguir! ✅
      `.trim();

      const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;

      // Limpar carrinho e fechar modal
      setTimeout(() => {
        clearCart();
        onClose();
        window.open(whatsappUrl, "_blank");
        
        toast.success("Pedido enviado com sucesso! 🎉", {
          description: `Código de rastreamento: ${order.trackingCode}`,
          duration: 5000,
        });

        // Resetar formulário
        if (!isAuthenticated) {
          setFormData({
            name: "",
            email: "",
            phone: "",
            address: "",
            notes: "",
          });
        } else {
          setFormData(prev => ({ ...prev, notes: "" }));
        }
        setAppliedCoupon(null);
        setCouponCode("");
        setCurrentStep(1);
      }, 500);

    } catch (error) {
      toast.error("Erro ao processar pedido");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 flex flex-col">
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Finalizar Pedido
            </DialogTitle>
            <DialogDescription>
              {isAuthenticated 
                ? "Revise seus dados e finalize seu pedido"
                : "Preencha seus dados para finalizar"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Steps */}
          <div className="px-6 py-4 bg-muted/50">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {[
                { num: 1, label: "Carrinho", icon: ShoppingCart },
                { num: 2, label: "Entrega", icon: Truck },
                { num: 3, label: "Pagamento", icon: CreditCard },
                { num: 4, label: "Resumo", icon: Check }
              ].map((step, index) => (
                <div key={step.num} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${currentStep >= step.num 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'}
                      transition-colors
                    `}>
                      {currentStep > step.num ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`
                      text-xs mt-2 font-medium
                      ${currentStep >= step.num ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {step.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`
                      h-[2px] flex-1 mx-2
                      ${currentStep > step.num ? 'bg-primary' : 'bg-muted'}
                      transition-colors
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
            {currentStep === 1 && <Step1Cart items={items} />}
            {currentStep === 2 && (
              <Step2Delivery
                formData={formData}
                setFormData={setFormData}
                deliveryMethod={deliveryMethod}
                setDeliveryMethod={setDeliveryMethod}
                isAuthenticated={isAuthenticated}
              />
            )}
            {currentStep === 3 && (
              <Step3Payment
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={handleApplyCoupon}
                onRemoveCoupon={handleRemoveCoupon}
              />
            )}
            {currentStep === 4 && (
              <Step4Summary
                items={items}
                formData={formData}
                deliveryMethod={deliveryMethod}
                paymentMethod={paymentMethod}
                subtotal={subtotal}
                deliveryPrice={deliveryPrice}
                discount={discount}
                total={total}
                appliedCoupon={appliedCoupon}
                formatPrice={formatPrice}
              />
            )}
          </div>

          {/* Footer with Navigation */}
          <div className="px-6 py-4 border-t bg-muted/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={handlePreviousStep}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatPrice(total)}
                  </p>
                </div>

                {currentStep < 4 ? (
                  <Button
                    onClick={handleNextStep}
                    disabled={!canProceedToNextStep() || isProcessing}
                    size="lg"
                  >
                    Continuar
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    size="lg"
                  >
                    {isProcessing ? "Processando..." : "Finalizar Pedido"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

/* -------------------------------------------------------------------------- */
/* STEP COMPONENTS                                                            */
/* -------------------------------------------------------------------------- */

interface Step1CartProps {
  items: any[];
}

interface Step2DeliveryProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  setFormData: (data: any) => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  isAuthenticated: boolean;
}

interface Step3PaymentProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: keyof typeof DISCOUNT_COUPONS | null;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}

interface Step4SummaryProps {
  items: any[];
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
  };
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryPrice: number;
  discount: number;
  total: number;
  appliedCoupon: keyof typeof DISCOUNT_COUPONS | null;
  formatPrice: (price: number) => string;
}

const Step1Cart = ({ items }: Step1CartProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Package className="h-5 w-5" />
        Itens do Pedido ({items.length})
      </h3>
      
      <div className="space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card">
            <div className="flex-1">
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Quantidade: {item.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                {formatPrice(item.price * item.quantity)}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatPrice(item.price)} cada
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Step2Delivery = ({ 
  formData, 
  setFormData, 
  deliveryMethod, 
  setDeliveryMethod,
  isAuthenticated 
}: Step2DeliveryProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <UserIcon className="h-5 w-5" />
          Dados Pessoais
        </h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Seu nome completo"
              required
              disabled={isAuthenticated}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                  disabled={isAuthenticated}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                  required
                  disabled={isAuthenticated}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5" />
          Endereço de Entrega
        </h3>
        <Textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Rua, número, complemento, bairro, cidade - CEP"
          rows={3}
          required
        />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Truck className="h-5 w-5" />
          Método de Entrega
        </h3>
        <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
          {Object.entries(DELIVERY_OPTIONS).map(([key, option]) => (
            <div key={key} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value={key} id={key} />
              <Label htmlFor={key} className="flex-1 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {option.days}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {option.price === 0 ? "Grátis" : `R$ ${option.price.toFixed(2)}`}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Package className="h-5 w-5" />
          Observações (Opcional)
        </h3>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Alguma observação sobre o pedido? Ex: preferência de horário de entrega, instruções especiais..."
          rows={3}
        />
      </div>
    </div>
  );
};

const Step3Payment = ({
  paymentMethod,
  setPaymentMethod,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}: Step3PaymentProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5" />
          Forma de Pagamento
        </h3>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          {/* PIX - Método Principal */}
          <div className="flex items-center space-x-3 p-4 border-2 border-primary/50 rounded-lg hover:bg-muted/50 cursor-pointer bg-primary/5">
            <RadioGroupItem value="pix" id="pix" />
            <Label htmlFor="pix" className="flex-1 cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    PIX
                    <Badge variant="default" className="bg-primary">
                      Recomendado
                    </Badge>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Aprovação instantânea • Pagamento via QR Code
                  </p>
                </div>
              </div>
            </Label>
          </div>

          {/* Cartão Online via Link */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="card_link" id="card_link" />
            <Label htmlFor="card_link" className="flex-1 cursor-pointer">
              <div>
                <p className="font-medium">Cartão de Crédito (Link de Pagamento)</p>
                <p className="text-sm text-muted-foreground">
                  Receba um link seguro para pagar com cartão
                </p>
              </div>
            </Label>
          </div>

          {/* Mercado Pago */}
          <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
            <RadioGroupItem value="mercado_pago" id="mercado_pago" />
            <Label htmlFor="mercado_pago" className="flex-1 cursor-pointer">
              <div>
                <p className="font-medium">Mercado Pago</p>
                <p className="text-sm text-muted-foreground">
                  PIX, Cartão ou Saldo Mercado Pago
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>

        {/* Informação adicional baseada no método selecionado */}
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          {paymentMethod === "pix" && (
            <div className="flex items-start gap-2">
              <div className="bg-primary rounded-full p-1 mt-0.5">
                <Check className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Como funciona o PIX:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Você receberá o código PIX via WhatsApp</li>
                  <li>• Copie e cole no app do seu banco</li>
                  <li>• Pagamento confirmado na hora</li>
                  <li>• Seu pedido será processado imediatamente</li>
                </ul>
              </div>
            </div>
          )}
          
          {paymentMethod === "card_link" && (
            <div className="flex items-start gap-2">
              <div className="bg-blue-500 rounded-full p-1 mt-0.5">
                <CreditCard className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Como funciona o Link de Pagamento:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Você receberá um link seguro via WhatsApp</li>
                  <li>• Clique no link e insira os dados do cartão</li>
                  <li>• Parcele em até 3x sem juros</li>
                  <li>• Confirmação em até 2 minutos</li>
                </ul>
              </div>
            </div>
          )}
          
          {paymentMethod === "mercado_pago" && (
            <div className="flex items-start gap-2">
              <div className="bg-[#00AAFF] rounded-full p-1 mt-0.5">
                <CreditCard className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Como funciona o Mercado Pago:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                  <li>• Você receberá um link do Mercado Pago via WhatsApp</li>
                  <li>• Escolha entre PIX, Cartão ou Saldo MP</li>
                  <li>• Parcele em até 12x no cartão</li>
                  <li>• Ambiente seguro e confiável</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5" />
          Cupom de Desconto
        </h3>
        <div className="flex gap-2">
          <Input
            placeholder="Digite seu cupom"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            disabled={!!appliedCoupon}
          />
          {appliedCoupon ? (
            <Button type="button" variant="outline" onClick={onRemoveCoupon}>
              Remover
            </Button>
          ) : (
            <Button type="button" onClick={onApplyCoupon}>
              Aplicar
            </Button>
          )}
        </div>
        {appliedCoupon && (
          <Badge className="bg-green-500 mt-2">
            <Percent className="h-3 w-3 mr-1" />
            {DISCOUNT_COUPONS[appliedCoupon].label}
          </Badge>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          Cupons disponíveis: PRIMEIRA, ABREAI10, ABREAI15, ABREAI20, FRETEGRATIS
        </p>
      </div>
    </div>
  );
};

const Step4Summary = ({
  items,
  formData,
  deliveryMethod,
  paymentMethod,
  subtotal,
  deliveryPrice,
  discount,
  total,
  appliedCoupon,
  formatPrice
}: Step4SummaryProps) => {
  const paymentMethodLabel: Record<PaymentMethod, string> = {
    pix: "PIX",
    card_link: "Cartão de Crédito (Link)",
    mercado_pago: "Mercado Pago"
  };

  const paymentMethodDescription: Record<PaymentMethod, string> = {
    pix: "Você receberá o código PIX via WhatsApp",
    card_link: "Você receberá um link de pagamento via WhatsApp",
    mercado_pago: "Você receberá um link do Mercado Pago via WhatsApp"
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          Resumo do Pedido
        </h3>

        {/* Items */}
        <div className="space-y-2 mb-4">
          <p className="font-medium text-sm">Itens ({items.length}):</p>
          {items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        {/* Customer Info */}
        <div className="space-y-2 mb-4">
          <p className="font-medium text-sm">Dados do Cliente:</p>
          <p className="text-sm text-muted-foreground">{formData.name}</p>
          <p className="text-sm text-muted-foreground">{formData.email}</p>
          <p className="text-sm text-muted-foreground">{formData.phone}</p>
        </div>

        <Separator className="my-4" />

        {/* Delivery */}
        <div className="space-y-2 mb-4">
          <p className="font-medium text-sm">Entrega:</p>
          <p className="text-sm text-muted-foreground">{formData.address}</p>
          <p className="text-sm text-muted-foreground">
            {DELIVERY_OPTIONS[deliveryMethod].label} - {DELIVERY_OPTIONS[deliveryMethod].days}
          </p>
        </div>

        <Separator className="my-4" />

        {/* Payment */}
        <div className="space-y-2 mb-4">
          <p className="font-medium text-sm">Pagamento:</p>
          <p className="text-sm font-medium text-muted-foreground">
            {paymentMethodLabel[paymentMethod]}
          </p>
          <p className="text-xs text-muted-foreground italic">
            {paymentMethodDescription[paymentMethod]}
          </p>
        </div>

        <Separator className="my-4" />

        {/* Totals */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Entrega ({DELIVERY_OPTIONS[deliveryMethod].label})</span>
            <span className={deliveryPrice === 0 ? "text-green-600 font-medium" : ""}>
              {deliveryPrice === 0 ? "GRÁTIS" : formatPrice(deliveryPrice)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Desconto</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>TOTAL</span>
            <span className="text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Aviso importante */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
          <Check className="h-4 w-4" />
          Próximos passos:
        </p>
        <ul className="text-xs text-blue-800 space-y-1 ml-6 list-disc">
          <li>Você será redirecionado para o WhatsApp</li>
          <li>Confirme seu pedido com nossa equipe</li>
          <li>Receberá as instruções de pagamento</li>
          <li>Após confirmação, seu pedido será processado</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckoutModal;