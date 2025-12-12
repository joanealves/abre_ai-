import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet";
import { MessageCircle, Send, User, Bot, Clock, Phone, Mail, Star, Package } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  suggestions?: string[];
}

const ChatSupportImproved = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! 👋 Bem-vindo ao ABRE AÍ! Sou seu assistente virtual. Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
      suggestions: ["Ver Produtos", "Rastrear Pedido", "Formas de Pagamento", "Falar com Atendente"],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { items, getItemCount } = useCart();
  const { favoritesCount } = useFavorites();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "bot") {
        setUnreadCount((prev) => prev + 1);
      }
    } else if (isOpen) {
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const getBotResponse = (userMessage: string): { text: string; suggestions?: string[] } => {
    const lowerMessage = userMessage.toLowerCase();

    // Personaliza com nome se disponível
    const greeting = customerName ? `${customerName}, ` : "";

    // Detecção de nome
    if (lowerMessage.includes("meu nome é") || lowerMessage.includes("me chamo")) {
      const nameMatch = userMessage.match(/(?:meu nome é|me chamo)\s+(\w+)/i);
      if (nameMatch) {
        setCustomerName(nameMatch[1]);
        return {
          text: `Prazer em conhecê-lo, ${nameMatch[1]}! 😊 Agora posso te ajudar melhor. O que gostaria de saber?`,
          suggestions: ["Ver Kits de Rolê", "Ver Cestas", "Informações de Entrega"],
        };
      }
    }

    // Saudações
    if (lowerMessage.match(/\b(olá|oi|bom dia|boa tarde|boa noite|e aí)\b/)) {
      return {
        text: `Olá! ${greeting}Que bom ter você aqui! 😊 Estou aqui para ajudar com qualquer dúvida sobre nossos produtos e serviços.`,
        suggestions: ["Ver Produtos", "Meu Carrinho", "Formas de Pagamento", "Rastrear Pedido"],
      };
    }

    // Carrinho
    if (lowerMessage.includes("carrinho")) {
      const itemCount = getItemCount();
      if (itemCount > 0) {
        return {
          text: `${greeting}Você tem ${itemCount} ${itemCount === 1 ? 'item' : 'itens'} no seu carrinho! 🛒 Quer finalizar seu pedido ou continuar comprando?`,
          suggestions: ["Finalizar Pedido", "Adicionar Mais Itens", "Ver Favoritos"],
        };
      }
      return {
        text: `${greeting}Seu carrinho está vazio no momento. Que tal dar uma olhada nos nossos produtos incríveis? 🎁`,
        suggestions: ["Ver Kits de Rolê", "Ver Cestas", "Adicionar aos Favoritos"],
      };
    }

    // Favoritos
    if (lowerMessage.includes("favorito")) {
      if (favoritesCount > 0) {
        return {
          text: `${greeting}Você tem ${favoritesCount} ${favoritesCount === 1 ? 'item' : 'itens'} nos favoritos! ❤️ Quer adicionar algum ao carrinho?`,
          suggestions: ["Ver Favoritos", "Adicionar ao Carrinho"],
        };
      }
      return {
        text: `${greeting}Você ainda não tem favoritos salvos. Que tal marcar alguns produtos que você gostou? ❤️`,
        suggestions: ["Ver Produtos"],
      };
    }

    // Preços
    if (lowerMessage.match(/\b(preço|valor|quanto cust|custo)\b/)) {
      return {
        text: `${greeting}Nossos preços variam conforme o kit escolhido! 💰\n\n🍺 Kits de Rolê: R$ 129,90 a R$ 249,90\n🎁 Cestas & Presentes: R$ 139,90 a R$ 299,90\n\nTemos opções para todos os gostos e bolsos!`,
        suggestions: ["Ver Kits", "Ver Cestas", "Cupons de Desconto"],
      };
    }

    // Entrega
    if (lowerMessage.match(/\b(entrega|entreg|prazo|demora|quanto tempo)\b/)) {
      return {
        text: `${greeting}Trabalhamos com entrega expressa! 🚚\n\n📦 Entrega em até 48h úteis na região metropolitana\n🎯 Agendamento para datas especiais\n📍 Consulte disponibilidade para sua região`,
        suggestions: ["Calcular Frete", "Rastrear Pedido", "Falar com Atendente"],
      };
    }

    // Kits de Rolê
    if (lowerMessage.match(/\b(kit|rolê|cerveja|bebida)\b/)) {
      return {
        text: `${greeting}Nossos Kits de Rolê são perfeitos para você curtir! 🍺\n\n🍻 Kit Boteco Clássico - R$ 129,90\n⭐ Kit Premium Experience - R$ 249,90\n🎉 Kit Rolê Completo - R$ 189,90\n\nTodos com cervejas artesanais e petiscos selecionados!`,
        suggestions: ["Ver Kits", "Adicionar ao Carrinho", "Personalizar Kit"],
      };
    }

    // Cestas
    if (lowerMessage.match(/\b(cesta|presente|gift|presentear)\b/)) {
      return {
        text: `${greeting}Nossas Cestas & Presentes são ideais para surpreender! 🎁\n\n🍷 Cesta Gourmet - R$ 159,90\n🧘 Cesta Bem-Estar - R$ 139,90\n⭐ Cesta Premium Gift - R$ 299,90\n\nPerfeitas para qualquer ocasião especial!`,
        suggestions: ["Ver Cestas", "Personalizar Cesta", "Dicas de Presente"],
      };
    }

    // Pagamento
    if (lowerMessage.match(/\b(pagamento|pagar|pix|cartão|parcelamento)\b/)) {
      return {
        text: `${greeting}Aceitamos diversas formas de pagamento! 💳\n\n✅ PIX (desconto de 5%)\n✅ Cartão de Crédito (parcelamos em até 3x sem juros)\n✅ Cartão de Débito\n\nO pagamento é confirmado no checkout!`,
        suggestions: ["Fazer Pedido", "Ver Cupons", "Falar com Atendente"],
      };
    }

    // Cupons
    if (lowerMessage.match(/\b(cupom|desconto|promoção|código)\b/)) {
      return {
        text: `${greeting}Temos cupons de desconto disponíveis! 🎟️\n\n🎉 PRIMEIRA - 10% OFF primeira compra\n💰 ABREAI15 - 15% de desconto\n🚚 FRETEGRATIS - Frete grátis\n\nUse no checkout!`,
        suggestions: ["Fazer Pedido", "Ver Produtos"],
      };
    }

    // Rastreamento
    if (lowerMessage.match(/\b(rastrear|rastreio|pedido|acompanhar)\b/)) {
      return {
        text: `${greeting}Para rastrear seu pedido, você pode:\n\n📦 Usar o código que enviamos por email\n🔍 Clicar no botão "Rastrear Pedido" no topo\n📱 Entrar em contato pelo WhatsApp\n\nTem seu código de rastreamento?`,
        suggestions: ["Rastrear Agora", "Falar com Atendente"],
      };
    }

    // Personalização
    if (lowerMessage.match(/\b(personalizar|customizar|montar|criar)\b/)) {
      return {
        text: `${greeting}Sim! Você pode personalizar totalmente seu kit! 🎨\n\n✨ Escolha os produtos que preferir\n🎁 Adicione itens especiais\n📝 Deixe uma mensagem personalizada\n\nQuer montar um kit personalizado?`,
        suggestions: ["Criar Kit Personalizado", "Falar com Atendente", "Ver Produtos"],
      };
    }

    // WhatsApp/Atendente
    if (lowerMessage.match(/\b(whatsapp|atendente|humano|pessoa|falar)\b/)) {
      return {
        text: `${greeting}Claro! Vou te conectar com nossa equipe agora! 📱\n\nVocê será redirecionado para o WhatsApp onde um atendente humano vai te ajudar com tudo que precisar!`,
        suggestions: ["Abrir WhatsApp", "Continuar no Chat"],
      };
    }

    // Obrigado
    if (lowerMessage.match(/\b(obrigad|valeu|agradeço|thanks)\b/)) {
      setShowFeedback(true);
      return {
        text: `${greeting}Por nada! 😊 Foi um prazer ajudar você!\n\nQue tal avaliar nosso atendimento?`,
        suggestions: ["⭐⭐⭐⭐⭐ Excelente", "Fazer Pedido", "Continuar Conversando"],
      };
    }

    // Tchau
    if (lowerMessage.match(/\b(tchau|até|adeus|flw|bye)\b/)) {
      return {
        text: `${greeting}Até logo! 👋 Foi ótimo conversar com você!\n\nVolte sempre que precisar. Bons rolês! 🍻`,
        suggestions: ["Fazer Pedido", "Ver Produtos"],
      };
    }

    // Resposta padrão
    return {
      text: `${greeting}Entendi! 🤔 Para te ajudar melhor com isso, você pode:\n\n💬 Falar com nossa equipe pelo WhatsApp\n📋 Ver nossos produtos\n🎁 Explorar nossas opções de kits\n\nO que prefere?`,
      suggestions: ["Falar com Atendente", "Ver Produtos", "Ver Kits"],
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(inputMessage);
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: "bot",
        timestamp: new Date(),
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes("WhatsApp")) {
      openWhatsApp();
      return;
    }

    if (suggestion.includes("⭐")) {
      toast.success("Obrigado pela avaliação! ⭐", {
        description: "Seu feedback é muito importante para nós!",
      });
      setShowFeedback(false);
      return;
    }

    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      `Olá! Vim através do chat do site ABRE AÍ! ${customerName ? `Meu nome é ${customerName}. ` : ""}Gostaria de saber mais sobre os produtos!`
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
    toast.success("Redirecionando para WhatsApp! 📱");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 hover:scale-110 transition-all relative animate-bounce"
          >
            <MessageCircle className="h-7 w-7 text-white" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center bg-destructive animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center relative">
                  <Bot className="h-7 w-7" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                </div>
                <div>
                  <SheetTitle className="text-primary-foreground text-left text-lg">
                    Assistente ABRE AÍ!
                  </SheetTitle>
                  <SheetDescription className="text-primary-foreground/90 text-left text-xs flex items-center gap-1">
                    <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                    Online agora • Resposta rápida
                  </SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Info Bar */}
          <div className="px-4 py-2 bg-muted/50 border-b">
            <div className="flex items-center justify-around text-xs">
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>{getItemCount()} no carrinho</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>Suporte 24/7</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>4.9/5.0</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/30 to-background">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={`flex gap-2 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-card border rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <div className="flex items-center gap-1 mt-2 opacity-70">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>

                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-10">
                    {message.suggestions.map((suggestion, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-7 rounded-full hover:scale-105 transition-transform"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card border rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Powered by ABRE AÍ! • Atendimento inteligente
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatSupportImproved;