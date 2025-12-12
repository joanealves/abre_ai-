import { Search, MessageCircle, Package } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Escolha seu kit",
    description: "Navegue entre nossos kits de Rolê ou Cestas premium e escolha o que combina com você.",
  },
  {
    icon: MessageCircle,
    title: "Peça pelo WhatsApp",
    description: "Entre em contato conosco pelo WhatsApp. Nosso time está pronto para ajudar!",
  },
  {
    icon: Package,
    title: "Receba em casa",
    description: "Seu kit chega em casa, pronto para abrir e aproveitar. É só curtir!",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 px-4 bg-gradient-to-br from-cestas-base to-cestas-beige">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-4 animate-fade-in">
          Como Funciona
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg animate-fade-in">
          Simples, rápido e sem complicação
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center group animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif font-bold text-xl">
                {index + 1}
              </div>
              <h3 className="text-2xl font-serif font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground font-outfit leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;