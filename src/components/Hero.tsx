"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Beer, Gift } from "lucide-react";

import roleeHero from "@/assets/rolee-hero.jpg";
import cestasHero from "@/assets/cestas-hero.jpg";

const Hero = () => {
  const [hoveredSide, setHoveredSide] = useState<"rolee" | "cestas" | null>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Split Background */}
      <div className="absolute inset-0 flex">
        {/* ROLEE */}
        <div
          className={`
            relative transition-all duration-700 ease-in-out
            ${
              hoveredSide === "rolee"
                ? "w-3/5"
                : hoveredSide === "cestas"
                ? "w-2/5"
                : "w-1/2"
            }
          `}
          style={{
            backgroundImage: `url(${roleeHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
        </div>

        {/* CESTAS */}
        <div
          className={`
            relative transition-all duration-700 ease-in-out
            ${
              hoveredSide === "cestas"
                ? "w-3/5"
                : hoveredSide === "rolee"
                ? "w-2/5"
                : "w-1/2"
            }
          `}
          style={{
            backgroundImage: `url(${cestasHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-black/75 via-black/55 to-black/35" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 w-full flex justify-center">
        <div
          className="
            max-w-4xl w-full text-center
            rounded-2xl
            bg-black/35
            backdrop-blur-md
            border border-white/10
            px-6 md:px-10 py-10 md:py-12
          "
        >
          <p className="text-sm md:text-base font-outfit tracking-widest uppercase mb-4 text-white/90 animate-fade-in">
            O rolê começa em casa
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-4 text-white animate-fade-in">
            ABRE AÍ!
          </h1>

          <p className="text-lg md:text-xl font-outfit mb-12 text-white/90 animate-fade-in">
            Cestas e experiências pensadas pra abrir, brindar e curtir sem complicação
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            {/* ROLEE BUTTON */}
            <Button
              size="lg"
              className="
                group
                bg-transparent
                border-2 border-rolee-golden
                text-rolee-golden
                px-8 py-6
                transition-all
                hover:bg-rolee-golden/10
                hover:shadow-[0_0_20px_rgba(255,215,120,0.35)]
                hover:scale-105
              "
              onMouseEnter={() => setHoveredSide("rolee")}
              onMouseLeave={() => setHoveredSide(null)}
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Beer className="mr-2 h-5 w-5" />
              Kits de Rolê
            </Button>

            {/* CESTAS BUTTON */}
            <Button
              size="lg"
              className="
                group
                bg-transparent
                border-2 border-cestas-sage
                text-cestas-sage
                px-8 py-6
                transition-all
                hover:bg-cestas-sage/10
                hover:shadow-[0_0_20px_rgba(140,180,160,0.35)]
                hover:scale-105
              "
              onMouseEnter={() => setHoveredSide("cestas")}
              onMouseLeave={() => setHoveredSide(null)}
              onClick={() =>
                document
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <Gift className="mr-2 h-5 w-5" />
              Cestas & Presentes
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
