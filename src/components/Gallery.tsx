import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ShoppingCart, Heart, X, Plus, Minus, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/use-favorites";
import type { CartItem } from "@/types/types";
import roleeImg from "@/assets/rolee-hero.jpg";
import cestasImg from "@/assets/cestas-hero.jpg";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Brand = "rolee" | "cestas";

type Product = {
  id: number;
  name: string;
  price: number;
  category: CartItem["category"];
  image: string;
  description: string;
  features?: string[];
  rating?: number;
  reviews?: number;
};

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const ROLEE_PRODUCTS: Product[] = [
  {
    id: 101,
    name: "Kit Rolê Completo",
    price: 89.90,
    category: "rolee",
    image: "/assets/rolee/rolee-1.jpg",
    description: "Perfeito para aquele rolê com os amigos. Inclui cervejas artesanais selecionadas e petiscos premium.",
    features: [
      "4 Cervejas Artesanais Premium",
      "Mix de Petiscos Gourmet",
      "Embalagem Especial para Presente",
      "Entrega Refrigerada"
    ],
    rating: 4.8,
    reviews: 124
  },
  {
    id: 102,
    name: "Combo Cerveja Artesanal",
    price: 129.90,
    category: "rolee",
    image: "/assets/rolee/rolee-2.jpg",
    description: "Seleção especial de cervejas artesanais dos melhores produtores locais.",
    features: [
      "6 Cervejas Artesanais Diferentes",
      "Guia de Harmonização",
      "Copo de Degustação",
      "Embalagem Premium"
    ],
    rating: 4.9,
    reviews: 98
  },
  {
    id: 103,
    name: "Kit Petiscos Premium",
    price: 79.90,
    category: "rolee",
    image: "/assets/rolee/rolee-3.jpg",
    description: "Variedade de petiscos selecionados para acompanhar suas bebidas favoritas.",
    features: [
      "Tábua de Frios Artesanais",
      "Mix de Nuts Premium",
      "Patês Especiais",
      "Biscoitos Gourmet"
    ],
    rating: 4.7,
    reviews: 156
  },
];

