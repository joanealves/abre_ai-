"use client";

import { useEffect, useState } from "react";
import roleeImg from "@/assets/rolee-hero.jpg";
import cestasImg from "@/assets/cestas-hero.jpg";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type Brand = "rolee" | "cestas";

type Kit = {
  id: string;
  title: string;
  image: string;
  description: string;
};

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const ROLEE_IMAGES = [
  "/assets/rolee/rolee-1.jpg",
  "/assets/rolee/rolee-2.jpg",
  "/assets/rolee/rolee-3.jpg",
];

const CESTAS_KITS: Kit[] = [
  {
    id: "amor",
    title: "Cesta Amor",
    image: "/assets/cestas/cesta-amor.jpg",
    description:
      "Uma cesta pensada para momentos especiais. Produtos artesanais, apresentação impecável e emoção real.",
  },
  {
    id: "celebracao",
    title: "Cesta Celebração",
    image: "/assets/cestas/cesta-celebracao.jpg",
    description:
      "Ideal para aniversários e conquistas. Uma experiência elegante do início ao fim.",
  },
  {
    id: "luxo",
    title: "Cesta Luxo",
    image: "/assets/cestas/cesta-luxo.jpg",
    description:
      "Nossa versão mais sofisticada. Impacto visual, qualidade e exclusividade.",
  },
];

/* -------------------------------------------------------------------------- */
/* MAIN                                                                       */
/* -------------------------------------------------------------------------- */

export default function Gallery() {
  const [openBrand, setOpenBrand] = useState<Brand | null>(null);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);

  useEffect(() => {
    document.body.style.overflow =
      openBrand || selectedKit ? "hidden" : "auto";
  }, [openBrand, selectedKit]);

  return (
    <>
      {/* SECTION */}
      <section id="galeria" className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center mb-16">
            Nossas Experiências
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <BrandCard
              image={roleeImg}
              title="Kits de Rolê"
              subtitle="Cervejas artesanais, petiscos premium e clima de boteco em casa."
              label="Rolê"
              theme="rolee"
              onClick={() => setOpenBrand("rolee")}
            />

            <BrandCard
              image={cestasImg}
              title="Cestas Premium"
              subtitle="Presentes artesanais elegantes para surpreender."
              label="Cestas"
              theme="cestas"
              onClick={() => setOpenBrand("cestas")}
            />
          </div>
        </div>
      </section>

      {/* MODAL BRAND */}
      {openBrand && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-6xl max-h-[90vh] bg-background rounded-3xl overflow-hidden">

            {/* HEADER */}
            <div className="sticky top-0 z-10 bg-background px-8 py-6 flex justify-between items-center border-b">
              <h3 className="text-3xl font-serif">
                {openBrand === "rolee" ? "Kits de Rolê" : "Cestas Premium"}
              </h3>

              <button
                onClick={() => setOpenBrand(null)}
                className="text-2xl opacity-60 hover:opacity-100"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <div className="overflow-y-auto">
              {openBrand === "rolee" ? (
                <RoleeGallery />
              ) : (
                <CestasGallery onSelectKit={setSelectedKit} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* DRAWER KIT */}
      {selectedKit && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex justify-end">
          <div className="w-full sm:w-[420px] h-full bg-white p-6 overflow-y-auto">

            <button
              onClick={() => setSelectedKit(null)}
              className="text-xl font-bold mb-6"
            >
              ✕
            </button>

            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6">
              <img
                src={selectedKit.image}
                alt={selectedKit.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-3xl font-serif mb-4">
              {selectedKit.title}
            </h3>

            <p className="opacity-80 leading-relaxed mb-8">
              {selectedKit.description}
            </p>

            <button className="w-full py-4 rounded-full bg-[#6FAF8E] text-white font-medium">
              Quero essa cesta
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENTS                                                                 */
/* -------------------------------------------------------------------------- */

const BrandCard = ({
  image,
  title,
  subtitle,
  label,
  theme,
  onClick,
}: any) => {
  const overlay =
    theme === "rolee"
      ? "from-rolee-dark via-rolee-dark/70"
      : "from-[#2F3E34] via-[#2F3E34]/70";

  const accent =
    theme === "rolee"
      ? "text-rolee-golden border-rolee-golden"
      : "text-[#6FAF8E] border-[#6FAF8E]";

  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition"
    >
      <div
        className="aspect-[3/4] bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url(${image})` }}
      />

      <div className={`absolute inset-0 bg-gradient-to-t ${overlay} to-transparent`} />

      <div className="absolute inset-0 flex items-end justify-center p-8">
        <div className="text-center text-white">
          <span className={`text-sm uppercase tracking-widest ${accent}`}>
            {label}
          </span>
          <h3 className="text-3xl font-serif font-bold mt-2 mb-3">
            {title}
          </h3>
          <p className="opacity-80 mb-6">{subtitle}</p>
          <span className={`px-6 py-3 rounded-full border-2 ${accent}`}>
            Ver kits
          </span>
        </div>
      </div>
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/* GALLERIES                                                                  */
/* -------------------------------------------------------------------------- */

const RoleeGallery = () => (
  <section className="p-10 grid md:grid-cols-2 gap-8">
    {ROLEE_IMAGES.map((img) => (
      <div
        key={img}
        className="aspect-[4/5] rounded-2xl overflow-hidden"
      >
        <img
          src={img}
          className="w-full h-full object-cover hover:scale-105 transition duration-700"
        />
      </div>
    ))}
  </section>
);

const CestasGallery = ({
  onSelectKit,
}: {
  onSelectKit: (kit: Kit) => void;
}) => (
  <section className="p-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {CESTAS_KITS.map((kit) => (
      <div
        key={kit.id}
        className="rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition"
      >
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={kit.image}
            className="w-full h-full object-cover hover:scale-105 transition duration-700"
          />
        </div>

        <div className="p-6 flex flex-col">
          <h4 className="text-2xl font-serif mb-2">{kit.title}</h4>
          <p className="text-sm opacity-80 mb-6">
            {kit.description.slice(0, 80)}…
          </p>

          <button
            onClick={() => onSelectKit(kit)}
            className="mt-auto px-5 py-3 rounded-full border border-[#6FAF8E] hover:bg-[#6FAF8E] hover:text-white transition"
          >
            Ver detalhes
          </button>
        </div>
      </div>
    ))}
  </section>
);
