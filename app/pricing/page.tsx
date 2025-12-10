'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faFire, faStar, faBuilding, faGem, faRocket, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FAQ } from '@/components/pricing/faq'
import { AvailablePlan, getMyPlan } from '@/lib/user-plan'
import { RippleButton } from '@/components/ripple-button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuth } from '@/hooks/useAuth'

export default function Pricing() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [plans, setPlans] = useState<AvailablePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
    if (isAuthenticated && user) {
      loadCurrentPlan()
    }
  }, [isAuthenticated, user])

  const loadPlans = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/v1/user/plan/list`)

      if (!response.ok) {
        throw new Error(`Erro ao carregar planos: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        const formattedPlans = Object.values(data.data.plans).map((plan: any) => ({
          id: (plan.id || plan.name || '').toUpperCase(),
          name: plan.name,
          transactionFee: plan.transactionFee,
          transactionFeeInReais: (plan.transactionFee / 100).toFixed(2),
          monthlyFee: plan.monthlyFee,
          monthlyFeeInReais: (plan.monthlyFee / 100).toFixed(2),
          minTransactions: plan.minTransactions || 0,
          maxTransactions: plan.maxTransactions === Infinity || plan.maxTransactions === null ? null : plan.maxTransactions,
          downgradeTo: plan.downgradeTo || null,
          order: plan.order || 0,
        }))
        // Sort by monthly fee
        formattedPlans.sort((a: any, b: any) => a.monthlyFee - b.monthlyFee)
        setPlans(formattedPlans)
      }
    } catch (error) {
      console.error('Erro ao carregar planos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentPlan = async () => {
    try {
      const response = await getMyPlan()
      if (response.success && response.data.currentPlan) {
        // Usar id ou name, normalizando para uppercase
        const planId = (response.data.currentPlan.id || response.data.currentPlan.name || '').toUpperCase()
        setCurrentPlanId(planId)
      }
    } catch (error) {
      console.error('Erro ao carregar plano atual:', error)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)
  }

  const getPlanIcon = (planId: string) => {
    switch (planId.toUpperCase()) {
      case 'FREE': return faStar
      case 'CARBON': return faFire
      case 'DIAMOND': return faGem
      case 'RICH': return faRocket
      case 'ENTERPRISE': return faBuilding
      default: return faCheck
    }
  }

  const getPlanColor = (planId: string) => {
    switch (planId.toUpperCase()) {
      case 'FREE': return 'text-blue-400'
      case 'CARBON': return 'text-orange-500'
      case 'DIAMOND': return 'text-cyan-400'
      case 'RICH': return 'text-purple-500'
      case 'ENTERPRISE': return 'text-emerald-500'
      default: return 'text-foreground'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const allPlans = plans

  // Função para determinar o estado do botão do plano
  const getPlanButtonState = (plan: AvailablePlan) => {
    if (!isAuthenticated || !currentPlanId) {
      return { disabled: false, text: 'Escolher' }
    }

    // Comparação case-insensitive
    const planIdUpper = plan.id.toUpperCase()
    const currentPlanIdUpper = currentPlanId.toUpperCase()

    const currentPlan = allPlans.find(p => p.id.toUpperCase() === currentPlanIdUpper)
    if (!currentPlan) {
      return { disabled: false, text: 'Escolher' }
    }

    // Se é o plano atual
    if (planIdUpper === currentPlanIdUpper) {
      return { disabled: true, text: 'Atual' }
    }

    // Se é um plano anterior (menor monthlyFee)
    if (plan.monthlyFee < currentPlan.monthlyFee) {
      return { disabled: true, text: 'Downgrade' }
    }

    // Se é um plano superior, pode fazer upgrade
    return { disabled: false, text: 'Escolher' }
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Compare os Planos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-foreground/60 max-w-2xl mx-auto"
          >
            Encontre o plano ideal para o volume do seu negócio.
          </motion.p>
        </div>

        {/* Pricing Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto pb-8"
        >
          <div className="min-w-[800px]">
            {/* Header Row */}
            <div className="grid grid-cols-6 divide-x divide-foreground/10 border-b border-foreground/10">
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground/50 uppercase tracking-wider">Planos</span>
                  <p className="text-xs text-foreground/60 mt-1 max-w-[180px]">
                    Analise os recursos e escolha o plano ideal para impulsionar o seu negócio com segurança e eficiência.
                  </p>
                </div>
                <span className="text-lg font-bold text-foreground">Recursos</span>
              </div>
              {allPlans.map((plan) => (
                <div key={plan.id} className="p-6 flex flex-col items-center text-center gap-4 relative">
                  {plan.id.toUpperCase() === 'CARBON' && (
                    <div className="absolute top-0 inset-x-0 h-1 bg-primary rounded-b-full" />
                  )}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-foreground/5 ${getPlanColor(plan.id)}`}>
                    <FontAwesomeIcon icon={getPlanIcon(plan.id)} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{plan.name}</h3>
                    <div className="mt-2 h-12 flex flex-col items-center justify-center gap-0">
                      <span className="text-xl font-bold">
                        {plan.monthlyFee === 0 ? 'Grátis' : formatCurrency(plan.monthlyFee)}
                      </span>
                      {plan.monthlyFee === 0 ? (
                        <span className="text-[10px] text-foreground/50">Ilimitado</span>
                      ) : (
                        <span className="text-[10px] text-foreground/50">/mês</span>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const buttonState = getPlanButtonState(plan)
                    return (
                      <RippleButton
                        onClick={() => !buttonState.disabled && router.push('/dashboard/settings')}
                        disabled={buttonState.disabled}
                        className={`w-full py-2 rounded-lg text-xs font-medium ${buttonState.disabled
                          ? 'bg-foreground/5 text-foreground/40 cursor-not-allowed'
                          : plan.id.toUpperCase() === 'CARBON'
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-foreground/10 text-foreground hover:bg-foreground/20'
                          }`}
                      >
                        {buttonState.text}
                      </RippleButton>
                    )
                  })()}
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            <div className="divide-y divide-foreground/10 border-b border-foreground/10">
              {/* Taxas */}
              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center gap-2 text-sm font-medium text-foreground/80">
                  Taxa por Transação
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 text-foreground/40" />
                      </TooltipTrigger>
                      <TooltipContent>Valor cobrado por cada transação aprovada</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center text-sm font-bold text-foreground">
                    {formatCurrency(plan.transactionFee)}
                  </div>
                ))}
              </div>

              {/* Volume Mínimo */}
              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center gap-2 text-sm font-medium text-foreground/80">
                  Volume Mínimo
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FontAwesomeIcon icon={faInfoCircle} className="w-3 h-3 text-foreground/40" />
                      </TooltipTrigger>
                      <TooltipContent>Quantidade mínima de transações para manter o plano</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center text-sm text-foreground/70">
                    {plan.minTransactions === 0 ? 'Sem mínimo' : `${plan.minTransactions?.toLocaleString('pt-BR')} transações/mês`}
                  </div>
                ))}
              </div>

              {/* Volume Máximo */}
              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center gap-2 text-sm font-medium text-foreground/80">
                  Capacidade Sugerida
                </div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center text-sm text-foreground/70">
                    {plan.maxTransactions ? `${plan.maxTransactions.toLocaleString('pt-BR')} transações/mês` : 'Ilimitado'}
                  </div>
                ))}
              </div>

              {/* Features Booleanas (Simuladas para visual) */}
              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center text-sm font-medium text-foreground/80">Dashboard Completo</div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center text-sm font-medium text-foreground/80">API de Pagamentos</div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center text-sm font-medium text-foreground/80">Webhooks em Tempo Real</div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center text-sm font-medium text-foreground/80">Suporte Prioritário</div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center">
                    {['FREE'].includes(plan.id.toUpperCase()) ? (
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-foreground/20" />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-6 divide-x divide-foreground/10 hover:bg-foreground/2 transition-colors">
                <div className="p-4 flex items-center text-sm font-medium text-foreground/80">Gerente de Contas</div>
                {allPlans.map((plan) => (
                  <div key={plan.id} className="p-4 flex items-center justify-center">
                    {plan.id.toUpperCase() === 'ENTERPRISE' ? (
                      <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-foreground/20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <FAQ />
      </div>
    </div>
  )
}
