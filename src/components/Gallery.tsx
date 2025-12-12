import { Beer, Gift } from "lucide-react";
import roleeImg from "@/assets/rolee-hero.jpg";
import cestasImg from "@/assets/cestas-hero.jpg";

const Gallery = () => {
  return (
    <section id="galeria" className="py-24 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16 animate-fade-in">
          Nossas Experiências
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Rolê Card */}
          <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-left">
            <div
              className="aspect-square overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${roleeImg})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-rolee-dark via-rolee-dark/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-rolee-cream">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-0.5 bg-rolee-golden" />
                <span className="text-rolee-golden font-outfit text-sm tracking-wider uppercase">
                  Rolê
                </span>
              </div>
              <h3 className="text-3xl font-serif font-bold mb-3">
                Kits de Rolê
              </h3>
              <p className="text-rolee-cream/80 font-outfit">
                Cervejas artesanais, petiscos premium e aquele clima de boteco que
                só ABRE AÍ! traz pra sua casa.
              </p>
            </div>
          </div>

          {/* Cestas Card */}
          <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-right">
            <div
              className="aspect-square overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${cestasImg})` }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-cestas-taupe via-cestas-taupe/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-cestas-base">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-12 h-0.5 bg-cestas-rose" />
                <span className="text-cestas-rose font-outfit text-sm tracking-wider uppercase">
                  Cestas
                </span>
              </div>
              <h3 className="text-3xl font-serif font-bold mb-3">
                Cestas & Presentes
              </h3>
              <p className="text-cestas-base/90 font-outfit">
                Presentes elegantes e artesanais para surpreender com carinho
                e sofisticação em qualquer ocasião.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
