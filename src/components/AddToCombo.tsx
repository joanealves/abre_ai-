// import { useState } from "react";
// import { Button } from "./ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
// import { Wine, Candy, Cookie, Plus, ShoppingCart } from "lucide-react";
// import { useCart } from "@/hooks/use-cart";

// type ComboCategory = "bebidas" | "chocolates" | "petiscos" | "todos";

// interface ComboItem {
//   id: number;
//   name: string;
//   description: string;
//   price: string;
//   priceNumber: number;
//   category: Exclude<ComboCategory, "todos">;
//   icon: typeof Wine;
// }

// const comboItems: ComboItem[] = [
//   {
//     id: 101,
//     name: "Cerveja Artesanal IPA",
//     description: "500ml - Amargor equilibrado",
//     price: "R$ 15,90",
//     priceNumber: 15.90,
//     category: "bebidas",
//     icon: Wine,
//   },
//   {
//     id: 102,
//     name: "Vinho Tinto Reserva",
//     description: "750ml - Seleção especial",
//     price: "R$ 49,90",
//     priceNumber: 49.90,
//     category: "bebidas",
//     icon: Wine,
//   },
//   {
//     id: 103,
//     name: "Espumante Rosé",
//     description: "750ml - Celebração perfeita",
//     price: "R$ 39,90",
//     priceNumber: 39.90,
//     category: "bebidas",
//     icon: Wine,
//   },
//   {
//     id: 104,
//     name: "Chocolate Belga 70%",
//     description: "Barra premium 100g",
//     price: "R$ 18,90",
//     priceNumber: 18.90,
//     category: "chocolates",
//     icon: Candy,
//   },
//   {
//     id: 105,
//     name: "Trufas Sortidas",
//     description: "Caixa com 12 unidades",
//     price: "R$ 34,90",
//     priceNumber: 34.90,
//     category: "chocolates",
//     icon: Candy,
//   },
//   {
//     id: 106,
//     name: "Bombons Gourmet",
//     description: "Seleção especial 200g",
//     price: "R$ 29,90",
//     priceNumber: 29.90,
//     category: "chocolates",
//     icon: Candy,
//   },
//   {
//     id: 107,
//     name: "Mix de Castanhas Premium",
//     description: "Seleção de 5 tipos - 250g",
//     price: "R$ 24,90",
//     priceNumber: 24.90,
//     category: "petiscos",
//     icon: Cookie,
//   },
//   {
//     id: 108,
//     name: "Tábua de Queijos Especiais",
//     description: "3 tipos selecionados",
//     price: "R$ 45,90",
//     priceNumber: 45.90,
//     category: "petiscos",
//     icon: Cookie,
//   },
//   {
//     id: 109,
//     name: "Biscoitos Artesanais",
//     description: "Mix de sabores - 200g",
//     price: "R$ 19,90",
//     priceNumber: 19.90,
//     category: "petiscos",
//     icon: Cookie,
//   },
// ];

// const AddToCombo = () => {
//   const [selectedCategory, setSelectedCategory] = useState<ComboCategory>("todos");
//   const { addItem } = useCart();

//   const filteredItems = selectedCategory === "todos"
//     ? comboItems
//     : comboItems.filter((item) => item.category === selectedCategory);

//   const getCategoryColor = (category: Exclude<ComboCategory, "todos">) => {
//     switch (category) {
//       case "bebidas":
//         return "text-rolee-golden border-rolee-golden/20 hover:border-rolee-golden";
//       case "chocolates":
//         return "text-cestas-sage border-cestas-sage/20 hover:border-cestas-sage";
//       case "petiscos":
//         return "text-primary border-primary/20 hover:border-primary";
//     }
//   };

//   const getCategoryButtonColor = (category: Exclude<ComboCategory, "todos">) => {
//     switch (category) {
//       case "bebidas":
//         return "bg-rolee-dark text-rolee-golden border-rolee-golden hover:bg-rolee-dark/90";
//       case "chocolates":
//         return "bg-cestas-base text-cestas-sage border-cestas-sage hover:bg-cestas-base/90";
//       case "petiscos":
//         return "bg-primary text-primary-foreground hover:bg-primary/90";
//     }
//   };

//   const handleAddToCart = (item: ComboItem) => {
//     addItem({
//       id: item.id,
//       name: item.name,
//       price: item.priceNumber,
//       category: item.category,
//     });
//   };

//   return (
//     <section id="add-to-combo" className="py-20 px-4 bg-muted/30">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12 animate-fade-in">
//           <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
//             Adicione ao Seu Combo
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
//             Personalize sua experiência com itens complementares selecionados
//           </p>

