'use client'

export default function Terms() {
  return (
    <main>
      <div className="max-w-2xl mx-auto py-12">
        <p className="text-foreground/90 text-[12px] text-center">Atualizado em {new Date().toLocaleDateString('pt-BR')}</p>
        <h1 className="text-3xl font-bold text-center my-1">Termos de serviço</h1>
        <p className="text-foreground/70 text-sm text-center">Estes Termos de Serviço regem o uso da plataforma Vision Wallet. Ao contratar ou utilizar qualquer serviço, você concorda integralmente com as condições aqui descritas. A Vision Wallet respeita o anonimato dos usuários e não bloqueia contas, exceto mediante ordem judicial ou determinação legal expressa.</p>
        <hr className="border-foreground/10 my-5" />

        <div className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">1. Aceitação dos Termos</h2>
            <p className="text-foreground/90 text-sm">
              [1.a] Ao acessar e usar a Vision Wallet, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
            </p>
            <p className="text-foreground/90 text-sm">
              [1.b] Se você não concorda com alguma parte destes termos, não deve usar nosso serviço.
            </p>
            <p className="text-foreground/90 text-sm">
              [1.c] A Vision Wallet reserva o direito de suspender ou encerrar o acesso aos serviços apenas mediante ordem judicial ou determinação legal expressa, respeitando o princípio da presunção de inocência.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">2. Descrição do Serviço</h2>
            <p className="text-foreground/90 text-sm">
              [2.a] A Vision Wallet é uma gateway de pagamentos (provedor de serviços de pagamento) que oferece soluções completas para processamento de transações financeiras, permitindo que empresas e desenvolvedores integrem pagamentos via PIX, Cartão de Crédito/Débito e Criptomoedas em suas aplicações e plataformas.
            </p>
            <p className="text-foreground/90 text-sm">
              [2.b] Como gateway de pagamentos, fornecemos infraestrutura tecnológica segura para recebimento, processamento e gestão de transações financeiras, incluindo APIs, webhooks e ferramentas de gestão de pagamentos.
            </p>
            <p className="text-foreground/90 text-sm">
              [2.c] Oferecemos diferentes planos de serviço com taxas e limites variados conforme descrito em nossa página de preços, adaptados às necessidades de cada tipo de negócio.
            </p>
            <p className="text-foreground/90 text-sm">
              [2.d] Os serviços são fornecidos exclusivamente através da plataforma Vision Wallet e seus sistemas integrados, garantindo segurança, conformidade regulatória e rastreabilidade de todas as transações.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">3. Planos e Taxas</h2>
            <p className="text-foreground/90 text-sm">
              [3.a] Nossos planos são baseados em volume de transações mensais: FREE (até 300 transações/mês - Taxa de R$ 0,70 por transação), CARBON (300-800 transações/mês - Taxa de R$ 0,65 por transação - Mensalidade de R$ 19,97), DIAMOND (800-2.000 transações/mês - Taxa de R$ 0,60 por transação - Mensalidade de R$ 49,97), RICH (3.000-6.000 transações/mês - Taxa de R$ 0,55 por transação - Mensalidade de R$ 149,97), ENTERPRISE (acima de 6.000 transações/mês - Taxa de R$ 0,50 por transação - Mensalidade de R$ 999,97).
            </p>
            <p className="text-foreground/90 text-sm">
              [3.b] Os planos são renovados automaticamente a cada 30 dias. Upgrades e downgrades são aplicados automaticamente com base no volume de transações do mês anterior.
            </p>
            <p className="text-foreground/90 text-sm">
              [3.c] As taxas e mensalidades podem ser alteradas mediante aviso prévio de 30 dias.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">4. Responsabilidades do Usuário</h2>
            <p className="text-foreground/90 text-sm">
              [4.a] Você é responsável por manter a segurança de sua conta e API Key, não compartilhando credenciais de acesso com terceiros não autorizados.
            </p>
            <p className="text-foreground/90 text-sm">
              [4.b] Você se compromete expressamente a usar o serviço APENAS para fins legais e lícitos, sendo expressamente PROIBIDO utilizar a plataforma para qualquer atividade ilegal, fraudulenta, criminosa ou que viole leis brasileiras ou internacionais, incluindo, mas não limitado a: lavagem de dinheiro, financiamento ao terrorismo, tráfico de drogas, prostituição, jogos de azar não regulamentados, pirataria, violação de direitos autorais, estelionato, extorsão, ou qualquer outra atividade ilícita.
            </p>
            <p className="text-foreground/90 text-sm">
              [4.c] Você é responsável por manter saldo suficiente para cobrir taxas e mensalidades, bem como garantir que todas as transações processadas através da plataforma sejam legítimas e estejam em conformidade com a legislação aplicável.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">5. Limites e Restrições</h2>
            <p className="text-foreground/90 text-sm">
              [5.a] Cada plano possui limites de transações mensais. Exceder esses limites pode resultar em upgrade automático ou restrições temporárias até a renovação do plano.
            </p>
            <p className="text-foreground/90 text-sm">
              [5.b] Valores mínimos e máximos por transação podem ser aplicados conforme a política de cada método de pagamento.
            </p>
            <p className="text-foreground/90 text-sm">
              [5.c] A Vision Wallet reserva o direito de impor limites adicionais conforme necessário para segurança e estabilidade do serviço.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">6. Privacidade e Segurança</h2>
            <p className="text-foreground/90 text-sm">
              [6.a] A Vision Wallet está comprometida com a proteção da privacidade e segurança dos dados dos usuários, utilizando criptografia de ponta (SSL/TLS) e seguindo as melhores práticas de segurança da informação e conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
            </p>
            <p className="text-foreground/90 text-sm">
              [6.b] Coletamos e processamos apenas os dados estritamente necessários para a prestação dos serviços de gateway de pagamentos, incluindo: dados cadastrais básicos, informações de transações e informações de conta bancária quando necessário para processamento de pagamentos. A Vision Wallet respeita o anonimato dos usuários e não solicita documentos de identificação pessoal.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.c] Não compartilhamos suas informações com terceiros, exceto: (i) quando necessário para processar transações através de nossos parceiros de pagamento autorizados; (ii) quando exigido por ordem judicial ou determinação legal expressa; (iii) com seu consentimento expresso.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.d] Mantemos registros de transações conforme exigido pela legislação brasileira, podendo compartilhar essas informações apenas mediante ordem judicial ou determinação legal expressa.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.e] Você possui direitos garantidos pela LGPD, incluindo acesso, correção, exclusão, portabilidade e oposição ao tratamento de seus dados pessoais. Para exercer esses direitos, entre em contato através do nosso suporte.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.f] Consulte nossa Política de Privacidade para mais detalhes sobre o tratamento de dados, retenção de informações e seus direitos como titular de dados.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.g] Você é responsável por manter a confidencialidade de suas credenciais de acesso e notificar imediatamente a Vision Wallet em caso de uso não autorizado de sua conta.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">7. Prevenção à Lavagem de Dinheiro e Bloqueio de Contas</h2>
            <p className="text-foreground/90 text-sm">
              [7.a] A Vision Wallet está sujeita e em conformidade com a legislação brasileira de prevenção à lavagem de dinheiro (Lei nº 9.613/1998 e suas alterações) e prevenção ao financiamento ao terrorismo, bem como regulamentações do Banco Central do Brasil e demais órgãos reguladores competentes.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.b] Você é responsável por garantir que todas as transações processadas através da plataforma sejam legítimas e estejam relacionadas a atividades comerciais lícitas, não podendo utilizar a Vision Wallet para ocultar, dissimular ou legitimar recursos provenientes de atividades criminosas.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.c] A Vision Wallet NÃO bloqueia, suspende ou encerra contas de usuários, exceto quando houver determinação expressa da justiça ou ordem judicial válida que determine tal medida. Respeitamos o princípio da presunção de inocência e não realizamos bloqueios preventivos ou baseados em suspeitas.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.d] Em caso de ordem judicial ou determinação legal expressa, a Vision Wallet cumprirá integralmente a determinação, podendo bloquear contas, suspender transações ou fornecer informações às autoridades competentes conforme exigido pela ordem judicial.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.e] Todas as transações acima de valores estabelecidos pela legislação serão reportadas automaticamente aos órgãos competentes, conforme exigido pela regulamentação brasileira, mas isso não implica em bloqueio automático de contas.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.f] A Vision Wallet não se responsabiliza por bloqueios ou restrições impostas por instituições financeiras parceiras ou por autoridades reguladoras, sendo essas medidas independentes de nossa plataforma.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">8. Modificações do Serviço</h2>
            <p className="text-foreground/90 text-sm">
              [8.a] Reservamos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento, com ou sem aviso prévio.
            </p>
            <p className="text-foreground/90 text-sm">
              [8.b] Alterações significativas serão comunicadas aos usuários com antecedência razoável.
            </p>
            <p className="text-foreground/90 text-sm">
              [8.c] O uso continuado do serviço após modificações implica aceitação das novas condições.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">9. Limitação de Responsabilidade</h2>
            <p className="text-foreground/90 text-sm">
              [9.a] A Vision Wallet não se responsabiliza por perdas ou danos decorrentes do uso ou impossibilidade de uso do serviço, incluindo, mas não limitado a, perdas de dados, lucros ou oportunidades de negócio.
            </p>
            <p className="text-foreground/90 text-sm">
              [9.b] Não nos responsabilizamos por falhas técnicas, interrupções ou indisponibilidade temporária do serviço.
            </p>
            <p className="text-foreground/90 text-sm">
              [9.c] A Vision Wallet não se responsabiliza por transações realizadas por usuários que violem estes termos ou a legislação aplicável, incluindo transações relacionadas a atividades ilícitas ou lavagem de dinheiro.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">10. Disposições Finais</h2>
            <p className="text-foreground/90 text-sm">
              [10.a] Estes termos podem ser atualizados periodicamente. O uso continuado do serviço após atualização implica aceitação das novas condições.
            </p>
            <p className="text-foreground/90 text-sm">
              [10.b] Para questões sobre estes termos, entre em contato através do nosso suporte.
            </p>
            <p className="text-foreground/90 text-sm">
              [10.c] Em caso de litígio, as partes elegem o foro da cidade de Peixoto de Azevedo, Mato Grosso, Brasil.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

