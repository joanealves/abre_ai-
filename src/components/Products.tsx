import { useState } from "react";
import type { ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Beer, Gift, ShoppingCart, Plus, Coffee, Heart, Dumbbell, Leaf, Flame, Minus } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { Badge } from "@/components/ui/badge";
import type { ProductCategory } from "@/types/types";

type Category = ProductCategory;

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNumber: number;
  category: Category;
}

const products: Product[] = [
  {
    id: 1,
    name: "Kit Boteco Clássico",
    description: "6 cervejas artesanais + petiscos selecionados",
    price: "R$ 129,90",
    priceNumber: 129.90,
    category: "rolee",
  },
  {
    id: 2,
    name: "Kit Premium Experience",
    description: "12 cervejas especiais + tábua de frios + snacks",
    price: "R$ 249,90",
    priceNumber: 249.90,
    category: "rolee",
  },
  {
    id: 3,
    name: "Kit Rolê Completo",
    description: "Mix de bebidas + aperitivos + jogos de bar",
    price: "R$ 189,90",
    priceNumber: 189.90,
    category: "rolee",
  },
  {
    id: 4,
    name: "Cesta Gourmet",
    description: "Vinhos, queijos, geleias e pães artesanais",
    price: "R$ 159,90",
    priceNumber: 159.90,
    category: "cestas",
  },
  {
    id: 5,
    name: "Cesta Bem-Estar",
    description: "Chás especiais, mel, granolas e chocolates",
    price: "R$ 139,90",
    priceNumber: 139.90,
    category: "cestas",
  },
  {
    id: 6,
    name: "Cesta Premium Gift",
    description: "Seleção especial para presentear com elegância",
    price: "R$ 299,90",
    priceNumber: 299.90,
    category: "cestas",
  },
  {
    id: 7,
    name: "Kit Café Premium",
    description: "Cafés especiais, cookies e doces gourmet",
    price: "R$ 89,90",
    priceNumber: 89.90,
    category: "cafe",
  },
  {
    id: 8,
    name: "Kit Café & Brunch",
    description: "Cafés selecionados, pães, geleias e queijos",
    price: "R$ 119,90",
    priceNumber: 119.90,
    category: "cafe",
  },
  {
    id: 9,
    name: "Kit Romântico",
    description: "Espumante, chocolates e petiscos para dois",
    price: "R$ 179,90",
    priceNumber: 179.90,
    category: "namorados",
  },
  {
    id: 10,
    name: "Kit Date Night",
    description: "Vinho especial, queijos, frutas e velas aromáticas",
    price: "R$ 199,90",
    priceNumber: 199.90,
    category: "namorados",
  },
  {
    id: 11,
    name: "Kit Fit Saudável",
    description: "Snacks proteicos, frutas secas e sucos naturais",
    price: "R$ 99,90",
    priceNumber: 99.90,
    category: "fit",
  },
  {
    id: 12,
    name: "Kit Power Fitness",
    description: "Whey, barras de proteína, pasta de amendoim e energéticos",
    price: "R$ 149,90",
    priceNumber: 149.90,
    category: "fit",
  },
  {
    id: 13,
    name: "Kit Vegano Completo",
    description: "Snacks vegetais, patês, geleias e sucos detox",
    price: "R$ 109,90",
    priceNumber: 109.90,
    category: "vegan",
  },
  {
    id: 14,
    name: "Kit Plant-Based Premium",
    description: "Queijos veganos, vinhos, chocolates e aperitivos",
    price: "R$ 169,90",
    priceNumber: 169.90,
    category: "vegan",
  },
  {
    id: 15,
    name: "Kit Churrasco Starter",
    description: "Temperos especiais, molhos e cerveja artesanal",
    price: "R$ 139,90",
    priceNumber: 139.90,
    category: "churrasco",
  },
  {
    id: 16,
    name: "Kit Churrasco Premium",
    description: "Carnes nobres, acompanhamentos, bebidas e carvão especial",
    price: "R$ 299,90",
    priceNumber: 299.90,
    category: "churrasco",
  },
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  
  const { addItem, items: cartItems } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const getCartQuantity = (productId: number) => {
    const cartItem = cartItems.find(item => item.id === productId);
    return cartItem?.quantity || 0;
  };

  const getLocalQuantity = (productId: number) => {
    return quantities[productId] || 0;
  };

  const updateLocalQuantity = (productId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const newValue = Math.max(0, current + delta);
      return { ...prev, [productId]: newValue };
    });
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const quantity = getLocalQuantity(product.id);
    
    // Só adiciona se quantidade for maior que 0
    if (quantity === 0) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.priceNumber,
      category: product.category,
      description: product.description,
    }, quantity);
    
    // Reset local quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 0 }));
  };

  const getCategoryIcon = (category: Category, className = "h-5 w-5") => {
    const icons: Record<Category, ReactElement> = {
      rolee: <Beer className={className} />,
      cestas: <Gift className={className} />,
      cafe: <Coffee className={className} />,
      namorados: <Heart className={className} />,
      fit: <Dumbbell className={className} />,
      vegan: <Leaf className={className} />,
      churrasco: <Flame className={className} />,
      bebidas: <Beer className={className} />,
      chocolates: <Gift className={className} />,
      petiscos: <Coffee className={className} />,
    };
    return icons[category];
  };

  const getCategoryColors = (category: Category) => {
    const colors: Record<Category, {
      border: string;
      icon: string;
      iconBg: string;
      button: string;
      buttonActive: string;
    }> = {
      rolee: {
        border: "border-rolee-golden/20 hover:border-rolee-golden",
        icon: "text-rolee-golden",
        iconBg: "text-rolee-golden/30",
        button: "bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-golden border border-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-golden border-rolee-golden"
      },
      cestas: {
        border: "border-cestas-sage/20 hover:border-cestas-sage",
        icon: "text-cestas-sage",
        iconBg: "text-cestas-sage/30",
        button: "bg-cestas-base hover:bg-cestas-beige text-cestas-sage border border-cestas-sage",
        buttonActive: "bg-cestas-beige text-cestas-sage border-cestas-sage"
      },
      cafe: {
        border: "border-rolee-golden/20 hover:border-rolee-golden",
        icon: "text-rolee-golden",
        iconBg: "text-rolee-golden/30",
        button: "bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-cream border border-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-cream border-rolee-golden"
      },
      namorados: {
        border: "border-cestas-rose/20 hover:border-cestas-rose",
        icon: "text-cestas-rose",
        iconBg: "text-cestas-rose/30",
        button: "bg-cestas-base hover:bg-cestas-base/90 text-cestas-rose border border-cestas-rose",
        buttonActive: "bg-cestas-base text-cestas-rose border-cestas-rose"
      },
      fit: {
        border: "border-cestas-sage/20 hover:border-cestas-sage",
        icon: "text-cestas-sage",
        iconBg: "text-cestas-sage/30",
        button: "bg-white hover:bg-cestas-base text-cestas-sage border border-cestas-sage",
        buttonActive: "bg-cestas-base text-cestas-sage border-cestas-sage"
      },
      vegan: {
        border: "border-cestas-sage/30 hover:border-cestas-sage",
        icon: "text-cestas-sage",
        iconBg: "text-cestas-sage/30",
        button: "bg-cestas-sage hover:bg-cestas-sage/90 text-white border border-cestas-sage",
        buttonActive: "bg-cestas-sage text-white border-cestas-sage"
      },
      churrasco: {
        border: "border-rolee-golden/20 hover:border-rolee-golden",
        icon: "text-rolee-golden",
        iconBg: "text-rolee-golden/30",
        button: "bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-golden border border-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-golden border-rolee-golden"
      },
      bebidas: {
        border: "border-rolee-golden/20 hover:border-rolee-golden",
        icon: "text-rolee-golden",
        iconBg: "text-rolee-golden/30",
        button: "bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-golden border border-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-golden border-rolee-golden"
      },
      chocolates: {
        border: "border-cestas-sage/20 hover:border-cestas-sage",
        icon: "text-cestas-sage",
        iconBg: "text-cestas-sage/30",
        button: "bg-cestas-sage hover:bg-cestas-sage/90 text-white border border-cestas-sage",
        buttonActive: "bg-cestas-sage text-white border-cestas-sage"
      },
      petiscos: {
        border: "border-primary/20 hover:border-primary",
        icon: "text-primary",
        iconBg: "text-primary/30",
        button: "bg-primary hover:bg-primary/90 text-primary-foreground border border-primary",
        buttonActive: "bg-primary text-primary-foreground border-primary"
      }
    };
    return colors[category];
  };

  return (
    <section id="produtos" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Explore Nossas Experiências
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Escolha a categoria perfeita para sua ocasião
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              size="lg"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="text-base"
            >
              Todos os Kits
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "rolee" ? "default" : "outline"}
              onClick={() => setSelectedCategory("rolee")}
              className={`text-base ${selectedCategory === "rolee" ? getCategoryColors("rolee").buttonActive : ""}`}
            >
              <Beer className="mr-2 h-5 w-5" />
              Rolê
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "cestas" ? "default" : "outline"}
              onClick={() => setSelectedCategory("cestas")}
              className={`text-base ${selectedCategory === "cestas" ? getCategoryColors("cestas").buttonActive : ""}`}
            >
              <Gift className="mr-2 h-5 w-5" />
              Cestas
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "cafe" ? "default" : "outline"}
              onClick={() => setSelectedCategory("cafe")}
              className={`text-base ${selectedCategory === "cafe" ? getCategoryColors("cafe").buttonActive : ""}`}
            >
              <Coffee className="mr-2 h-5 w-5" />
              Café
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "namorados" ? "default" : "outline"}
              onClick={() => setSelectedCategory("namorados")}
              className={`text-base ${selectedCategory === "namorados" ? getCategoryColors("namorados").buttonActive : ""}`}
            >
              <Heart className="mr-2 h-5 w-5" />
              Namorados
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "fit" ? "default" : "outline"}
              onClick={() => setSelectedCategory("fit")}
              className={`text-base ${selectedCategory === "fit" ? getCategoryColors("fit").buttonActive : ""}`}
            >
              <Dumbbell className="mr-2 h-5 w-5" />
              Fit
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "vegan" ? "default" : "outline"}
              onClick={() => setSelectedCategory("vegan")}
              className={`text-base ${selectedCategory === "vegan" ? getCategoryColors("vegan").buttonActive : ""}`}
            >
              <Leaf className="mr-2 h-5 w-5" />
              Vegan
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "churrasco" ? "default" : "outline"}
              onClick={() => setSelectedCategory("churrasco")}
              className={`text-base ${selectedCategory === "churrasco" ? getCategoryColors("churrasco").buttonActive : ""}`}
            >
              <Flame className="mr-2 h-5 w-5" />
              Churrasco
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const colors = getCategoryColors(product.category);
            const cartQty = getCartQuantity(product.id);
            const localQty = getLocalQuantity(product.id);
            
            return (
              <Card
                key={product.id}
                className={`overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 ${colors.border} relative`}
                onClick={() => setSelectedProduct(product)}
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
                      id: product.id,
                      name: product.name,
                      price: product.priceNumber,
                      category: product.category,
                      description: product.description,
                    });
                  }}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isFavorite(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                <div className="aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className={colors.iconBg}>
                      {getCategoryIcon(product.category, "h-24 w-24")}
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className={colors.icon}>
                      {getCategoryIcon(product.category)}
                    </div>
                    {product.name}
                  </CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-2xl font-bold">{product.price}</p>
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
                        updateLocalQuantity(product.id, 1);
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
                          updateLocalQuantity(product.id, -1);
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
                          updateLocalQuantity(product.id, 1);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Botões de ação */}
                  <div className="flex gap-2 w-full">
                    <Button
                      className={`flex-1 ${colors.button}`}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={localQty === 0}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar {localQty > 0 && `(${localQty})`}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(
                          `https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o ${product.name}`,
                          "_blank"
                        );
                      }}
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

        {/* Modal de detalhes do produto */}
        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <div className={getCategoryColors(selectedProduct.category).icon}>
                      {getCategoryIcon(selectedProduct.category, "h-6 w-6")}
                    </div>
                    {selectedProduct.name}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Detalhes do produto {selectedProduct.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50 relative">
                    {/* Badge no modal também */}
                    {getCartQuantity(selectedProduct.id) > 0 && (
                      <Badge 
                        className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground"
                      >
                        {getCartQuantity(selectedProduct.id)} no carrinho
                      </Badge>
                    )}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={getCategoryColors(selectedProduct.category).iconBg}>
                        {getCategoryIcon(selectedProduct.category, "h-32 w-32")}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg text-muted-foreground">{selectedProduct.description}</p>
                    <p className="text-3xl font-bold">{selectedProduct.price}</p>
                  </div>

                  {/* Contador no modal */}
                  <div className="flex items-center justify-center gap-4 py-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => updateLocalQuantity(selectedProduct.id, -1)}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="text-2xl font-semibold min-w-[4ch] text-center">
                      {getLocalQuantity(selectedProduct.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => updateLocalQuantity(selectedProduct.id, 1)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className={`flex-1 ${getCategoryColors(selectedProduct.category).button}`}
                      size="lg"
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o ${selectedProduct.name}`,
                          "_blank"
                        )
                      }
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Pedir pelo WhatsApp
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Products;