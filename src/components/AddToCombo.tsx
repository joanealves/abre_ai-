import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Wine, Candy, Cookie, Plus, ShoppingCart, Minus, Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { Badge } from "./ui/badge";
import type { ProductCategory } from "@/types/types";

type ComboCategory = "bebidas" | "chocolates" | "petiscos" | "todos";

interface ComboItem {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNumber: number;
  category: Extract<ProductCategory, "bebidas" | "chocolates" | "petiscos">;
  icon: typeof Wine;
}

const comboItems: ComboItem[] = [
  {
    id: 101,
    name: "Cerveja Artesanal IPA",
    description: "500ml - Amargor equilibrado",
    price: "R$ 15,90",
    priceNumber: 15.90,
    category: "bebidas",
    icon: Wine,
  },
  {
    id: 102,
    name: "Vinho Tinto Reserva",
    description: "750ml - Seleção especial",
    price: "R$ 49,90",
    priceNumber: 49.90,
    category: "bebidas",
    icon: Wine,
  },
  {
    id: 103,
    name: "Espumante Rosé",
    description: "750ml - Celebração perfeita",
    price: "R$ 39,90",
    priceNumber: 39.90,
    category: "bebidas",
    icon: Wine,
  },
  {
    id: 104,
    name: "Chocolate Belga 70%",
    description: "Barra premium 100g",
    price: "R$ 18,90",
    priceNumber: 18.90,
    category: "chocolates",
    icon: Candy,
  },
  {
    id: 105,
    name: "Trufas Sortidas",
    description: "Caixa com 12 unidades",
    price: "R$ 34,90",
    priceNumber: 34.90,
    category: "chocolates",
    icon: Candy,
  },
  {
    id: 106,
    name: "Bombons Gourmet",
    description: "Seleção especial 200g",
    price: "R$ 29,90",
    priceNumber: 29.90,
    category: "chocolates",
    icon: Candy,
  },
  {
    id: 107,
    name: "Mix de Castanhas Premium",
    description: "Seleção de 5 tipos - 250g",
    price: "R$ 24,90",
    priceNumber: 24.90,
    category: "petiscos",
    icon: Cookie,
  },
  {
    id: 108,
    name: "Tábua de Queijos Especiais",
    description: "3 tipos selecionados",
    price: "R$ 45,90",
    priceNumber: 45.90,
    category: "petiscos",
    icon: Cookie,
  },
  {
    id: 109,
    name: "Biscoitos Artesanais",
    description: "Mix de sabores - 200g",
    price: "R$ 19,90",
    priceNumber: 19.90,
    category: "petiscos",
    icon: Cookie,
  },
];

const AddToCombo = () => {
  const [selectedCategory, setSelectedCategory] = useState<ComboCategory>("todos");
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  
  const { addItem, items: cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredItems = selectedCategory === "todos"
    ? comboItems
    : comboItems.filter((item) => item.category === selectedCategory);

  const getCartQuantity = (itemId: number) => {
    const cartItem = cartItems.find(item => item.id === itemId);
    return cartItem?.quantity || 0;
  };

  const getLocalQuantity = (itemId: number) => {
    return quantities[itemId] || 0;
  };

  const updateLocalQuantity = (itemId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[itemId] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [itemId]: newValue };
    });
  };

  const handleAddToCart = (item: ComboItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const quantity = getLocalQuantity(item.id);
    
    // Só adiciona se quantidade for maior que 0
    if (quantity === 0) return;
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.priceNumber,
      category: item.category,
      description: item.description,
    }, quantity);
    
    // Reset local quantity after adding
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  const getCategoryColor = (category: Extract<ProductCategory, "bebidas" | "chocolates" | "petiscos">) => {
    switch (category) {
      case "bebidas":
        return "text-rolee-golden border-rolee-golden/20 hover:border-rolee-golden";
      case "chocolates":
        return "text-cestas-sage border-cestas-sage/20 hover:border-cestas-sage";
      case "petiscos":
        return "text-primary border-primary/20 hover:border-primary";
    }
  };

  const getCategoryButtonColor = (category: Extract<ProductCategory, "bebidas" | "chocolates" | "petiscos">) => {
    switch (category) {
      case "bebidas":
        return "bg-rolee-dark text-rolee-golden border-rolee-golden hover:bg-rolee-dark/90";
      case "chocolates":
        return "bg-cestas-base text-cestas-sage border-cestas-sage hover:bg-cestas-base/90";
      case "petiscos":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
    }
  };

  return (
    <section id="add-to-combo" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Adicione ao Seu Combo
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Personalize sua experiência com itens complementares selecionados
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant={selectedCategory === "todos" ? "default" : "outline"}
              onClick={() => setSelectedCategory("todos")}
              className="text-base"
            >
              Todos os Itens
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "bebidas" ? "default" : "outline"}
              onClick={() => setSelectedCategory("bebidas")}
              className={`text-base ${
                selectedCategory === "bebidas"
                  ? "bg-rolee-dark text-rolee-golden border-rolee-golden"
                  : ""
              }`}
            >
              <Wine className="mr-2 h-5 w-5" />
              Bebidas
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "chocolates" ? "default" : "outline"}
              onClick={() => setSelectedCategory("chocolates")}
              className={`text-base ${
                selectedCategory === "chocolates"
                  ? "bg-cestas-base text-cestas-sage border-cestas-sage"
                  : ""
              }`}
            >
              <Candy className="mr-2 h-5 w-5" />
              Chocolates
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "petiscos" ? "default" : "outline"}
              onClick={() => setSelectedCategory("petiscos")}
              className={`text-base ${
                selectedCategory === "petiscos"
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              <Cookie className="mr-2 h-5 w-5" />
              Petiscos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const Icon = item.icon;
            const cartQty = getCartQuantity(item.id);
            const localQty = getLocalQuantity(item.id);
            
            return (
              <Card
                key={item.id}
                className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in relative ${getCategoryColor(item.category)}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Badge de quantidade no carrinho */}
                {cartQty > 0 && (
                  <Badge 
                    className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground"
                  >
                    {cartQty} no carrinho
                  </Badge>
                )}
                
                {/* Botão de favorito */}
                <button
                  className="absolute top-3 left-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite({
                      id: item.id,
                      name: item.name,
                      price: item.priceNumber,
                      category: item.category,
                      description: item.description,
                    });
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite(item.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                <div className="h-32 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <Icon className="h-16 w-16 opacity-20" />
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-2xl font-bold font-serif">{item.price}</p>
                </CardContent>
                
                <CardFooter className="flex-col gap-3">
                  {/* Contador de quantidade */}
                  {localQty === 0 ? (
                    // Quando quantidade é 0, mostra apenas botão +
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLocalQuantity(item.id, 1);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Selecionar quantidade
                    </Button>
                  ) : (
                    // Quando tem quantidade, mostra contador completo
                    <div className="flex items-center justify-center gap-3 w-full">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateLocalQuantity(item.id, -1);
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold min-w-[3ch] text-center">
                        {localQty}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateLocalQuantity(item.id, 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Botões de ação */}
                  <div className="flex gap-2 w-full">
                    <Button
                      className={`flex-1 ${getCategoryButtonColor(item.category)}`}
                      onClick={(e) => handleAddToCart(item, e)}
                      disabled={localQty === 0}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar {localQty > 0 && `(${localQty})`}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://wa.me/5511999999999?text=Olá! Gostaria de adicionar ${item.name} ao meu combo`,
                          "_blank"
                        )
                      }
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AddToCombo;