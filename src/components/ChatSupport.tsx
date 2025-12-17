import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Bot, User, Sparkles, ShoppingCart, Heart, Package } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/hooks/use-favorites";
import { useOrders } from "@/hooks/use-orders";
import { useAuth } from "@/contexts/AuthContext";
import type { ProductCategory } from "@/types/types";

/**
 * ChatSupport - Assistente Inteligente ABRE AÍ!
 * 
 * INTEGRAÇÕES:
 * - CartContext: Adicionar produtos, ver carrinho
 * - useFavorites: Ver favoritos, adicionar ao carrinho
 * - useOrders: Ver pedidos, rastrear status
 * - useAuth: Identificar usuário
 * 
 * FEATURES:
 * - Lista produtos REAIS do catálogo
 * - Adiciona ao carrinho direto do chat
 * - Mostra pedidos do usuário logado
 * - Recomendações inteligentes
 * - Cálculos em tempo real
 */

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  suggestions?: string[];
  products?: ProductCard[];
  timestamp: Date;
}

interface ProductCard {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
}

// Catálogo de produtos (sincronizado com Products.tsx)
const PRODUCTS_CATALOG: ProductCard[] = [
  { id: 1, name: "Kit Boteco Clássico", price: 129.9, category: "rolee", description: "6 cervejas artesanais + petiscos" },
  { id: 2, name: "Kit Premium Experience", price: 249.9, category: "rolee", description: "12 cervejas especiais + tábua de frios" },
  { id: 3, name: "Kit Rolê Completo", price: 189.9, category: "rolee", description: "Mix de bebidas + aperitivos + jogos" },
  { id: 4, name: "Cesta Gourmet", price: 159.9, category: "cestas", description: "Vinhos, queijos, geleias e pães artesanais" },
  { id: 5, name: "Cesta Bem-Estar", price: 139.9, category: "cestas", description: "Chás especiais, mel, granolas e chocolates" },
  { id: 6, name: "Cesta Premium Gift", price: 299.9, category: "cestas", description: "Seleção especial para presentear" },
  { id: 7, name: "Kit Café Premium", price: 89.9, category: "cafe", description: "Cafés especiais, cookies e doces gourmet" },
  { id: 8, name: "Kit Café & Brunch", price: 119.9, category: "cafe", description: "Cafés selecionados, pães, geleias e queijos" },
  { id: 9, name: "Kit Romântico", price: 179.9, category: "namorados", description: "Espumante, chocolates e petiscos" },
  { id: 10, name: "Kit Date Night", price: 199.9, category: "namorados", description: "Vinho especial, queijos, frutas e velas" },
  { id: 11, name: "Kit Fit Saudável", price: 99.9, category: "fit", description: "Snacks proteicos, frutas secas e sucos" },
  { id: 12, name: "Kit Power Fitness", price: 149.9, category: "fit", description: "Whey, barras de proteína, pasta de amendoim" },
  { id: 13, name: "Kit Vegano Completo", price: 109.9, category: "vegan", description: "Snacks vegetais, patês, geleias e sucos" },
  { id: 14, name: "Kit Plant-Based Premium", price: 169.9, category: "vegan", description: "Queijos veganos, vinhos, chocolates" },
  { id: 15, name: "Kit Churrasco Starter", price: 139.9, category: "churrasco", description: "Temperos especiais, molhos e cerveja" },
  { id: 16, name: "Kit Churrasco Premium", price: 299.9, category: "churrasco", description: "Carnes nobres, acompanhamentos, bebidas" },
];

