import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Beer, Gift, ShoppingCart } from "lucide-react";

type Category = "rolee" | "cestas";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: Category;
}

const products: Product[] = [
  {
    id: 1,
    name: "Kit Boteco Clássico",
    description: "6 cervejas artesanais + petiscos selecionados",
    price: "R$ 129,90",
    category: "rolee",
  },
  {
    id: 2,
    name: "Kit Premium Experience",
    description: "12 cervejas especiais + tábua de frios + snacks",
    price: "R$ 249,90",
    category: "rolee",
  },
  {
    id: 3,
    name: "Kit Rolê Completo",
    description: "Mix de bebidas + aperitivos + jogos de bar",
    price: "R$ 189,90",
    category: "rolee",
  },
  {
    id: 4,
    name: "Cesta Gourmet",
    description: "Vinhos, queijos, geleias e pães artesanais",
    price: "R$ 159,90",
    category: "cestas",
  },
  {
    id: 5,
    name: "Cesta Bem-Estar",
    description: "Chás especiais, mel, granolas e chocolates",
    price: "R$ 139,90",
    category: "cestas",
  },
  {
    id: 6,
    name: "Cesta Premium Gift",
    description: "Seleção especial para presentear com elegância",
    price: "R$ 299,90",
    category: "cestas",
  },
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <section id="products" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Explore Nossas Experiências
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Escolha entre nossos kits de boteco ou cestas especiais
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
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
              className={`text-base ${
                selectedCategory === "rolee"
                  ? "bg-rolee-dark text-rolee-golden border-rolee-golden"
                  : ""
              }`}
            >
              <Beer className="mr-2 h-5 w-5" />
              Kits de Rolê
            </Button>
            <Button
              size="lg"
              variant={selectedCategory === "cestas" ? "default" : "outline"}
              onClick={() => setSelectedCategory("cestas")}
              className={`text-base ${
                selectedCategory === "cestas"
                  ? "bg-cestas-base text-cestas-sage border-cestas-sage"
                  : ""
              }`}
            >
              <Gift className="mr-2 h-5 w-5" />
              Cestas & Presentes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
            <Card
              key={product.id}
              className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in cursor-pointer ${
                product.category === "rolee"
                  ? "border-rolee-golden/20 hover:border-rolee-golden"
                  : "border-cestas-sage/20 hover:border-cestas-sage"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <div className="w-full h-full flex items-center justify-center">
                  {product.category === "rolee" ? (
                    <Beer className="h-24 w-24 text-rolee-golden/30" />
                  ) : (
                    <Gift className="h-24 w-24 text-cestas-sage/30" />
                  )}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {product.category === "rolee" ? (
                    <Beer className="h-5 w-5 text-rolee-golden" />
                  ) : (
                    <Gift className="h-5 w-5 text-cestas-sage" />
                  )}
                  {product.name}
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold font-serif">{product.price}</p>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${
                    product.category === "rolee"
                      ? "bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-golden border border-rolee-golden"
                      : "bg-cestas-base hover:bg-cestas-base/90 text-cestas-sage border border-cestas-sage"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o ${product.name}`,
                      "_blank"
                    );
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Pedir pelo WhatsApp
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
          <DialogContent className="max-w-2xl">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-2xl">
                    {selectedProduct.category === "rolee" ? (
                      <Beer className="h-6 w-6 text-rolee-golden" />
                    ) : (
                      <Gift className="h-6 w-6 text-cestas-sage" />
                    )}
                    {selectedProduct.name}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Detalhes do produto {selectedProduct.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="aspect-video overflow-hidden rounded-lg bg-gradient-to-br from-muted to-muted/50">
                    <div className="w-full h-full flex items-center justify-center">
                      {selectedProduct.category === "rolee" ? (
                        <Beer className="h-32 w-32 text-rolee-golden/30" />
                      ) : (
                        <Gift className="h-32 w-32 text-cestas-sage/30" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-lg">{selectedProduct.description}</p>
                    <p className="text-3xl font-bold font-serif">{selectedProduct.price}</p>
                  </div>

                  <Button
                    className={`w-full ${
                      selectedProduct.category === "rolee"
                        ? "bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-golden border border-rolee-golden"
                        : "bg-cestas-base hover:bg-cestas-base/90 text-cestas-sage border border-cestas-sage"
                    }`}
                    size="lg"
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
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Products;