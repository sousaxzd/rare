'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'

interface NextGoalProps {
  currentValue: number // em centavos
  goalValue: number // em centavos
  goalName?: string
}

export function NextGoal({ currentValue = 0, goalValue, goalName }: NextGoalProps) {
  const router = useRouter()
  
  // Converter para reais para cálculo
  const currentInReais = currentValue / 100
  const goalInReais = goalValue / 100
  const percentage = goalInReais > 0 ? Math.min((currentInReais / goalInReais) * 100, 100) : 0
  const remaining = Math.max(goalInReais - currentInReais, 0)

  const formatCurrency = (value: number) => {
    // value já está em reais
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}K`
    }
    return `R$ ${value.toFixed(0)}`
  }

  const handleClick = () => {
    router.push('/dashboard/goals')
  }

  return (
    <div 
      onClick={handleClick}
      className="hidden md:flex items-center gap-2 px-2.5 py-1 bg-foreground/5 border border-foreground/10 rounded-lg h-9 cursor-pointer hover:bg-foreground/10 transition-colors"
    >
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
          <FontAwesomeIcon icon={faBullseye} className="text-primary w-3 h-3" />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-[8px] text-foreground/50 uppercase tracking-wide leading-none">Próxima Meta</span>
        </div>
      </div>
      <div className="h-5 w-px bg-foreground/10" />
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          <span className="text-[11px] font-bold text-foreground">
            {formatCurrency(currentInReais)}
          </span>
          <span className="text-[11px] text-foreground/40">/</span>
          <span className="text-[11px] text-foreground/60">
            {formatCurrency(goalInReais)}
          </span>
        </div>
        <div className="h-1.5 w-16 bg-foreground/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-[9px] text-foreground/60 whitespace-nowrap">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  )
}
