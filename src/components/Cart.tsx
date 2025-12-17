import { useState } from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import { ShoppingCart, Trash2, Plus, Minus, Heart } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/use-favorites";
import CheckoutModal from "./Checkoutmodal ";


const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const { items, updateQuantity, removeItem, getItemCount, getTotalPrice } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      rolee: "bg-rolee-dark text-rolee-golden",
      bebidas: "bg-rolee-dark text-rolee-golden",
      cafe: "bg-rolee-dark text-rolee-golden",
      churrasco: "bg-rolee-dark text-rolee-golden",
      cestas: "bg-cestas-base text-cestas-sage",
      fit: "bg-cestas-base text-cestas-sage",
      vegan: "bg-cestas-base text-cestas-sage",
      chocolates: "bg-cestas-sage text-white",
      petiscos: "bg-primary text-primary-foreground",
      namorados: "bg-cestas-rose text-white",
    };
    return colorMap[category] || "bg-muted text-muted-foreground";
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    // Fecha o carrinho e abre o checkout
    setIsOpen(false);
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 300); // Delay para animação suave
  };

  const totalItems = getItemCount();
  const totalPrice = getTotalPrice();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground">
                {totalItems}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Seu Carrinho
            </SheetTitle>
            <SheetDescription>
              {totalItems === 0
                ? "Seu carrinho está vazio"
                : `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-hidden flex flex-col mt-8">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Adicione produtos ao seu carrinho para começar
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{item.name}</h4>
                            <Badge
                              variant="outline"
                              className={`mt-1 text-xs ${getCategoryColor(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-1">
                            {/* Botão de Favoritar */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 ${
                                isFavorite(item.id)
                                  ? "text-red-500"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() =>
                                toggleFavorite({
                                  id: item.id,
                                  name: item.name,
                                  price: item.price,
                                  category: item.category,
                                  description: item.description || "",
                                })
                              }
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  isFavorite(item.id) ? "fill-current" : ""
                                }`}
                              />
                            </Button>
                            
                            {/* Botão de Remover */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          {/* Controles de Quantidade */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <span className="w-8 text-center font-semibold">
                              {item.quantity}
                            </span>
                            
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Preço */}
                          <p className="font-bold text-primary">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo e Checkout */}
                <div className="mt-6 space-y-4 border-t pt-4">
                  <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete:</span>
                      <span>Calculado no checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                    onClick={handleCheckout}
                  >
                    Finalizar Pedido
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    💳 Formas de pagamento disponíveis no checkout
                  </p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};

export default Cart;