const CESTAS_PRODUCTS: Product[] = [
  {
    id: 201,
    name: "Cesta Amor",
    price: 169.90,
    category: "namorados",
    image: "/assets/cestas/cesta-amor.jpg",
    description: "Uma cesta pensada para momentos especiais. Produtos artesanais, apresentação impecável e emoção real.",
    features: [
      "Chocolates Artesanais Premium",
      "Vinho Tinto Selecionado",
      "Flores Preservadas",
      "Cartão Personalizado",
      "Embalagem Romântica"
    ],
    rating: 5.0,
    reviews: 234
  },
  {
    id: 202,
    name: "Cesta Celebração",
    price: 149.90,
    category: "cestas",
    image: "/assets/cestas/cesta-celebracao.jpg",
    description: "Ideal para aniversários e conquistas. Uma experiência elegante do início ao fim.",
    features: [
      "Espumante Premium",
      "Doces Finos Importados",
      "Frutas Selecionadas",
      "Balões Personalizados",
      "Laço Decorativo"
    ],
    rating: 4.9,
    reviews: 189
  },
  {
    id: 203,
    name: "Cesta Luxo",
    price: 299.90,
    category: "cestas",
    image: "/assets/cestas/cesta-luxo.jpg",
    description: "Nossa versão mais sofisticada. Impacto visual, qualidade e exclusividade.",
    features: [
      "Champagne Importado",
      "Chocolates Belgas",
      "Queijos Especiais",
      "Frutas Exóticas",
      "Arranjo Floral Premium",
      "Cesta de Vime Artesanal"
    ],
    rating: 5.0,
    reviews: 167
  },
];

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function Gallery() {
  const [openBrand, setOpenBrand] = useState<Brand | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    document.body.style.overflow = openBrand || selectedProduct ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openBrand, selectedProduct]);

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <>
      {/* SECTION */}
      <section id="galeria" className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16">
            Nossas Experiências
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <BrandCard
              image={roleeImg}
              title="Kits de Rolê"
              subtitle="Cervejas artesanais, petiscos premium e clima de boteco em casa."
              label="Rolê"
              theme="rolee"
              onClick={() => setOpenBrand("rolee")}
            />

            <BrandCard
              image={cestasImg}
              title="Cestas Premium"
              subtitle="Presentes artesanais elegantes para surpreender."
              label="Cestas"
              theme="cestas"
              onClick={() => setOpenBrand("cestas")}
            />
          </div>
        </div>
      </section>

      {/* MODAL BRAND */}
      {openBrand && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-6xl max-h-[90vh] bg-background rounded-3xl overflow-hidden shadow-2xl">
            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-background px-8 py-6 flex justify-between items-center border-b">
              <h3 className="text-3xl font-serif">
                {openBrand === "rolee" ? "Kits de Rolê" : "Cestas Premium"}
              </h3>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenBrand(null)}
                className="rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* CONTENT */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] p-10">
              {openBrand === "rolee" ? (
                <ProductsGallery 
                  products={ROLEE_PRODUCTS}
                  onSelectProduct={setSelectedProduct}
                />
              ) : (
                <ProductsGallery 
                  products={CESTAS_PRODUCTS}
                  onSelectProduct={setSelectedProduct}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCT DETAIL DRAWER */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          quantity={quantity}
          onQuantityChange={setQuantity}
          onClose={handleCloseProduct}
        />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

const BrandCard = ({
  image,
  title,
  subtitle,
  label,
  theme,
  onClick,
}: any) => {
  const overlay =
    theme === "rolee"
      ? "from-rolee-dark via-rolee-dark/70"
      : "from-[#2F3E34] via-[#2F3E34]/70";

  const accent =
    theme === "rolee"
      ? "text-rolee-golden border-rolee-golden"
      : "text-[#6FAF8E] border-[#6FAF8E]";

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <div
        className="aspect-[3/4] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className={`absolute inset-0 bg-gradient-to-t ${overlay} to-transparent`} />

      <div className="absolute inset-0 flex items-end justify-center p-8">
        <div className="text-center text-white">
          <span className={`text-sm uppercase tracking-widest ${accent}`}>
            {label}
          </span>
          <h3 className="text-3xl font-serif font-bold mt-2 mb-3">
            {title}
          </h3>
          <p className="opacity-90 mb-6">{subtitle}</p>
          <span className={`inline-block px-6 py-3 rounded-full border-2 ${accent} group-hover:bg-white/10 transition-colors`}>
            Ver kits
          </span>
        </div>
      </div>
    </button>
  );
};

const ProductsGallery = ({
  products,
  onSelectProduct,
}: {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="group rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <div className="aspect-[3/4] overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            
            {/* Favorite Button */}
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-3 right-3 bg-white/90 hover:bg-white ${
                isFavorite(product.id) ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  description: product.description,
                });
              }}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current" : ""}`}
              />
            </Button>

            {/* Rating Badge */}
            {product.rating && (
              <Badge className="absolute bottom-3 left-3 bg-white/90 text-foreground">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating}
              </Badge>
            )}
          </div>

          <div className="p-6 flex flex-col">
            <h4 className="text-2xl font-serif mb-2">{product.name}</h4>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <span className="text-2xl font-bold text-primary">
                R$ {product.price.toFixed(2)}
              </span>
              
              <Button
                onClick={() => onSelectProduct(product)}
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground"
              >
                Ver detalhes
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProductDetailDrawer = ({
  product,
  quantity,
  onQuantityChange,
  onClose,
}: {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onClose: () => void;
}) => {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
      },
      quantity
    );
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-end animate-in slide-in-from-right">
      <div className="w-full sm:w-[480px] h-full bg-background overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Detalhes do Produto</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image */}
          <div className="aspect-square rounded-2xl overflow-hidden relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-4 right-4 bg-white/90 hover:bg-white ${
                isFavorite(product.id) ? "text-red-500" : "text-muted-foreground"
              }`}
              onClick={() =>
                toggleFavorite({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  description: product.description,
                })
              }
            >
              <Heart
                className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current" : ""}`}
              />
            </Button>
          </div>

          {/* Title & Rating */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">
              {product.name}
            </h2>
            
            {product.rating && (
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  ({product.reviews} avaliações)
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Descrição</h4>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">O que está incluso:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-1">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price & Quantity */}
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Preço unitário:</span>
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Quantidade:</span>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onQuantityChange(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {quantity > 1 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Adicionar ao Carrinho
          </Button>

          {/* Additional Info */}
          <div className="text-xs text-center text-muted-foreground space-y-1">
            <p>🚚 Entrega em até 3 dias úteis</p>
            <p>💳 Parcelamento disponível no checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
};