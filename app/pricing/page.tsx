'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faFire } from '@fortawesome/free-solid-svg-icons'
import { FAQ } from '@/components/pricing/faq'
import { getAvailablePlans, AvailablePlan } from '@/lib/user-plan'

export default function Pricing() {
  const [plans, setPlans] = useState<AvailablePlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      // Usar a rota pública de planos com timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}/api/v1/user/plan/list`, {
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Erro ao carregar planos: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.success) {
        // Converter os planos para o formato esperado
        const formattedPlans = Object.values(data.data.plans).map((plan: any) => ({
          id: plan.id || plan.name,
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
        setPlans(formattedPlans)
      }
    } catch (error) {
      // Tratar erros de conexão/rede
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.warn('Timeout ao carregar planos')
        } else if (
          error.message.includes('Failed to fetch') ||
          error.message.includes('NetworkError') ||
          error.message.includes('ECONNREFUSED')
        ) {
          console.warn('Servidor indisponível ao carregar planos')
        } else {
          console.error('Erro ao carregar planos:', error)
        }
      } else {
        console.error('Erro desconhecido ao carregar planos:', error)
      }
      // Continuar sem planos ao invés de quebrar a página
    } finally {
      setLoading(false)
    }
  }

  const smallPlans = plans.filter(p => ['FREE', 'CARBON', 'DIAMOND', 'RICH'].includes(p.id.toUpperCase()))
  const enterprisePlan = plans.find(p => p.id.toUpperCase() === 'ENTERPRISE')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value / 100)
  }

  const getMinTransactions = (plan: AvailablePlan) => {
    const min = plan.minTransactions || 0
    if (min === 0) {
      return 'Até 300 transações/mês'
    }
    return `Mínimo de ${min.toLocaleString('pt-BR')} transações/mês`
  }

  const getMaxTransactions = (plan: AvailablePlan) => {
    const max = plan.maxTransactions
    if (max === null || max === undefined) {
      return ''
    }
    return `Máximo sugerido: ${max.toLocaleString('pt-BR')} transações/mês`
  }

  const SmallPlanCard = ({ plan }: { plan: AvailablePlan }) => {
    const isPrimary = plan.id.toUpperCase() === 'CARBON'
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative w-full rounded-xl border-2 ${
          isPrimary
            ? 'border-primary/70 bg-primary/5'
            : 'border-foreground/10 bg-foreground/2'
        } p-4 shadow-lg transition-all hover:shadow-xl`}
      >
        {isPrimary && (
          <>
            <div
              className="absolute -inset-3 z-0 rounded-xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.22) 0%, rgba(255,107,53,0.08) 60%, transparent 100%)',
                filter: 'blur(8px)',
              }}
            />
            <div className="absolute -top-2 right-3 z-10">
              <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full flex items-center gap-1">
                <FontAwesomeIcon icon={faFire} className="w-2.5 h-2.5" />
                Popular
              </span>
            </div>
          </>
        )}
        
        <div className="relative z-10 flex flex-col gap-3">
          <div>
            <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
          </div>
          
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-foreground">
                {plan.monthlyFee === 0 ? 'Grátis' : formatCurrency(plan.monthlyFee)}
              </span>
              {plan.monthlyFee > 0 && (
                <span className="text-foreground/70 text-xs">/mês</span>
              )}
            </div>
            <p className="text-foreground/60 text-xs mt-1">
              Taxa: {formatCurrency(plan.transactionFee)} por transação
            </p>
          </div>

          <div className="pt-2 border-t border-foreground/10 space-y-1">
            <p className="text-xs text-foreground/70 font-medium">
              {getMinTransactions(plan)}
            </p>
            <p className="text-xs text-foreground/60">
              {getMaxTransactions(plan)}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  const EnterpriseCard = ({ plan }: { plan: AvailablePlan }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative w-full rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-foreground/2 p-6 md:p-8 shadow-lg transition-all hover:shadow-2xl"
      >
        <div
          className="absolute -inset-6 z-0 rounded-[2rem] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,107,53,0.25) 0%, rgba(255,107,53,0.10) 50%, transparent 100%)',
            filter: 'blur(16px)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl font-bold text-foreground mb-2">{plan.name}</h2>
            <p className="text-foreground/70 text-sm mb-4">Solução corporativa completa</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-foreground">
                {formatCurrency(plan.monthlyFee)}
              </span>
              <span className="text-foreground/70 text-sm">/mês</span>
            </div>
            <p className="text-foreground/60 text-xs mt-1">
              Taxa: {formatCurrency(plan.transactionFee)} por transação
            </p>
            <div className="mt-4 pt-4 border-t border-foreground/10 space-y-2">
              <p className="text-sm text-foreground/70 font-medium">
                {getMinTransactions(plan)}
              </p>
              <p className="text-sm text-foreground/60">
                {getMaxTransactions(plan)}
              </p>
            </div>
          </div>
          
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground text-center">
              Para grandes volumes
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <main>
        <div className="py-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <div className="py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4 mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-center">Planos e Preços</h1>
          <p className="text-foreground/70 text-lg text-center max-w-2xl">
            Escolha o plano que melhor atende às suas necessidades.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-7xl mx-auto">
          {/* 4 Cards Pequenos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {smallPlans.map((plan) => (
              <SmallPlanCard key={plan.id} plan={plan} />
            ))}
          </div>

          {/* ENTERPRISE - Card Grande */}
          {enterprisePlan && <EnterpriseCard plan={enterprisePlan} />}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-foreground/60 text-sm">
            Todos os planos incluem renovação automática e upgrade/downgrade conforme o volume de transações.
          </p>
        </motion.div>

        <hr className="my-16 border-foreground/10" />

        <FAQ />
      </div>
    </main>
  )
}
