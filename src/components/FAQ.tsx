import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Qual é a área de entrega?",
    answer:
      "Realizamos entregas para todo o Brasil. Para Belo Horizonte e região metropolitana, o prazo padrão é de até 48 horas. Em casos de urgência, entre em contato pelo WhatsApp para verificar a disponibilidade de entrega expressa.",
  },
  {
    question: "Quanto tempo leva para receber meu kit?",
    answer:
      "O prazo de entrega varia de acordo com a localidade. Em Belo Horizonte e região metropolitana, entregamos em até 48 horas após a confirmação do pagamento. Para outras cidades e estados, o prazo é informado no momento do atendimento.",
  },
  {
    question: "Como funciona o pagamento?",
    answer:
      "Após escolher seu kit ou personalização, enviamos um link de pagamento diretamente pelo WhatsApp. Assim que o pagamento é confirmado, o pedido é iniciado e seguimos com a preparação e envio.",
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer:
      "Aceitamos pagamento via PIX, cartão de crédito e cartão de débito, todos realizados através do link de pagamento enviado pelo WhatsApp.",
  },
  {
    question: "Posso personalizar meu kit?",
    answer:
      "Sim! Você pode personalizar seu kit escolhendo itens do nosso catálogo. Basta entrar em contato pelo WhatsApp e nossa equipe ajuda a montar a opção ideal para você.",
  },
  {
    question: "Vocês atendem encomendas para eventos?",
    answer:
      "Sim! Atendemos eventos corporativos, aniversários, casamentos e outras celebrações. Para grandes quantidades ou datas específicas, recomendamos entrar em contato com antecedência.",
  },
  {
    question: "E se houver algum problema com o pedido?",
    answer:
      "Caso haja qualquer problema com o seu pedido, pedimos que entre em contato em até 24 horas após o recebimento para que possamos avaliar e realizar a troca, se necessário.",
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