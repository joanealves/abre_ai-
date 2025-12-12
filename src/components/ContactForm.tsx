import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "rolee",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Campos obrigatórios", {
        description: "Por favor, preencha todos os campos obrigatórios.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Email inválido", {
        description: "Por favor, insira um email válido.",
      });
      return;
    }

    const whatsappMessage = `
*Solicitação de Serviço Personalizado*

*Nome:* ${formData.name}
*Email:* ${formData.email}
*Telefone:* ${formData.phone || "Não informado"}
*Serviço:* ${
      formData.service === "rolee"
        ? "🍻 Kits de Rolê"
        : formData.service === "cestas"
        ? "🎁 Cestas & Presentes"
        : "🍻🎁 Ambos"
    }

*Mensagem:*
${formData.message}
    `.trim();

    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");

    toast.success("Redirecionando para WhatsApp", {
      description: "Sua mensagem está pronta para envio!",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      service: "rolee",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="py-24 px-4 bg-cestas-base">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Serviços Personalizados
          </h2>
          <p className="text-lg text-muted-foreground font-outfit">
            Tem algo especial em mente? Conte pra gente e vamos criar uma experiência única para você.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-3xl p-8 md:p-12 shadow-xl animate-fade-in"
        >
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                className="mt-2"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="service">Tipo de Serviço *</Label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-2 rounded-lg border border-input bg-background"
                required
              >
                <option value="rolee">🍻 Kits de Rolê</option>
                <option value="cestas">🎁 Cestas & Presentes</option>
                <option value="ambos">🍻🎁 Ambos</option>
              </select>
            </div>

            <div>
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos sobre seu pedido personalizado..."
                className="mt-2 min-h-[150px]"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6 hover:scale-105 transition-transform"
            >
              <Send className="mr-2 h-5 w-5" />
              Enviar Solicitação
            </Button>

            <p className="text-sm text-muted-foreground text-center">
              * Campos obrigatórios
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
