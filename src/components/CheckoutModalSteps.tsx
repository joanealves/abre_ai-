import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
// import { Separator } from "./ui/separator";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  suggestions?: string[];
  timestamp: Date;
}

const ChatSupport = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Olá! 👋 Bem-vindo ao ABRE AÍ! Como posso te ajudar hoje?",
      suggestions: ["🎁 Ver kits disponíveis", "📦 Rastrear pedido", "💬 Falar no WhatsApp"],
      timestamp: new Date(),
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const pushBot = (text: string, suggestions?: string[]) => {
    setMessages((prev) => [
      ...prev,
      { 
        id: prev.length + 1, 
        sender: "bot", 
        text, 
        suggestions,
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

  const handleIntent = (text: string) => {
    // Kits e produtos
    if (text.includes("kit") || text.includes("produto") || text.includes("disponível") || text.includes("ver")) {
      pushBot(
        "Temos várias opções incríveis! 🎉\n\n• Kits de Rolê 🍺\n• Cestas Gourmet 🎁\n• Kits de Café ☕\n• Kits para Namorados 💕\n• Opções Fit e Veganas 🥗\n\nQual te interessa mais?",
        ["🍺 Kits de Rolê", "🎁 Cestas Gourmet", "☕ Kits de Café", "💬 Falar no WhatsApp"]
      );
      return;
    }

    // Kits específicos
    if (text.includes("rolê") || text.includes("cerveja") || text.includes("boteco")) {
      pushBot(
        "Nossos kits de rolê são perfeitos! 🍺\n\n• Kit Boteco Clássico - R$ 129,90\n• Kit Premium Experience - R$ 249,90\n• Kit Rolê Completo - R$ 189,90\n\nTodos vêm com cervejas artesanais e petiscos selecionados!",
        ["➕ Adicionar ao carrinho", "💬 Pedir no WhatsApp", "🔙 Ver outras categorias"]
      );
      return;
    }

    if (text.includes("cesta") || text.includes("presente") || text.includes("gourmet")) {
      pushBot(
        "Nossas cestas são ideais para presentear! 🎁\n\n• Cesta Gourmet - R$ 159,90\n• Cesta Bem-Estar - R$ 139,90\n• Cesta Premium Gift - R$ 299,90\n\nPerfeitas para qualquer ocasião especial!",
        ["➕ Escolher cesta", "💬 Falar no WhatsApp", "🔙 Voltar"]
      );
      return;
    }

    if (text.includes("café") || text.includes("coffee")) {
      pushBot(
        "Kits de café para os amantes da bebida! ☕\n\n• Kit Café Premium - R$ 89,90\n• Kit Café & Brunch - R$ 119,90\n\nCafés especiais + acompanhamentos deliciosos!",
        ["➕ Quero um kit", "💬 WhatsApp", "🔙 Ver outros"]
      );
      return;
    }

    // Rastreamento
    if (text.includes("rastrear") || text.includes("pedido") || text.includes("código")) {
      pushBot(
        "Para rastrear seu pedido, você precisa do código de rastreamento que enviamos por email. 📦\n\nEle tem o formato: ABREAI-XXXXX",
        ["📍 Abrir rastreamento", "💬 Preciso de ajuda", "🔙 Menu principal"]
      );
      return;
    }

    // Entrega
    if (text.includes("entrega") || text.includes("prazo") || text.includes("demora") || text.includes("quanto tempo")) {
      pushBot(
        "Nossos prazos de entrega: 🚚\n\n• Região Metropolitana: até 48h úteis\n• Interior de SP: 3-5 dias úteis\n• Outras regiões: 5-10 dias úteis\n\n*Entregas expressas disponíveis!",
        ["📦 Ver mais sobre entrega", "💬 Falar no WhatsApp"]
      );
      return;
    }

    // Pagamento
    if (text.includes("pagamento") || text.includes("pagar") || text.includes("pix") || text.includes("cartão")) {
      pushBot(
        "Formas de pagamento aceitas: 💳\n\n✅ PIX (5% de desconto)\n✅ Cartão de crédito (até 3x sem juros)\n✅ Cartão de débito\n✅ Transferência bancária",
        ["🎁 Ver kits", "💬 Falar no WhatsApp"]
      );
      return;
    }

    // Preço e valores
    if (text.includes("preço") || text.includes("valor") || text.includes("quanto custa")) {
      pushBot(
        "Nossos kits variam de R$ 89,90 até R$ 299,90! 💰\n\nTemos opções para todos os bolsos e ocasiões. Qual categoria te interessa?",
        ["🍺 Kits de Rolê", "🎁 Cestas", "☕ Café", "💬 WhatsApp"]
      );
      return;
    }

    // Personalização
    if (text.includes("personalizar") || text.includes("customizar") || text.includes("montar")) {
      pushBot(
        "Você pode montar seu próprio combo! 🎨\n\nEscolha um kit base e adicione itens extras:\n• Bebidas 🍷\n• Chocolates 🍫\n• Petiscos 🧀\n\nRola até a seção 'Adicione ao Seu Combo' no site!",
        ["🛍️ Ver complementos", "💬 Preciso de ajuda", "🔙 Voltar"]
      );
      return;
    }

    // Dúvidas gerais
    if (text.includes("dúvida") || text.includes("ajuda") || text.includes("informação")) {
      pushBot(
        "Estou aqui para te ajudar! 😊\n\nPosso te informar sobre:\n• Produtos e kits\n• Preços e formas de pagamento\n• Prazos de entrega\n• Rastreamento de pedidos\n\nO que você gostaria de saber?",
        ["🎁 Ver produtos", "📦 Rastrear pedido", "💬 Falar com humano"]
      );
      return;
    }

    // WhatsApp
    if (text.includes("whatsapp") || text.includes("humano") || text.includes("atendente") || text.includes("falar")) {
      pushBot(
        "Vou te conectar com nossa equipe! 👥\n\nVocê será redirecionado para o WhatsApp em instantes...",
        []
      );
      setTimeout(() => {
        window.open(
          "https://wa.me/5511999999999?text=Olá! Vim através do chat do site.",
          "_blank"
        );
      }, 1500);
      return;
    }

    // Saudações
    if (text.includes("oi") || text.includes("olá") || text.includes("ola") || text.includes("bom dia") || text.includes("boa tarde") || text.includes("boa noite")) {
      pushBot(
        "Oi! 😊 É um prazer te atender! Como posso te ajudar hoje?",
        ["🎁 Ver kits", "📦 Rastrear pedido", "💬 Falar no WhatsApp"]
      );
      return;
    }

    // Agradecimentos
    if (text.includes("obrigado") || text.includes("obrigada") || text.includes("valeu")) {
      pushBot(
        "Por nada! 💚 Fico feliz em ajudar!\n\nPrecisa de mais alguma coisa?",
        ["🎁 Ver produtos", "📦 Rastrear", "👋 Encerrar"]
      );
      return;
    }

    // Resposta padrão
    pushBot(
      "Hmm, não entendi muito bem... 🤔\n\nMas posso te ajudar com:\n\n✨ Informações sobre nossos kits\n📦 Rastreamento de pedidos\n💬 Conectar você com nossa equipe\n\nO que você precisa?",
      ["🎁 Ver kits", "📦 Rastrear pedido", "💬 Falar no WhatsApp"]
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary/80 hover:scale-110 transition-transform"
        >
          <MessageCircle className="h-6 w-6" />
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
                <p className="text-xs text-white/80 font-normal">Online agora</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Sparkles className="h-3 w-3 mr-1" />
              IA
            </Badge>
          </div>
        </SheetHeader>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.sender === "bot" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted-foreground text-white"
              }`}>
                {msg.sender === "bot" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>

              <div className={`flex-1 ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                <Card className={`p-3 max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card"
                }`}>
                  <p className="text-sm whitespace-pre-line leading-relaxed">
                    {msg.text}
                  </p>
                </Card>
                <span className="text-xs text-muted-foreground mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </span>

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
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </Card>
            </div>
          )}

          <div ref={endRef} />
        </div>

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
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim()}
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Powered by ABRE AÍ! IA 🤖
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatSupport;