'use client'

export default function Terms() {
  return (
    <main>
      <div className="max-w-2xl mx-auto py-12">
        <p className="text-foreground/90 text-[12px] text-center">Atualizado em {new Date().toLocaleDateString('pt-BR')}</p>
        <h1 className="text-3xl font-bold text-center my-1">Termos de serviço</h1>
        <p className="text-foreground/70 text-sm text-center">Estes Termos de Serviço regem o uso da plataforma Vision Wallet. Ao contratar ou utilizar qualquer serviço, você concorda integralmente com as condições aqui descritas. O descumprimento destes termos pode resultar em suspensão ou cancelamento do acesso aos serviços, sem direito a reembolso.</p>
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
              [1.c] A Vision Wallet reserva o direito de suspender ou encerrar o acesso aos serviços em caso de descumprimento destes Termos ou uso indevido.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">2. Descrição do Serviço</h2>
            <p className="text-foreground/90 text-sm">
              [2.a] A Vision Wallet é uma plataforma de carteira digital que permite gerenciar pagamentos via PIX, Cartão e Criptomoedas.
            </p>
            <p className="text-foreground/90 text-sm">
              [2.b] Oferecemos diferentes planos de serviço com taxas e limites variados conforme descrito em nossa página de preços.
            </p>
            <p className="text-foreground/90 text-sm">
              [2.c] Os serviços são fornecidos exclusivamente através da plataforma Vision Wallet e seus sistemas integrados.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">3. Planos e Taxas</h2>
            <p className="text-foreground/90 text-sm">
              [3.a] Nossos planos são baseados em volume de transações mensais: FREE (até 300 transações/mês - Taxa de R$ 0,70 por transação), CARBON (300-800 transações/mês - Taxa de R$ 0,65 por transação - Mensalidade de R$ 19,90), DIAMOND (800-2.000 transações/mês - Taxa de R$ 0,60 por transação - Mensalidade de R$ 49,90), RICH (3.000-6.000 transações/mês - Taxa de R$ 0,55 por transação - Mensalidade de R$ 149,90), ENTERPRISE (acima de 6.000 transações/mês - Taxa de R$ 0,50 por transação - Mensalidade de R$ 999,97).
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
              [4.a] Você é responsável por manter a segurança de sua conta e API Key.
            </p>
            <p className="text-foreground/90 text-sm">
              [4.b] Você deve fornecer informações precisas e atualizadas durante o cadastro e uso do serviço.
            </p>
            <p className="text-foreground/90 text-sm">
              [4.c] Você se compromete a usar o serviço apenas para fins legais e não realizar atividades fraudulentas ou ilegais.
            </p>
            <p className="text-foreground/90 text-sm">
              [4.d] Você é responsável por manter saldo suficiente para cobrir taxas e mensalidades.
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
              [6.a] Seus dados são protegidos com criptografia de ponta. Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar transações ou conforme exigido por lei.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.b] Consulte nossa Política de Privacidade para mais detalhes sobre o tratamento de dados.
            </p>
            <p className="text-foreground/90 text-sm">
              [6.c] Você é responsável por manter a confidencialidade de suas credenciais de acesso.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">7. Modificações do Serviço</h2>
            <p className="text-foreground/90 text-sm">
              [7.a] Reservamos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer momento, com ou sem aviso prévio.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.b] Alterações significativas serão comunicadas aos usuários com antecedência razoável.
            </p>
            <p className="text-foreground/90 text-sm">
              [7.c] O uso continuado do serviço após modificações implica aceitação das novas condições.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">8. Limitação de Responsabilidade</h2>
            <p className="text-foreground/90 text-sm">
              [8.a] A Vision Wallet não se responsabiliza por perdas ou danos decorrentes do uso ou impossibilidade de uso do serviço, incluindo, mas não limitado a, perdas de dados, lucros ou oportunidades de negócio.
            </p>
            <p className="text-foreground/90 text-sm">
              [8.b] Não nos responsabilizamos por falhas técnicas, interrupções ou indisponibilidade temporária do serviço.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">9. Disposições Finais</h2>
            <p className="text-foreground/90 text-sm">
              [9.a] Estes termos podem ser atualizados periodicamente. O uso continuado do serviço após atualização implica aceitação das novas condições.
            </p>
            <p className="text-foreground/90 text-sm">
              [9.b] Para questões sobre estes termos, entre em contato através do nosso suporte.
            </p>
            <p className="text-foreground/90 text-sm">
              [9.c] Em caso de litígio, as partes elegem o foro da cidade de Peixoto de Azevedo, Mato Grosso, Brasil.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

