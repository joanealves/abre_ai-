import { Package, Users, Star, Heart } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "500+",
    label: "Kits Entregues",
  },
  {
    icon: Users,
    value: "300+",
    label: "Clientes Satisfeitos",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Avaliação Média",
  },
  {
    icon: Heart,
    value: "100%",
    label: "Amor em Cada Detalhe",
  },
];

const Stats = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-cestas-base to-cestas-beige">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-4xl font-serif font-bold text-foreground mb-2">
                {stat.value}
              </h3>
              <p className="text-muted-foreground font-outfit">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;