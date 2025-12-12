import { Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-rolee-dark text-rolee-cream py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4 text-cestas-sage">
              ABRE AÍ!
            </h3>
            <p className="text-rolee-cream/80 font-outfit">
              Cestas & Boteco Experience
            </p>
            <p className="text-rolee-cream/60 text-sm mt-2 font-outfit">
              O rolê começa em casa.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4 text-cestas-sage">
              Links Rápidos
            </h4>
            <ul className="space-y-2 font-outfit">
              <li>
                <a
                  href="#sobre"
                  className="text-rolee-cream/80 hover:text-rolee-golden transition-colors"
                >
                  Sobre
                </a>
              </li>
              <li>
                <a
                  href="#galeria"
                  className="text-rolee-cream/80 hover:text-rolee-golden transition-colors"
                >
                  Galeria
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="text-rolee-cream/80 hover:text-rolee-golden transition-colors"
                >
                  Como Funciona
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold mb-4 text-cestas-sage">
              Redes Sociais
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-rolee-cream/10 hover:bg-rolee-golden/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-rolee-cream/10 hover:bg-rolee-golden/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="#"
                className="w-10 h-10 rounded-full bg-rolee-cream/10 hover:bg-rolee-golden/20 flex items-center justify-center transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-rolee-cream/20 pt-8 text-center text-rolee-cream/60 text-sm font-outfit">
          <p>
            &copy; {new Date().getFullYear()} ABRE AÍ! Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
