const About = () => {
  return (
    <section 
      id="sobre" 
      className="py-24 px-4 bg-rolee-dark"
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-rolee-cream animate-fade-in">
          Sobre a Marca
        </h2>
        <p className="text-lg md:text-xl text-rolee-cream/90 mb-8 leading-relaxed animate-fade-in">
          ABRE AÍ! nasceu da paixão por momentos únicos. Somos uma marca que entende 
          que celebrar pode ser em casa, com os amigos, num rolê descontraído — ou 
          pode ser presentear alguém especial com carinho e sofisticação.
        </p>
        <p className="text-lg md:text-xl text-rolee-cream mb-8 leading-relaxed animate-fade-in">
          <strong className="font-serif">Feito pra quem ama o bar, mas também ama presentear.</strong>
        </p>
        <p className="text-base md:text-lg text-rolee-cream/80 leading-relaxed animate-fade-in">
          Combinamos dois universos: o clima de boteco em casa (Rolê) e a elegância 
          de cestas artesanais premium (Cestas). Cada kit é pensado para criar 
          experiências memoráveis, seja para você curtir, seja para surpreender quem 
          você ama.
        </p>
      </div>
    </section>
  );
};

export default About;