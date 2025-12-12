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
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { ShoppingCart, Tag, Mail, Phone, MapPin, User, Percent } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useOrders } from "@/hooks/use-orders";
// import emailjs from "@emailjs/browser";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DiscountCoupon = {
  discount: number;
  label: string;
  freeShipping?: boolean;
};


// Cupons de desconto disponíveis
const DISCOUNT_COUPONS: Record<string, DiscountCoupon> = {
  PRIMEIRA: { discount: 10, label: "10% OFF - Primeira Compra" },
  ABREAI10: { discount: 10, label: "10% OFF" },
  ABREAI15: { discount: 15, label: "15% OFF" },
  ABREAI20: { discount: 20, label: "20% OFF" },
  FRETEGRATIS: { discount: 0, label: "Frete Grátis", freeShipping: true },
};


const CheckoutModal = ({ isOpen, onClose }: CheckoutModalProps) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { createOrder } = useOrders();
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

  const subtotal = getTotalPrice();
  const shipping = appliedCoupon && DISCOUNT_COUPONS[appliedCoupon]?.freeShipping ? 0 : 15;
  const discount = appliedCoupon ? (subtotal * DISCOUNT_COUPONS[appliedCoupon].discount) / 100 : 0;
  const total = subtotal + shipping - discount;

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

  const sendConfirmationEmail = async (orderData: any) => {
    try {
      // Configurar EmailJS (você precisará criar conta grátis em emailjs.com)
      // e substituir os IDs abaixo
      
      const templateParams = {
        to_email: formData.email,
        to_name: formData.name,
        order_id: orderData.id,
        tracking_code: orderData.trackingCode,
        items_list: items.map(item => 
          `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
        ).join('\n'),
        total: total.toFixed(2),
        delivery_address: formData.address,
      };

      // Descomente quando configurar EmailJS
      // await emailjs.send(
      //   'YOUR_SERVICE_ID',
      //   'YOUR_TEMPLATE_ID',
      //   templateParams,
      //   'YOUR_PUBLIC_KEY'
      // );

      console.log("Email seria enviado:", templateParams);
      toast.success("Email de confirmação enviado! 📧");
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      // Não bloqueia o pedido se o email falhar
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

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

      // Enviar email de confirmação
      await sendConfirmationEmail(order);

      // Preparar mensagem WhatsApp
      const itemsList = items
        .map((item) => `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`)
        .join("\n");

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
Frete: R$ ${shipping.toFixed(2)}
${appliedCoupon ? `Desconto (${DISCOUNT_COUPONS[appliedCoupon].label}): -R$ ${discount.toFixed(2)}` : ""}
*TOTAL: R$ ${total.toFixed(2)}*

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
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          notes: "",
        });
        setAppliedCoupon(null);
        setCouponCode("");
      }, 500);

    } catch (error) {
      toast.error("Erro ao processar pedido");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription>
            Preencha seus dados para concluir a compra
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
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
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
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

          {/* Cupom de Desconto */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Tag className="h-4 w-4" />
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
                <Button type="button" variant="outline" onClick={handleRemoveCoupon}>
                  Remover
                </Button>
              ) : (
                <Button type="button" onClick={handleApplyCoupon}>
                  Aplicar
                </Button>
              )}
            </div>
            {appliedCoupon && (
              <Badge className="bg-green-500">
                <Percent className="h-3 w-3 mr-1" />
                {DISCOUNT_COUPONS[appliedCoupon].label}
              </Badge>
            )}
            <p className="text-xs text-muted-foreground">
              Cupons disponíveis: PRIMEIRA, ABREAI10, ABREAI15, ABREAI20, FRETEGRATIS
            </p>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Alguma observação sobre seu pedido?"
              rows={2}
            />
          </div>

          <Separator />

          {/* Resumo do Pedido */}
          <div className="space-y-4 bg-muted p-4 rounded-lg">
            <h3 className="font-semibold">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                  {shipping === 0 ? "GRÁTIS" : `R$ ${shipping.toFixed(2)}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Desconto</span>
                  <span>-R$ {discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isProcessing} className="flex-1">
              {isProcessing ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;