//           <div className="flex flex-wrap gap-4 justify-center">
//             <Button
//               size="lg"
//               variant={selectedCategory === "todos" ? "default" : "outline"}
//               onClick={() => setSelectedCategory("todos")}
//               className="text-base"
//             >
//               Todos os Itens
//             </Button>
//             <Button
//               size="lg"
//               variant={selectedCategory === "bebidas" ? "default" : "outline"}
//               onClick={() => setSelectedCategory("bebidas")}
//               className={`text-base ${
//                 selectedCategory === "bebidas"
//                   ? "bg-rolee-dark text-rolee-golden border-rolee-golden"
//                   : ""
//               }`}
//             >
//               <Wine className="mr-2 h-5 w-5" />
//               Bebidas
//             </Button>
//             <Button
//               size="lg"
//               variant={selectedCategory === "chocolates" ? "default" : "outline"}
//               onClick={() => setSelectedCategory("chocolates")}
//               className={`text-base ${
//                 selectedCategory === "chocolates"
//                   ? "bg-cestas-base text-cestas-sage border-cestas-sage"
//                   : ""
//               }`}
//             >
//               <Candy className="mr-2 h-5 w-5" />
//               Chocolates
//             </Button>
//             <Button
//               size="lg"
//               variant={selectedCategory === "petiscos" ? "default" : "outline"}
//               onClick={() => setSelectedCategory("petiscos")}
//               className={`text-base ${
//                 selectedCategory === "petiscos"
//                   ? "bg-primary text-primary-foreground"
//                   : ""
//               }`}
//             >
//               <Cookie className="mr-2 h-5 w-5" />
//               Petiscos
//             </Button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredItems.map((item, index) => {
//             const Icon = item.icon;
//             return (
//               <Card
//                 key={item.id}
//                 className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in ${getCategoryColor(item.category)}`}
//                 style={{ animationDelay: `${index * 100}ms` }}
//               >
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-lg">
//                     <Icon className="h-5 w-5" />
//                     {item.name}
//                   </CardTitle>
//                   <CardDescription>{item.description}</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-2xl font-bold font-serif">{item.price}</p>
//                 </CardContent>
//                 <CardFooter className="gap-2">
//                   <Button
//                     className={`flex-1 ${getCategoryButtonColor(item.category)}`}
//                     onClick={() => handleAddToCart(item)}
//                   >
//                     <Plus className="mr-2 h-4 w-4" />
//                     Adicionar
//                   </Button>
//                   <Button
//                     variant="outline"
//                     className="flex-1"
//                     onClick={() =>
//                       window.open(
//                         `https://wa.me/5511999999999?text=Olá! Gostaria de adicionar ${item.name} ao meu combo`,
//                         "_blank"
//                       )
//                     }
//                   >
//                     <ShoppingCart className="mr-2 h-4 w-4" />
//                     WhatsApp
//                   </Button>
//                 </CardFooter>
//               </Card>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AddToCombo;



import { useState } from "react";
import {
  Button
} from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Wine,
  Candy,
  Cookie,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

type ComboCategory = "bebidas" | "chocolates" | "petiscos" | "todos";

interface ComboItem {
  id: number;
  name: string;
  description: string;
  price: string;
  priceNumber: number;
  category: Exclude<ComboCategory, "todos">;
  icon: typeof Wine;
}

const comboItems: ComboItem[] = [
  {
    id: 101,
    name: "Cerveja Artesanal IPA",
    description: "500ml - Amargor equilibrado",
    price: "R$ 15,90",
    priceNumber: 15.9,
    category: "bebidas",
    icon: Wine,
  },
  {
    id: 102,
    name: "Vinho Tinto Reserva",
    description: "750ml - Seleção especial",
    price: "R$ 49,90",
    priceNumber: 49.9,
    category: "bebidas",
    icon: Wine,
  },
  {
    id: 104,
    name: "Chocolate Belga 70%",
    description: "Barra premium 100g",
    price: "R$ 18,90",
    priceNumber: 18.9,
    category: "chocolates",
    icon: Candy,
  },
  {
    id: 107,
    name: "Mix de Castanhas Premium",
    description: "Seleção de 5 tipos - 250g",
    price: "R$ 24,90",
    priceNumber: 24.9,
    category: "petiscos",
    icon: Cookie,
  },
];

const AddToCombo = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<ComboCategory>("todos");

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const { addItem } = useCart();

  const filteredItems =
    selectedCategory === "todos"
      ? comboItems
      : comboItems.filter((item) => item.category === selectedCategory);

  const changeQty = (id: number, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const handleAddToCart = (item: ComboItem) => {
    const qty = quantities[item.id] || 0;
    if (qty === 0) return;

    for (let i = 0; i < qty; i++) {
      addItem({
        id: item.id,
        name: item.name,
        price: item.priceNumber,
        category: item.category,
      });
    }

    setQuantities((prev) => ({ ...prev, [item.id]: 0 }));
  };

  return (
    <section id="add-to-combo" className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Monte seu Combo
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escolha os itens, ajuste a quantidade e crie a experiência do seu jeito.
          </p>
        </div>

        {/* FILTROS */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {["todos", "bebidas", "chocolates", "petiscos"].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat as ComboCategory)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const qty = quantities[item.id] || 0;

            return (
              <Card
                key={item.id}
                className="hover:shadow-xl transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-2xl font-bold">{item.price}</p>

                  {/* CONTADOR */}
                  <div className="flex items-center justify-between border rounded-lg p-2">
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={qty === 0}
                      onClick={() => changeQty(item.id, -1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <span className="text-lg font-semibold">{qty}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => changeQty(item.id, +1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button
                    className="flex-1"
                    disabled={qty === 0}
                    onClick={() => handleAddToCart(item)}
                  >
                    Adicionar {qty > 0 && `(${qty})`}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://wa.me/5511999999999?text=Olá! Quero ${qty || 1}x ${item.name}`,
                        "_blank"
                      )
                    }
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
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
