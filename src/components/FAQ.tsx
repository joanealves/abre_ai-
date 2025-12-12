import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Qual é a área de entrega?",
    answer: "Entregamos em toda a região metropolitana. Entre em contato pelo WhatsApp para confirmar se atendemos seu endereço!",
  },
  {
    question: "Quanto tempo leva para receber meu kit?",
    answer: "Normalmente entregamos em até 48 horas úteis após a confirmação do pedido. Para ocasiões especiais, podemos agendar a entrega no dia desejado.",
  },
  {
    question: "Posso personalizar meu kit?",
    answer: "Sim! Você pode escolher itens do nosso catálogo e criar um combo totalmente personalizado. Entre em contato conosco pelo WhatsApp para montar seu kit ideal.",
  },
  {
    question: "Vocês aceitam encomendas para eventos?",
    answer: "Sim! Atendemos eventos corporativos, aniversários, casamentos e outras celebrações. Entre em contato para fazer um orçamento personalizado.",
  },
  {
    question: "Como funciona o pagamento?",
    answer: "Aceitamos PIX, cartão de crédito e débito. O pagamento é feito no momento da confirmação do pedido pelo WhatsApp.",
  },
  {
    question: "Posso trocar produtos que não gostei?",
    answer: "Sim! Se houver algum problema com os produtos, entre em contato em até 24 horas após o recebimento e faremos a troca.",
  },
];

const FAQ = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground">
            Tudo que você precisa saber sobre nossos kits e serviços
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full animate-fade-in">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-outfit text-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-outfit">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;