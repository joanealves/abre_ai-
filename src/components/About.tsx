const About = () => {
  return (
    <section
      id="sobre"
      className="relative py-28 px-4 bg-rolee-dark overflow-hidden"
    >
      {/* detalhe decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-rolee-golden/10 blur-[120px]" />
      </div>

      <div className="relative container mx-auto max-w-5xl">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block mb-4 text-sm uppercase tracking-widest text-rolee-golden">
            Sobre a marca
          </span>

          <h2 className="text-4xl md:text-6xl font-serif font-bold text-rolee-cream leading-tight">
            Momentos simples.
            <br />
            <span className="text-rolee-golden">
              Experiências memoráveis.
            </span>
          </h2>
        </div>

        <div className="grid gap-10 md:gap-12 text-center animate-fade-in">
          <p className="text-lg md:text-xl text-rolee-cream/90 leading-relaxed max-w-3xl mx-auto">
            A <strong>ABRE AÍ!</strong> nasceu da paixão por celebrar do jeito certo:
            em casa, com os amigos, num rolê sem frescura — ou surpreendendo alguém
            especial com um presente que realmente marca.
          </p>

          {/* frase assinatura */}
          <div className="flex justify-center">
            <div className="px-8 py-6 border border-rolee-cream/20 rounded-2xl backdrop-blur-sm bg-rolee-dark/40">
              <p className="text-xl md:text-2xl font-serif text-rolee-cream">
                Feito pra quem ama o bar,
                <br />
                <span className="text-rolee-golden">
                  mas também ama presentear.
                </span>
              </p>
            </div>
          </div>

          <p className="text-base md:text-lg text-rolee-cream/80 leading-relaxed max-w-3xl mx-auto">
            Unimos dois mundos: o clima de boteco em casa <strong>(Rolê)</strong> e a
            sofisticação das cestas artesanais premium <strong>(Cestas)</strong>.
            Cada kit é pensado para criar experiências — seja pra curtir, seja pra
            surpreender.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
