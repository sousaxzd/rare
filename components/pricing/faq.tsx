'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqItems = [
  {
    question: 'Como faço para comprar o plano?',
    answer:
      'Após criar sua conta, nas configurações do seu usuário, você poderá escolher o plano desejado e finalizar a compra.',
  },
  {
    question: 'Como faço para configurar minha conta após a compra?',
    answer:
      'Automaticamente após a compra, o serviço ficará disponível para configuração no Dashboard. Você poderá acessar todas as funcionalidades e começar a usar imediatamente.',
  },
  {
    question: 'Como faço para renovar o plano?',
    answer:
      'No painel de controle do seu serviço, você verá um botão de faturas. Lá, você poderá ver todas as faturas e renovações. A renovação é automática, mas você pode gerenciar tudo pelo dashboard.',
  },
  {
    question: 'É possível cancelar o plano?',
    answer:
      'Sim, você pode cancelar seu plano a qualquer momento pelo dashboard. O cancelamento será efetivado no final do período pago. Você poderá pedir reembolso caso tenha problemas com o serviço.',
  },
  {
    question: 'Posso fazer upgrade ou downgrade do plano?',
    answer:
      'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento pelo dashboard. As alterações serão aplicadas imediatamente e o valor será ajustado proporcionalmente.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer:
      'Aceitamos PIX para transações instantâneas. Em breve ofereceremos outras formas de pagamento.',
  },
  {
    question: 'Quais são os limites de transações?',
    answer:
      'Cada plano tem limites mínimos diferentes de transações por mês. Veja os limites em cada plano.',
  },
]

export function FAQ() {
  return (
    <section className="mt-16">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-foreground">Perguntas Frequentes</h2>
        <Accordion
          type="single"
          collapsible
          className="bg-foreground/2 p-5 rounded-xl border border-foreground/10"
        >
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-b border-foreground/10 last:border-b-0"
            >
              <AccordionTrigger className="text-foreground/90 text-sm hover:no-underline py-4">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 text-sm pt-0 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

