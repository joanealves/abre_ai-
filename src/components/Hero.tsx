import { useState } from "react";
import { Button } from "./ui/button";
import { Beer, Gift } from "lucide-react";

const Hero = () => {
  const [hoveredSide, setHoveredSide] = useState<"rolee" | "cestas" | null>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Split Background */}
      <div className="absolute inset-0 flex">
        <div 
          className={`relative w-1/2 transition-all duration-700 bg-rolee-dark ${
            hoveredSide === "rolee" ? "w-3/5" : hoveredSide === "cestas" ? "w-2/5" : "w-1/2"
          }`}
        >
          <div className="absolute inset-0 bg-rolee-dark/60" />
        </div>
        <div 
          className={`relative w-1/2 transition-all duration-700 bg-cestas-base ${
            hoveredSide === "cestas" ? "w-3/5" : hoveredSide === "rolee" ? "w-2/5" : "w-1/2"
          }`}
        >
          <div className="absolute inset-0 bg-cestas-base/40" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-sm md:text-base font-outfit tracking-widest uppercase mb-4 text-white mix-blend-difference animate-fade-in">
          O rolê começa em casa
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 text-white mix-blend-difference animate-fade-in">
          ABRE AÍ!
        </h1>
        <p className="text-lg md:text-xl font-outfit mb-12 text-white mix-blend-difference animate-fade-in">
          Cestas & Boteco Experience
        </p>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <Button
            size="lg"
            className="group bg-rolee-dark hover:bg-rolee-dark/90 text-rolee-golden border-2 border-rolee-golden hover:shadow-lg hover:shadow-rolee-golden/50 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 animate-fade-in-left"
            onMouseEnter={() => setHoveredSide("rolee")}
            onMouseLeave={() => setHoveredSide(null)}
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Beer className="mr-2 h-5 w-5 group-hover:animate-glow" />
            Kits de Rolê
          </Button>

          <Button
            size="lg"
            className="group bg-cestas-base hover:bg-cestas-base/90 text-cestas-sage border-2 border-cestas-sage hover:shadow-lg hover:shadow-cestas-sage/50 transition-all duration-300 hover:scale-105 text-lg px-8 py-6 animate-fade-in-right"
            onMouseEnter={() => setHoveredSide("cestas")}
            onMouseLeave={() => setHoveredSide(null)}
            onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Gift className="mr-2 h-5 w-5 group-hover:animate-glow" />
            Cestas & Presentes
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;