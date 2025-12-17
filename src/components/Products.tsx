import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Beer,
  Gift,
  ShoppingCart,
  Plus,
  Coffee,
  Heart,
  Dumbbell,
  Leaf,
  Flame,
  Minus,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
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
    priceNumber: 129.9,
    category: "rolee",
  },
  {
    id: 2,
    name: "Kit Premium Experience",
    description: "12 cervejas especiais + tábua de frios + snacks",
    price: "R$ 249,90",
    priceNumber: 249.9,
    category: "rolee",
  },
  {
    id: 3,
    name: "Kit Rolê Completo",
    description: "Mix de bebidas + aperitivos + jogos de bar",
    price: "R$ 189,90",
    priceNumber: 189.9,
    category: "rolee",
  },
  {
    id: 4,
    name: "Cesta Gourmet",
    description: "Vinhos, queijos, geleias e pães artesanais",
    price: "R$ 159,90",
    priceNumber: 159.9,
    category: "cestas",
  },
  {
    id: 5,
    name: "Cesta Bem-Estar",
    description: "Chás especiais, mel, granolas e chocolates",
    price: "R$ 139,90",
    priceNumber: 139.9,
    category: "cestas",
  },
  {
    id: 6,
    name: "Cesta Premium Gift",
    description: "Seleção especial para presentear com elegância",
    price: "R$ 299,90",
    priceNumber: 299.9,
    category: "cestas",
  },
  {
    id: 7,
    name: "Kit Café Premium",
    description: "Cafés especiais, cookies e doces gourmet",
    price: "R$ 89,90",
    priceNumber: 89.9,
    category: "cafe",
  },
  {
    id: 8,
    name: "Kit Café & Brunch",
    description: "Cafés selecionados, pães, geleias e queijos",
    price: "R$ 119,90",
    priceNumber: 119.9,
    category: "cafe",
  },
  {
    id: 9,
    name: "Kit Romântico",
    description: "Espumante, chocolates e petiscos para dois",
    price: "R$ 179,90",
    priceNumber: 179.9,
    category: "namorados",
  },
  {
    id: 10,
    name: "Kit Date Night",
    description: "Vinho especial, queijos, frutas e velas aromáticas",
    price: "R$ 199,90",
    priceNumber: 199.9,
    category: "namorados",
  },
  {
    id: 11,
    name: "Kit Fit Saudável",
    description: "Snacks proteicos, frutas secas e sucos naturais",
    price: "R$ 99,90",
    priceNumber: 99.9,
    category: "fit",
  },
  {
    id: 12,
    name: "Kit Power Fitness",
    description: "Whey, barras de proteína, pasta de amendoim e energéticos",
    price: "R$ 149,90",
    priceNumber: 149.9,
    category: "fit",
  },
  {
    id: 13,
    name: "Kit Vegano Completo",
    description: "Snacks vegetais, patês, geleias e sucos detox",
    price: "R$ 109,90",
    priceNumber: 109.9,
    category: "vegan",
  },
  {
    id: 14,
    name: "Kit Plant-Based Premium",
    description: "Queijos veganos, vinhos, chocolates e aperitivos",
    price: "R$ 169,90",
    priceNumber: 169.9,
    category: "vegan",
  },
  {
    id: 15,
    name: "Kit Churrasco Starter",
    description: "Temperos especiais, molhos e cerveja artesanal",
    price: "R$ 139,90",
    priceNumber: 139.9,
    category: "churrasco",
  },
  {
    id: 16,
    name: "Kit Churrasco Premium",
    description: "Carnes nobres, acompanhamentos, bebidas e carvão especial",
    price: "R$ 299,90",
    priceNumber: 299.9,
    category: "churrasco",
  },
];

