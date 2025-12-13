import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Bot, User } from "lucide-react";
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

interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  suggestions?: string[];
}

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Oi 👋 Quer conhecer nossos kits, rastrear um pedido ou falar com a gente?",
      suggestions: ["Ver kits", "Rastrear pedido", "Falar no WhatsApp"],
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function pushBot(text: string, suggestions?: string[]) {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "bot", text, suggestions },
    ]);
  }

  function pushUser(text: string) {
    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "user", text },
    ]);
  }

  function handleSend(custom?: string) {
    const text = custom ?? input;
    if (!text.trim()) return;

    pushUser(text);
    setInput("");

    setTimeout(() => handleIntent(text.toLowerCase()), 300);
  }

  function handleIntent(text: string) {
    if (text.includes("kit") || text.includes("produto")) {
      pushBot(
        "Temos kits de rolê 🍺 e cestas 🎁 feitos pra presentear ou curtir em casa.",
        ["Ver kits de rolê", "Ver cestas", "Falar no WhatsApp"]
      );
      return;
    }

    if (text.includes("rastrear")) {
      pushBot(
        "Você pode rastrear seu pedido usando o código que recebeu.",
        ["Abrir rastreamento", "Falar no WhatsApp"]
      );
      return;
    }

    if (text.includes("entrega")) {
      pushBot(
        "Entregamos em até 48h úteis 🚚 (região metropolitana).",
        ["Ver kits", "Falar no WhatsApp"]
      );
      return;
    }

    if (text.includes("pagamento") || text.includes("pix")) {
      pushBot(
        "Aceitamos PIX 💸 e cartão 💳 (até 3x sem juros).",
        ["Ver kits", "Falar no WhatsApp"]
      );
      return;
    }

    if (text.includes("whatsapp") || text.includes("humano")) {
      window.open(
        "https://wa.me/5511999999999?text=Olá! Vim pelo chat do site.",
        "_blank"
      );
      return;
    }

    pushBot(
      "Não entendi 😅 O que você quer fazer agora?",
      ["Ver kits", "Rastrear pedido", "Falar no WhatsApp"]
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="h-14 w-14 rounded-full shadow-xl relative">
            <MessageCircle />
            <Badge className="absolute -top-1 -right-1">1</Badge>
          </Button>
        </SheetTrigger>

        <SheetContent className="flex flex-col p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>ABRE AÍ • Atendimento</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && <Bot className="h-5 w-5" />}
                <div
                  className={`px-4 py-2 rounded-xl text-sm max-w-[75%] ${
                    m.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-muted"
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === "user" && <User className="h-5 w-5" />}
              </div>
            ))}

            {messages.at(-1)?.suggestions && (
              <div className="flex flex-wrap gap-2">
                {messages.at(-1)!.suggestions!.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            )}

            <div ref={endRef} />
          </div>

          <Separator />

          <div className="p-4 flex gap-2">
            <Input
              placeholder="Digite aqui…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={() => handleSend()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
