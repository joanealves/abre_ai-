import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "./ui/sheet";
import { MessageCircle, Send, X, User, Bot, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! 👋 Bem-vindo ao ABRE AÍ! Como posso ajudar você hoje?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Respostas baseadas em palavras-chave
    if (lowerMessage.includes("olá") || lowerMessage.includes("oi") || lowerMessage.includes("bom dia") || lowerMessage.includes("boa tarde") || lowerMessage.includes("boa noite")) {
      return "Olá! Que bom ter você aqui! 😊 Estou aqui para ajudar. Você quer saber sobre nossos Kits de Rolê ou nossas Cestas & Presentes?";
    }

    if (lowerMessage.includes("preço") || lowerMessage.includes("valor") || lowerMessage.includes("quanto custa")) {
      return "Nossos preços variam de acordo com o kit escolhido! 💰 Temos opções a partir de R$ 129,90. Que tal dar uma olhada em nossos produtos? Ou posso te passar direto para um atendente pelo WhatsApp!";
    }

    if (lowerMessage.includes("entrega") || lowerMessage.includes("entregar") || lowerMessage.includes("prazo")) {
      return "Entregamos em até 48 horas úteis em toda a região metropolitana! 🚚 Para ocasiões especiais, podemos agendar a entrega no dia desejado. Qual é sua localização?";
    }

    if (lowerMessage.includes("kit") || lowerMessage.includes("rolê") || lowerMessage.includes("cerveja")) {
      return "Nossos Kits de Rolê são perfeitos para você curtir em casa! 🍺 Temos o Kit Boteco Clássico (R$ 129,90), Kit Premium Experience (R$ 249,90) e o Kit Rolê Completo (R$ 189,90). Qual te interessou mais?";
    }

    if (lowerMessage.includes("cesta") || lowerMessage.includes("presente") || lowerMessage.includes("gift")) {
      return "Nossas Cestas & Presentes são ideais para surpreender! 🎁 Oferecemos Cesta Gourmet (R$ 159,90), Cesta Bem-Estar (R$ 139,90) e Cesta Premium Gift (R$ 299,90). Qual ocasião você está procurando?";
    }

    if (lowerMessage.includes("pagamento") || lowerMessage.includes("pagar") || lowerMessage.includes("pix")) {
      return "Aceitamos PIX, cartão de crédito e débito! 💳 O pagamento é confirmado no momento do pedido pelo WhatsApp. É super fácil e seguro!";
    }

    if (lowerMessage.includes("personalizar") || lowerMessage.includes("customizar") || lowerMessage.includes("montar")) {
      return "Sim! Você pode personalizar seu kit totalmente! 🎨 Escolha os itens que mais gosta e montamos um combo especial para você. Quer que eu te conecte com nosso atendimento?";
    }

    if (lowerMessage.includes("whatsapp") || lowerMessage.includes("atendente") || lowerMessage.includes("humano")) {
      return "Claro! Vou te redirecionar para nosso WhatsApp agora mesmo! 📱 Lá você fala direto com nossa equipe.";
    }

    if (lowerMessage.includes("obrigad") || lowerMessage.includes("valeu") || lowerMessage.includes("agradeço")) {
      return "Por nada! 😊 Estou sempre aqui para ajudar. Tem mais alguma dúvida?";
    }

    if (lowerMessage.includes("tchau") || lowerMessage.includes("até") || lowerMessage.includes("flw")) {
      return "Até logo! 👋 Volte sempre que precisar. Bons rolês!";
    }

    // Resposta padrão
    return "Interessante! 🤔 Para te ajudar melhor com isso, que tal falar direto com nossa equipe pelo WhatsApp? Ou você pode me fazer outra pergunta sobre nossos produtos, entrega ou pagamento!";
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

    // Simula o tempo de digitação do bot
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);

      // Se a resposta menciona WhatsApp, oferece redirecionamento
      if (botResponse.includes("WhatsApp")) {
        setTimeout(() => {
          const confirmMessage: Message = {
            id: messages.length + 3,
            text: "Quer que eu abra o WhatsApp para você agora?",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, confirmMessage]);
        }, 1000);
      }
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(
      "Olá! Vim através do chat do site e gostaria de saber mais sobre os produtos ABRE AÍ!"
    );
    window.open(`https://wa.me/5511999999999?text=${message}`, "_blank");
    toast.success("Redirecionando para WhatsApp!");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    "Ver Kits de Rolê",
    "Ver Cestas & Presentes",
    "Informações de Entrega",
    "Falar com Atendente",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 hover:scale-110 transition-all relative"
          >
            <MessageCircle className="h-6 w-6" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-6 w-6 p-0 flex items-center justify-center bg-destructive">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <SheetTitle className="text-primary-foreground text-left">
                    Atendimento ABRE AÍ!
                  </SheetTitle>
                  <SheetDescription className="text-primary-foreground/80 text-left text-xs">
                    Online agora
                  </SheetDescription>
                </div>
              </div>
            </div>
          </SheetHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
            {messages.map((message) => (
              <div
                key={message.id}
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
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="h-3 w-3 opacity-60" />
                    <span className="text-xs opacity-60">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>

                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card border rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t bg-background">
              <p className="text-xs text-muted-foreground mb-2">Ações rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="text-xs"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp Button */}
          <div className="px-4 py-2 border-t bg-muted/30">
            <Button
              variant="outline"
              className="w-full"
              onClick={openWhatsApp}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Falar no WhatsApp
            </Button>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputMessage.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChatSupport;