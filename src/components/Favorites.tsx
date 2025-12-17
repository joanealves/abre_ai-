import { Heart, ShoppingCart, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "./ui/sheet";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/contexts/CartContext";

/**
 * Favorites - Componente de Favoritos
 * 
 * RESPONSABILIDADES:
 * - Exibir itens favoritos
 * - Adicionar favoritos ao carrinho
 * - Remover favoritos
 * 
 * INTEGRAÇÃO:
 * - useFavorites (gerenciar favoritos)
 * - CartContext (adicionar ao carrinho)
 */

const Favorites = () => {
  const { favorites, removeFavorite, favoritesCount } = useFavorites();
  const { addItem, isInCart, getItemQuantity } = useCart();

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

  const handleAddToCart = (item: typeof favorites[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {favoritesCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white">
              {favoritesCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Meus Favoritos
          </SheetTitle>
          <SheetDescription>
            {favoritesCount === 0
              ? "Nenhum favorito ainda"
              : `${favoritesCount} ${
                  favoritesCount === 1 ? "item favorito" : "itens favoritos"
                }`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Nenhum favorito adicionado
              </p>
              <p className="text-sm text-muted-foreground">
                Adicione produtos aos favoritos para salvá-los aqui
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {favorites.map((item) => {
                const inCart = isInCart(item.id);
                const cartQuantity = getItemQuantity(item.id);
                
                return (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-semibold text-sm mb-1">
                              {item.name}
                            </h4>
                            
                            {/* Indicador se está no carrinho */}
                            {inCart && (
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {cartQuantity}x no carrinho
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          
                          <Badge
                            variant="outline"
                            className={`text-xs ${getCategoryColor(item.category)}`}
                          >
                            {item.category}
                          </Badge>
                        </div>
                        
                        {/* Botão de Remover dos Favoritos */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 ml-2"
                          onClick={() => removeFavorite(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(item.price)}
                        </p>
                        
                        {/* Botão de Adicionar ao Carrinho */}
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                          className="gap-2"
                          variant={inCart ? "outline" : "default"}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {inCart ? "Adicionar mais" : "Adicionar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {favorites.length > 0 && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-center text-muted-foreground">
              💡 Dica: Adicione seus favoritos ao carrinho e faça seu pedido!
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Favorites;