const ChatSupport = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Olá! 👋 Sou seu assistente inteligente da ABRE AÍ!\n\nPosso te ajudar com:\n• Ver produtos e adicionar ao carrinho\n• Consultar seus pedidos\n• Gerenciar favoritos\n• Calcular totais\n\nComo posso ajudar?",
      suggestions: ["🎁 Ver produtos", "🛒 Ver carrinho", "📦 Meus pedidos", "❤️ Favoritos"],
      timestamp: new Date(),
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hooks de integração
  const { items, addItem, getTotalPrice, getItemCount } = useCart();
  const { favorites, favoritesCount } = useFavorites();
  const { orders, getOrderByTrackingCode, getUserOrders } = useOrders();
  const { user } = useAuth();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const pushBot = (text: string, suggestions?: string[], products?: ProductCard[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "bot",
        text,
        suggestions,
        products,
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
  };

  const pushUser = (text: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        text,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSend = (custom?: string) => {
    const text = custom ?? input;
    if (!text.trim()) return;

    pushUser(text);
    setInput("");
    setIsTyping(true);

    setTimeout(() => handleIntent(text.toLowerCase()), 800);
  };

  const handleAddToCart = (product: ProductCard) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
    });

    pushBot(
      `✅ ${product.name} adicionado ao carrinho!\n\nTotal no carrinho: ${formatPrice(getTotalPrice() + product.price)}\n\nQuer adicionar mais algo?`,
      ["🎁 Ver mais produtos", "🛒 Ver carrinho completo", "✅ Finalizar pedido"]
    );
  };

  const handleIntent = (text: string) => {
    // ========================================
    // CARRINHO
    // ========================================
    if (
      text.includes("carrinho") ||
      text.includes("cart") ||
      text.includes("ver carrinho")
    ) {
      if (items.length === 0) {
        pushBot(
          "Seu carrinho está vazio! 🛒\n\nQue tal explorar nossos produtos?",
          ["🎁 Ver produtos", "❤️ Ver favoritos"]
        );
        return;
      }

      const itemsList = items
        .map((item) => `• ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`)
        .join("\n");

      pushBot(
        `🛒 Seu Carrinho (${getItemCount()} itens):\n\n${itemsList}\n\n💰 Total: ${formatPrice(getTotalPrice())}`,
        ["➕ Adicionar mais", "✅ Finalizar pedido", "🔙 Menu"]
      );
      return;
    }

    // ========================================
    // PRODUTOS POR CATEGORIA
    // ========================================
    if (
      text.includes("ver produtos") ||
      text.includes("produtos") ||
      text.includes("catálogo") ||
      text.includes("ver kits")
    ) {
      pushBot(
        "Qual categoria te interessa? 🎯",
        ["🍺 Rolê", "🎁 Cestas", "☕ Café", "💕 Namorados", "💪 Fit", "🌱 Vegan", "🔥 Churrasco", "📋 Ver todos"]
      );
      return;
    }

    // Categorias específicas
    const categoryMap: Record<string, ProductCategory[]> = {
      "rolê|cerveja|boteco|bebida": ["rolee"],
      "cesta|presente|gourmet": ["cestas"],
      "café|coffee|brunch": ["cafe"],
      "namorados|romântico|casal|date": ["namorados"],
      "fit|fitness|saudável|proteína": ["fit"],
      "vegan|vegano|plant": ["vegan"],
      "churrasco|carne|bbq": ["churrasco"],
      "todos|tudo": ["rolee", "cestas", "cafe", "namorados", "fit", "vegan", "churrasco"],
    };

    for (const [keywords, categories] of Object.entries(categoryMap)) {
      if (keywords.split("|").some(k => text.includes(k))) {
        const filteredProducts = PRODUCTS_CATALOG.filter(p =>
          categories.includes(p.category)
        );

        const productsText = filteredProducts
          .slice(0, 5) // Limita a 5 produtos
          .map((p, i) => `${i + 1}. ${p.name}\n   ${formatPrice(p.price)} - ${p.description}`)
          .join("\n\n");

        pushBot(
          `✨ Produtos encontrados (${filteredProducts.length}):\n\n${productsText}\n\n💡 Digite o número do produto para adicionar ao carrinho!`,
          categories.length === 1 ? ["🔙 Outras categorias"] : ["🔙 Menu"],
          filteredProducts.slice(0, 5)
        );
        return;
      }
    }

    // Adicionar produto por número
    const numberMatch = text.match(/^(\d+)$/);
    if (numberMatch) {
      const productIndex = parseInt(numberMatch[1]) - 1;
      const lastBotMessage = messages
        .filter(m => m.sender === "bot")
        .reverse()
        .find(m => m.products && m.products.length > 0);

      if (lastBotMessage && lastBotMessage.products && lastBotMessage.products[productIndex]) {
        const product = lastBotMessage.products[productIndex];
        handleAddToCart(product);
        return;
      }
    }

    // ========================================
    // PEDIDOS
    // ========================================
    if (
      text.includes("pedido") ||
      text.includes("meus pedidos") ||
      text.includes("ordem") ||
      text.includes("compra")
    ) {
      if (!user) {
        pushBot(
          "Para ver seus pedidos, você precisa estar logado! 🔐",
          ["👤 Como faço login?", "🔙 Menu"]
        );
        return;
      }

      const userOrders = getUserOrders(user.email);

      if (userOrders.length === 0) {
        pushBot(
          "Você ainda não tem pedidos! 📦\n\nQue tal fazer seu primeiro pedido?",
          ["🎁 Ver produtos", "🔙 Menu"]
        );
        return;
      }

      const ordersList = userOrders
        .slice(0, 3)
        .map(
          (order) =>
            `📦 ${order.id}\n   Status: ${getStatusLabel(order.status)}\n   Total: ${formatPrice(order.total)}\n   Código: ${order.trackingCode}`
        )
        .join("\n\n");

      pushBot(
        `Seus Pedidos (${userOrders.length}):\n\n${ordersList}`,
        ["📍 Rastrear pedido", "🎁 Fazer novo pedido", "🔙 Menu"]
      );
      return;
    }

    // Rastreamento
    if (text.includes("rastrear") || text.includes("rastreio") || text.includes("tracking")) {
      pushBot(
        "Para rastrear, me envie o código do seu pedido!\n\nFormato: ABXXXXXXXX (10 caracteres)",
        ["📦 Ver meus pedidos", "🔙 Menu"]
      );
      return;
    }

    // Buscar por código de rastreamento
    const trackingMatch = text.match(/[A-Z]{2}[A-Z0-9]{8}/i);
    if (trackingMatch) {
      const code = trackingMatch[0].toUpperCase();
      const order = getOrderByTrackingCode(code);

      if (order) {
        pushBot(
          `📦 Pedido Encontrado!\n\nCódigo: ${order.trackingCode}\nStatus: ${getStatusLabel(order.status)}\nData: ${new Date(order.date).toLocaleDateString("pt-BR")}\nTotal: ${formatPrice(order.total)}\n\n${getStatusDescription(order.status)}`,
          ["📦 Ver todos os pedidos", "🔙 Menu"]
        );
      } else {
        pushBot(
          `Não encontrei nenhum pedido com o código "${code}" 😕\n\nVerifique se digitou corretamente!`,
          ["📦 Meus pedidos", "🔙 Menu"]
        );
      }
      return;
    }

    // ========================================
    // FAVORITOS
    // ========================================
    if (
      text.includes("favorito") ||
      text.includes("salvos") ||
      text.includes("curtidos")
    ) {
      if (favoritesCount === 0) {
        pushBot(
          "Você não tem favoritos ainda! ❤️\n\nAdicione produtos aos favoritos para vê-los aqui.",
          ["🎁 Ver produtos", "🔙 Menu"]
        );
        return;
      }

      const favoritesList = favorites
        .slice(0, 5)
        .map((fav, i) => `${i + 1}. ${fav.name} - ${formatPrice(fav.price)}`)
        .join("\n");

      pushBot(
        `❤️ Seus Favoritos (${favoritesCount}):\n\n${favoritesList}\n\n💡 Digite o número para adicionar ao carrinho!`,
        ["🔙 Menu"]
      );
      return;
    }

    // ========================================
    // RECOMENDAÇÕES
    // ========================================
    if (text.includes("recomendar") || text.includes("sugestão") || text.includes("indicar")) {
      if (items.length > 0) {
        // Recomenda produtos complementares
        const categories = [...new Set(items.map(item => item.category))];
        const complementary = PRODUCTS_CATALOG.filter(
          p => !categories.includes(p.category) && !items.some(i => i.id === p.id)
        ).slice(0, 3);

        if (complementary.length > 0) {
          const recList = complementary
            .map((p, i) => `${i + 1}. ${p.name}\n   ${formatPrice(p.price)} - ${p.description}`)
            .join("\n\n");

          pushBot(
            `💡 Baseado no seu carrinho, recomendo:\n\n${recList}\n\nDigite o número para adicionar!`,
            ["🎁 Ver mais produtos", "🛒 Ver carrinho"],
            complementary
          );
        } else {
          pushBot(
            "Você já tem uma ótima seleção no carrinho! 🎉",
            ["🛒 Ver carrinho", "✅ Finalizar pedido"]
          );
        }
      } else {
        // Recomenda os mais populares
        const popular = PRODUCTS_CATALOG.slice(0, 3);
        const popList = popular
          .map((p, i) => `${i + 1}. ${p.name}\n   ${formatPrice(p.price)} - ${p.description}`)
          .join("\n\n");

        pushBot(
          `🌟 Nossos produtos mais populares:\n\n${popList}\n\nDigite o número para adicionar!`,
          ["🎁 Ver todos os produtos"],
          popular
        );
      }
      return;
    }

    // ========================================
    // CÁLCULOS
    // ========================================
    if (text.includes("total") || text.includes("quanto") || text.includes("valor")) {
      if (items.length === 0) {
        pushBot("Seu carrinho está vazio! Adicione produtos para calcular o total.", ["🎁 Ver produtos"]);
        return;
      }

      pushBot(
        `💰 Resumo do Carrinho:\n\nItens: ${getItemCount()}\nSubtotal: ${formatPrice(getTotalPrice())}\nFrete: Calculado no checkout\n\n💡 Pagando com PIX você ganha 5% de desconto!`,
        ["✅ Finalizar pedido", "➕ Adicionar mais", "🔙 Menu"]
      );
      return;
    }

    // ========================================
    // INFORMAÇÕES
    // ========================================
    if (text.includes("entrega") || text.includes("prazo") || text.includes("frete")) {
      pushBot(
        "📦 Prazos de Entrega:\n\n• Região Metropolitana: 48h úteis\n• Interior: 3-5 dias úteis\n• Outras regiões: 5-10 dias úteis\n\n🚀 Entrega expressa disponível!",
        ["🎁 Ver produtos", "💬 Falar no WhatsApp"]
      );
      return;
    }

    if (text.includes("pagamento") || text.includes("pagar") || text.includes("forma")) {
      pushBot(
        "💳 Formas de Pagamento:\n\n✅ PIX (5% desconto)\n✅ Cartão de crédito (até 3x sem juros)\n✅ Cartão de débito\n✅ Transferência bancária",
        ["🎁 Ver produtos", "🔙 Menu"]
      );
      return;
    }

    // ========================================
    // WHATSAPP
    // ========================================
    if (text.includes("whatsapp") || text.includes("humano") || text.includes("atendente")) {
      pushBot("Vou te conectar com nossa equipe! 👥\n\nRedirecionando para o WhatsApp...", []);
      setTimeout(() => {
        window.open("https://wa.me/5511999999999?text=Olá! Vim através do chat inteligente.", "_blank");
      }, 1500);
      return;
    }

    // ========================================
    // SAUDAÇÕES
    // ========================================
    if (text.includes("oi") || text.includes("olá") || text.includes("ola") || text.includes("bom dia")) {
      const userName = user ? `, ${user.name.split(" ")[0]}` : "";
      pushBot(
        `Oi${userName}! 😊 Como posso te ajudar hoje?`,
        ["🎁 Ver produtos", "🛒 Ver carrinho", "📦 Meus pedidos"]
      );
      return;
    }

    if (text.includes("obrigado") || text.includes("obrigada") || text.includes("valeu")) {
      pushBot(
        "Por nada! 💚 Fico feliz em ajudar!\n\nPrecisa de mais alguma coisa?",
        ["🎁 Ver produtos", "📦 Meus pedidos", "👋 Encerrar"]
      );
      return;
    }

    // ========================================
    // RESPOSTA PADRÃO
    // ========================================
    pushBot(
      "Hmm, não entendi muito bem... 🤔\n\nPosso te ajudar com:\n\n🎁 Mostrar produtos e adicionar ao carrinho\n🛒 Ver seu carrinho\n📦 Consultar seus pedidos\n❤️ Gerenciar favoritos\n💬 Conectar com a equipe\n\nO que você precisa?",
      ["🎁 Ver produtos", "🛒 Carrinho", "📦 Pedidos", "💬 WhatsApp"]
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "⏳ Aguardando",
      confirmed: "✅ Confirmado",
      preparing: "📦 Preparando",
      dispatched: "🚚 Em Entrega",
      delivered: "✅ Entregue",
      cancelled: "❌ Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusDescription = (status: string) => {
    const descriptions: Record<string, string> = {
      pending: "Aguardando confirmação de pagamento",
      confirmed: "Pedido confirmado! Em breve começaremos a preparar",
      preparing: "Estamos preparando seu pedido com carinho",
      dispatched: "Seu pedido saiu para entrega!",
      delivered: "Pedido entregue! Aproveite! 🎉",
      cancelled: "Pedido cancelado",
    };
    return descriptions[status] || "";
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary/80 hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
          {getItemCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
              {getItemCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8" />
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <SheetTitle className="text-white text-lg">Assistente ABRE AÍ!</SheetTitle>
                <p className="text-xs text-white/80 font-normal">Online • Integrado com seu carrinho</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                IA
              </Badge>
              {getItemCount() > 0 && (
                <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {getItemCount()}
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                  msg.sender === "bot" ? "bg-primary text-primary-foreground" : "bg-muted-foreground text-white"
                }`}
              >
                {msg.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div className={`flex-1 ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                <Card
                  className={`p-3 max-w-[85%] ${
                    msg.sender === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-card"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{msg.text}</p>
                </Card>
                <span className="text-xs text-muted-foreground mt-1 px-1">{formatTime(msg.timestamp)}</span>

                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Cards de produtos */}
                {msg.products && msg.products.length > 0 && (
                  <div className="space-y-2 mt-3 w-full">
                    {msg.products.map((product, idx) => (
                      <Card key={product.id} className="p-3 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">{product.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                            <p className="font-bold text-primary mt-2">{formatPrice(product.price)}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            className="ml-2"
                          >
                            <ShoppingCart className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <Card className="p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </Card>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Status bar com info do carrinho */}
        {getItemCount() > 0 && (
          <div className="px-4 py-2 bg-primary/10 border-t border-primary/20">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <ShoppingCart className="h-3 w-3" />
                {getItemCount()} {getItemCount() === 1 ? "item" : "itens"}
              </span>
              <span className="font-bold">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()} className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" />
            Assistente Inteligente ABRE AÍ!
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSupport;