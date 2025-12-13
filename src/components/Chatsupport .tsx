// import { useEffect, useRef, useState } from "react";
// import { MessageCircle, Send, Bot, User } from "lucide-react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Badge } from "./ui/badge";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "./ui/sheet";
// import { Separator } from "./ui/separator";

// interface Message {
//   id: number;
//   sender: "user" | "bot";
//   text: string;
//   suggestions?: string[];
// }

// export default function ChatSupport() {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: 1,
//       sender: "bot",
//       text: "Oi 👋 Quer conhecer nossos kits, rastrear um pedido ou falar com a gente?",
//       suggestions: ["Ver kits", "Rastrear pedido", "Falar no WhatsApp"],
//     },
//   ]);

//   const endRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   function pushBot(text: string, suggestions?: string[]) {
//     setMessages((prev) => [
//       ...prev,
//       { id: prev.length + 1, sender: "bot", text, suggestions },
//     ]);
//   }

//   function pushUser(text: string) {
//     setMessages((prev) => [
//       ...prev,
//       { id: prev.length + 1, sender: "user", text },
//     ]);
//   }

//   function handleSend(custom?: string) {
//     const text = custom ?? input;
//     if (!text.trim()) return;

//     pushUser(text);
//     setInput("");

//     setTimeout(() => handleIntent(text.toLowerCase()), 300);
//   }

//   function handleIntent(text: string) {
//     if (text.includes("kit") || text.includes("produto")) {
//       pushBot(
//         "Temos kits de rolê 🍺 e cestas 🎁 feitos pra presentear ou curtir em casa.",
//         ["Ver kits de rolê", "Ver cestas", "Falar no WhatsApp"]
//       );
//       return;
//     }

//     if (text.includes("rastrear")) {
//       pushBot(
//         "Você pode rastrear seu pedido usando o código que recebeu.",
//         ["Abrir rastreamento", "Falar no WhatsApp"]
//       );
//       return;
//     }

//     if (text.includes("entrega")) {
//       pushBot(
//         "Entregamos em até 48h úteis 🚚 (região metropolitana).",
//         ["Ver kits", "Falar no WhatsApp"]
//       );
//       return;
//     }

//     if (text.includes("pagamento") || text.includes("pix")) {
//       pushBot(
//         "Aceitamos PIX 💸 e cartão 💳 (até 3x sem juros).",
//         ["Ver kits", "Falar no WhatsApp"]
//       );
//       return;
//     }

//     if (text.includes("whatsapp") || text.includes("humano")) {
//       window.open(
//         "https://wa.me/5511999999999?text=Olá! Vim pelo chat do site.",
//         "_blank"
//       );
//       return;
//     }

//     pushBot(
//       "Não entendi 😅 O que você quer fazer agora?",
//       ["Ver kits", "Rastrear pedido", "Falar no WhatsApp"]
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       <Sheet open={open} onOpenChange={setOpen}>
//         <SheetTrigger asChild>
//           <Button className="h-14 w-14 rounded-full shadow-xl relative">
//             <MessageCircle />
//             <Badge className="absolute -top-1 -right-1">1</Badge>
//           </Button>
//         </SheetTrigger>

//         <SheetContent className="flex flex-col p-0">
//           <SheetHeader className="p-4 border-b">
//             <SheetTitle>ABRE AÍ • Atendimento</SheetTitle>
//           </SheetHeader>

//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((m) => (
//               <div
//                 key={m.id}
//                 className={`flex gap-2 ${
//                   m.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {m.sender === "bot" && <Bot className="h-5 w-5" />}
//                 <div
//                   className={`px-4 py-2 rounded-xl text-sm max-w-[75%] ${
//                     m.sender === "user"
//                       ? "bg-primary text-white"
//                       : "bg-muted"
//                   }`}
//                 >
//                   {m.text}
//                 </div>
//                 {m.sender === "user" && <User className="h-5 w-5" />}
//               </div>
//             ))}

//             {messages.at(-1)?.suggestions && (
//               <div className="flex flex-wrap gap-2">
//                 {messages.at(-1)!.suggestions!.map((s) => (
//                   <Button
//                     key={s}
//                     size="sm"
//                     variant="outline"
//                     onClick={() => handleSend(s)}
//                   >
//                     {s}
//                   </Button>
//                 ))}
//               </div>
//             )}

//             <div ref={endRef} />
//           </div>

//           <Separator />

//           <div className="p-4 flex gap-2">
//             <Input
//               placeholder="Digite aqui…"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             />
//             <Button onClick={() => handleSend()}>
//               <Send className="h-4 w-4" />
//             </Button>
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }



import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Bot, User, X, Minimize2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
  suggestions?: string[];
}