/**
 * Products - Catálogo de Produtos
 * 
 * FLUXO SIMPLIFICADO:
 * 1. Usuário clica no produto -> Abre modal de detalhes
 * 2. No modal, ajusta quantidade (estado local temporário)
 * 3. Clica em "Adicionar ao Carrinho" -> Adiciona ao CartContext
 * 4. Modal fecha, estado local é resetado
 * 
 * NÃO mantém estado local de quantidades após adicionar ao carrinho.
 * CartContext é a fonte única da verdade.
 */

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalQuantity, setModalQuantity] = useState(1);

  const { addItem, getItemQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  const getCategoryIcon = (category: Category) => {
    const iconMap: Record<Category, React.ElementType> = {
      rolee: Beer,
      cestas: Gift,
      cafe: Coffee,
      namorados: Heart,
      fit: Dumbbell,
      vegan: Leaf,
      churrasco: Flame,
      bebidas: Beer,
      chocolates: Gift,
      petiscos: Beer,
    };
    return iconMap[category] || Beer;
  };

  const getCategoryColors = (category: Category) => {
    const colorMap: Record<
      Category,
      { border: string; iconBg: string; icon: string; buttonActive: string }
    > = {
      rolee: {
        border: "border-rolee-dark hover:border-rolee-golden",
        iconBg: "text-rolee-golden",
        icon: "text-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-golden",
      },
      cestas: {
        border: "border-cestas-base hover:border-cestas-sage",
        iconBg: "text-cestas-sage",
        icon: "text-cestas-sage",
        buttonActive: "bg-cestas-base text-cestas-sage",
      },
      cafe: {
        border: "border-rolee-dark hover:border-rolee-golden",
        iconBg: "text-rolee-golden",
        icon: "text-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-golden",
      },
      namorados: {
        border: "border-cestas-rose hover:border-cestas-rose",
        iconBg: "text-cestas-rose",
        icon: "text-cestas-rose",
        buttonActive: "bg-cestas-rose text-white",
      },
      fit: {
        border: "border-cestas-base hover:border-cestas-sage",
        iconBg: "text-cestas-sage",
        icon: "text-cestas-sage",
        buttonActive: "bg-cestas-base text-cestas-sage",
      },
      vegan: {
        border: "border-cestas-base hover:border-cestas-sage",
        iconBg: "text-cestas-sage",
        icon: "text-cestas-sage",
        buttonActive: "bg-cestas-base text-cestas-sage",
      },
      churrasco: {
        border: "border-primary hover:border-primary",
        iconBg: "text-primary",
        icon: "text-primary",
        buttonActive: "bg-primary text-primary-foreground",
      },
      bebidas: {
        border: "border-rolee-dark hover:border-rolee-golden",
        iconBg: "text-rolee-golden",
        icon: "text-rolee-golden",
        buttonActive: "bg-rolee-dark text-rolee-golden",
      },
      chocolates: {
        border: "border-cestas-sage hover:border-cestas-sage",
        iconBg: "text-cestas-sage",
        icon: "text-white",
        buttonActive: "bg-cestas-sage text-white",
      },
      petiscos: {
        border: "border-primary hover:border-primary",
        iconBg: "text-primary",
        icon: "text-primary",
        buttonActive: "bg-primary text-primary-foreground",
      },
    };
    return (
      colorMap[category] || {
        border: "border-muted",
        iconBg: "text-muted-foreground",
        icon: "text-muted-foreground",
        buttonActive: "bg-muted text-muted-foreground",
      }
    );
  };

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    // Inicializa com a quantidade atual no carrinho ou 1
    const currentQty = getItemQuantity(product.id);
    setModalQuantity(currentQty > 0 ? currentQty : 1);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setModalQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    addItem(
      {
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.priceNumber,
        category: selectedProduct.category,
        description: selectedProduct.description,
      },
      modalQuantity
    );

    handleCloseModal();
  };

  const Icon = selectedProduct
    ? getCategoryIcon(selectedProduct.category)
    : Beer;

  return (
    <section id="products" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nossos Kits Especiais
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Seleções pensadas para cada momento especial
          </p>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="text-base"
            >
              Todos
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "rolee" ? "default" : "outline"}
              onClick={() => setSelectedCategory("rolee")}
              className={`text-base ${
                selectedCategory === "rolee"
                  ? getCategoryColors("rolee").buttonActive
                  : ""
              }`}
            >
              <Beer className="mr-2 h-5 w-5" />
              Rolês
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "cestas" ? "default" : "outline"}
              onClick={() => setSelectedCategory("cestas")}
              className={`text-base ${
                selectedCategory === "cestas"
                  ? getCategoryColors("cestas").buttonActive
                  : ""
              }`}
            >
              <Gift className="mr-2 h-5 w-5" />
              Cestas
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "cafe" ? "default" : "outline"}
              onClick={() => setSelectedCategory("cafe")}
              className={`text-base ${
                selectedCategory === "cafe"
                  ? getCategoryColors("cafe").buttonActive
                  : ""
              }`}
            >
              <Coffee className="mr-2 h-5 w-5" />
              Café
            </Button>
            <Button
              size="lg"
              variant={
                selectedCategory === "namorados" ? "default" : "outline"
              }
              onClick={() => setSelectedCategory("namorados")}
              className={`text-base ${
                selectedCategory === "namorados"
                  ? getCategoryColors("namorados").buttonActive
                  : ""
              }`}
            >
              <Heart className="mr-2 h-5 w-5" />
              Namorados
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "fit" ? "default" : "outline"}
              onClick={() => setSelectedCategory("fit")}
              className={`text-base ${
                selectedCategory === "fit"
                  ? getCategoryColors("fit").buttonActive
                  : ""
              }`}
            >
              <Dumbbell className="mr-2 h-5 w-5" />
              Fit
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "vegan" ? "default" : "outline"}
              onClick={() => setSelectedCategory("vegan")}
              className={`text-base ${
                selectedCategory === "vegan"
                  ? getCategoryColors("vegan").buttonActive
                  : ""
              }`}
            >
              <Leaf className="mr-2 h-5 w-5" />
              Vegan
            </Button>
            <Button
              size="lg"
              variant={
                selectedCategory === "churrasco" ? "default" : "outline"
              }
              onClick={() => setSelectedCategory("churrasco")}
              className={`text-base ${
                selectedCategory === "churrasco"
                  ? getCategoryColors("churrasco").buttonActive
                  : ""
              }`}
            >
              <Flame className="mr-2 h-5 w-5" />
              Churrasco
            </Button>
          </div>
        </div>

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const colors = getCategoryColors(product.category);
            const cartQty = getItemQuantity(product.id);
            const ProductIcon = getCategoryIcon(product.category);

            return (
              <Card
                key={product.id}
                className={`overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-2 ${colors.border} relative`}
                onClick={() => handleOpenModal(product)}
              >
                {/* Badge de quantidade no carrinho */}
                {cartQty > 0 && (
                  <Badge className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground">
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
                        : "text-muted-foreground"
                    }`}
                  />
                </button>

                <CardHeader className="pb-4">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50 mb-4">
                    <div className="w-full h-full flex items-center justify-center">
                      <ProductIcon className={`h-24 w-24 ${colors.iconBg}`} />
                    </div>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>

                <CardContent className="pb-4">
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{product.price}</span>
                  <Button variant="outline" size="sm">
                    Ver detalhes
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Modal de Detalhes do Produto */}
        <Dialog open={!!selectedProduct} onOpenChange={handleCloseModal}>
          <DialogContent className="max-w-2xl">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    <Icon
                      className={`h-6 w-6 ${
                        getCategoryColors(selectedProduct.category).icon
                      }`}
                    />
                    {selectedProduct.name}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedProduct.description}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Imagem do Produto */}
                  <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50 relative">
                    {getItemQuantity(selectedProduct.id) > 0 && (
                      <Badge className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground">
                        {getItemQuantity(selectedProduct.id)} no carrinho
                      </Badge>
                    )}
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon
                        className={`h-32 w-32 ${
                          getCategoryColors(selectedProduct.category).iconBg
                        }`}
                      />
                    </div>
                  </div>

                  {/* Preço e Quantidade */}
                  <div className="border-t pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Preço unitário:
                      </span>
                      <span className="text-3xl font-bold text-primary">
                        {selectedProduct.price}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Quantidade:</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setModalQuantity(Math.max(1, modalQuantity - 1))
                          }
                          disabled={modalQuantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold text-lg">
                          {modalQuantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setModalQuantity(modalQuantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {modalQuantity > 1 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(selectedProduct.priceNumber * modalQuantity)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Botão de Adicionar ao Carrinho */}
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>

                  {/* Informações Adicionais */}
                  <div className="text-xs text-center text-muted-foreground space-y-1">
                    <p>🚚 Entrega em até 3 dias úteis</p>
                    <p>💳 Parcelamento disponível no checkout</p>
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