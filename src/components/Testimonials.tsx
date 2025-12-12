import { Button } from "./ui/button";
import { MessageCircle, Star } from "lucide-react";

const testimonials = [
  {
    name: "Mariana Silva",
    text: "Os kits de Rolê são perfeitos! Transformaram meu fim de semana. Cervejas incríveis e petiscos de qualidade.",
    rating: 5,
    type: "rolee",
  },
  {
    name: "Carlos Eduardo",
    text: "Presenteei minha mãe com uma cesta e ela amou! Produtos selecionados com muito cuidado e carinho.",
    rating: 5,
    type: "cestas",
  },
  {
    name: "Juliana Costa",
    text: "ABRE AÍ! entende do assunto. Qualidade premium, entrega rápida e atendimento nota 10!",
    rating: 5,
    type: "rolee",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 animate-fade-in">
          O Que Nossos Clientes Dizem
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-rolee-golden text-rolee-golden" />
                ))}
              </div>
              <p className="text-card-foreground mb-4 font-outfit leading-relaxed">
                "{testimonial.text}"
              </p>
              <p className="font-serif font-semibold text-foreground">
                — {testimonial.name}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Final */}
        <div className="text-center bg-rolee-dark rounded-3xl p-12 text-white animate-fade-in">
          <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Pronto Para Sua Experiência?
          </h3>
          <p className="text-lg mb-8 opacity-90 font-outfit">
            Escolha entre Rolê ou Cestas e comece a celebrar os melhores momentos.
          </p>
          <Button 
            size="lg" 
            className="bg-rolee-golden hover:bg-rolee-golden/90 text-rolee-dark font-semibold text-lg px-10 py-6 hover:scale-105 transition-transform"
            onClick={() => window.open("https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os kits", "_blank")}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Fale Conosco no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;