// Base de conhecimento FAQ
const FAQ_DATABASE: FAQItem[] = [
  {
    question: "kits produtos",
    answer: "Temos kits de rolê 🍺 (cervejas artesanais + petiscos) e cestas premium 🎁 (produtos artesanais elegantes). Todos montados com muito carinho!",
    suggestions: ["Ver kits de rolê", "Ver cestas", "Falar no WhatsApp"],
  },
  {
    question: "entrega prazo",
    answer: "Entregamos em até 48h úteis 🚚 na região metropolitana. Frete GRÁTIS para compras acima de R$ 200!",
    suggestions: ["Ver produtos", "Calcular frete", "Falar no WhatsApp"],
  },
  {
    question: "pagamento pix cartão",
    answer: "Aceitamos PIX 💸 (com desconto de 5%) e cartão de crédito 💳 em até 3x sem juros!",
    suggestions: ["Ver produtos", "Cupons de desconto", "Falar no WhatsApp"],
  },
  {
    question: "rastrear pedido código",
    answer: "Você pode rastrear seu pedido usando o código que recebeu por email. Clique em 'Rastrear Pedido' no menu!",
    suggestions: ["Abrir rastreamento", "Falar no WhatsApp"],
  },
  {
    question: "cupom desconto promoção",
    answer: "Temos vários cupons disponíveis! 🎉\n\n• PRIMEIRA - 15% na primeira compra\n• ABREAI10 - 10% off\n• ABREAI15 - 15% off\n• ABREAI20 - 20% off\n• FRETEGRATIS - Frete grátis",
    suggestions: ["Ver produtos", "Usar cupom", "Falar no WhatsApp"],
  },
  {
    question: "presente personalizar",
    answer: "Sim! Nossas cestas são perfeitas para presentes. Você pode adicionar uma mensagem personalizada no checkout. Embalagem especial inclusa! 🎁",
    suggestions: ["Ver cestas", "Montar presente", "Falar no WhatsApp"],
  },
  {
    question: "troca devolução",
    answer: "Garantimos a qualidade dos nossos produtos. Se houver algum problema, entre em contato em até 7 dias. Estamos aqui para ajudar! 😊",
    suggestions: ["Política de trocas", "Falar no WhatsApp"],
  },
  {
    question: "horário atendimento",
    answer: "Nosso atendimento funciona:\n📅 Segunda a Sexta: 9h às 18h\n📅 Sábado: 9h às 13h\n\nFora do horário, deixe sua mensagem que responderemos em breve!",
    suggestions: ["Falar no WhatsApp", "Ver produtos"],
  },
];

// Mensagens padrão do bot
const BOT_MESSAGES = {
  welcome: {
    text: "Oi! 👋 Sou o assistente virtual da ABRE AÍ!\n\nComo posso ajudar você hoje?",
    suggestions: [
      "Ver produtos",
      "Rastrear pedido",
      "Cupons de desconto",
      "Falar com atendente",
    ],
  },
  notUnderstood: {
    text: "Hmm, não entendi muito bem 😅\n\nO que você gostaria de fazer?",
    suggestions: [
      "Ver produtos",
      "Rastrear pedido",
      "Formas de pagamento",
      "Falar com atendente",
    ],
  },
  products: {
    text: "Temos dois tipos de produtos incríveis:\n\n🍺 *Kits de Rolê* - Cervejas artesanais + petiscos premium\n🎁 *Cestas Premium* - Produtos artesanais elegantes para presentear\n\nQual te interessa mais?",
    suggestions: ["Ver kits de rolê", "Ver cestas", "Falar com atendente"],
  },
  tracking: {
    text: "Para rastrear seu pedido, você vai precisar do código que enviamos por email.\n\nClique em 'Rastrear Pedido' no menu principal ou me envie seu código aqui!",
    suggestions: ["Abrir rastreamento", "Não recebi o código", "Falar com atendente"],
  },
};

const ChatSupport = () => {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: BOT_MESSAGES.welcome.text,
      timestamp: new Date(),
      suggestions: BOT_MESSAGES.welcome.suggestions,
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus no input quando abrir
  useEffect(() => {
    if (open && !minimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized]);

  // Adiciona mensagem do usuário
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

  // Adiciona mensagem do bot
  const pushBot = (text: string, suggestions?: string[]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "bot",
        text,
        timestamp: new Date(),
        suggestions,
      },
    ]);
  };

  // Simula digitação do bot
  const simulateTyping = (callback: () => void, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  // Busca resposta na base de conhecimento
  const findAnswer = (query: string): FAQItem | null => {
    const lowerQuery = query.toLowerCase();
    
    for (const faq of FAQ_DATABASE) {
      const keywords = faq.question.split(" ");
      const matchCount = keywords.filter((keyword) =>
        lowerQuery.includes(keyword)
      ).length;
      
      if (matchCount >= 1) {
        return faq;
      }
    }
    
    return null;
  };

  // Processa intenção do usuário
  const handleIntent = (text: string) => {
    const lowerText = text.toLowerCase();

    // Busca na base de conhecimento
    const faqAnswer = findAnswer(text);
    if (faqAnswer) {
      simulateTyping(() => {
        pushBot(faqAnswer.answer, faqAnswer.suggestions);
      });
      return;
    }

    // Ações específicas
    if (lowerText.includes("produto") || lowerText.includes("kit")) {
      simulateTyping(() => {
        pushBot(BOT_MESSAGES.products.text, BOT_MESSAGES.products.suggestions);
      });
      return;
    }

    if (lowerText.includes("rastrear") || lowerText.includes("código")) {
      simulateTyping(() => {
        pushBot(BOT_MESSAGES.tracking.text, BOT_MESSAGES.tracking.suggestions);
      });
      return;
    }

    if (
      lowerText.includes("whatsapp") ||
      lowerText.includes("atendente") ||
      lowerText.includes("humano")
    ) {
      simulateTyping(() => {
        pushBot(
          "Redirecionando você para nosso WhatsApp! 📱\n\nUm atendente real vai te ajudar em instantes.",
          []
        );
      });
      setTimeout(() => {
        window.open(
          "https://wa.me/5511999999999?text=Olá! Vim pelo chat do site.",
          "_blank"
        );
      }, 1500);
      return;
    }

    // Saudações
    if (
      lowerText.includes("oi") ||
      lowerText.includes("olá") ||
      lowerText.includes("ola") ||
      lowerText.includes("hey")
    ) {
      simulateTyping(() => {
        pushBot(
          "Olá! 😊 Como posso ajudar você hoje?",
          BOT_MESSAGES.welcome.suggestions
        );
      });
      return;
    }

    // Não entendeu
    simulateTyping(() => {
      pushBot(
        BOT_MESSAGES.notUnderstood.text,
        BOT_MESSAGES.notUnderstood.suggestions
      );
    });
  };

  // Envia mensagem
  const handleSend = (custom?: string) => {
    const text = custom ?? input.trim();
    if (!text) return;

    pushUser(text);
    setInput("");

    setTimeout(() => handleIntent(text), 300);
  };

  // Lida com sugestões
  const handleSuggestion = (suggestion: string) => {
    const suggestionActions: Record<string, () => void> = {
      "Ver produtos": () => {
        pushUser("Ver produtos");
        handleIntent("produtos");
      },
      "Ver kits de rolê": () => {
        pushUser("Ver kits de rolê");
        simulateTyping(() => {
          pushBot(
            "Nossos kits de rolê são perfeitos para curtir em casa! 🍺\n\nAcesse a seção 'Produtos' no site para ver todos os kits disponíveis.",
            ["Ir para produtos", "Falar com atendente"]
          );
        });
      },
      "Ver cestas": () => {
        pushUser("Ver cestas");
        simulateTyping(() => {
          pushBot(
            "Nossas cestas premium são ideais para presentear! 🎁\n\nConfira na seção 'Produtos' todas as opções elegantes que temos.",
            ["Ir para produtos", "Falar com atendente"]
          );
        });
      },
      "Rastrear pedido": () => {
        pushUser("Rastrear pedido");
        handleIntent("rastrear");
      },
      "Abrir rastreamento": () => {
        pushUser("Abrir rastreamento");
        simulateTyping(() => {
          pushBot(
            "Vou te redirecionar para a página de rastreamento! 📦",
            []
          );
        });
        setTimeout(() => {
          document.getElementById("rastreamento-btn")?.click();
          setOpen(false);
        }, 1000);
      },
      "Cupons de desconto": () => {
        pushUser("Cupons de desconto");
        handleIntent("cupom");
      },
      "Falar no WhatsApp": () => {
        handleSend("Falar com atendente");
      },
      "Falar com atendente": () => {
        handleSend("Falar com atendente");
      },
    };

    const action = suggestionActions[suggestion];
    if (action) {
      action();
    } else {
      handleSend(suggestion);
    }
  };

  // Formata timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:w-[400px] p-0 flex flex-col"
      >
        <SheetHeader className="p-4 pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bot className="h-8 w-8 text-primary" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <div>
                <SheetTitle className="text-left">Chat de Suporte</SheetTitle>
                <p className="text-xs text-muted-foreground">
                  Resposta imediata • Online
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setMinimized(!minimized)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {!minimized && (
          <>
            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="flex-shrink-0">
                        <Bot className="h-8 w-8 p-1.5 rounded-full bg-primary/10 text-primary" />
                      </div>
                    )}

                    <div
                      className={`flex flex-col gap-1 max-w-[80%] ${
                        msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground px-2">
                        {formatTime(msg.timestamp)}
                      </span>

                      {/* Sugestões */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => handleSuggestion(suggestion)}
                            >
                              {suggestion}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {msg.sender === "user" && (
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 p-1.5 rounded-full bg-primary text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Indicador de digitação */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <Bot className="h-8 w-8 p-1.5 rounded-full bg-primary/10 text-primary flex-shrink-0" />
                    <div className="bg-muted rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div
                          className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={scrollRef} />
              </div>
            </ScrollArea>

            <Separator />

            {/* Input */}
            <div className="p-4">
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
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Powered by ABRE AÍ! 🍺🎁
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatSupport;