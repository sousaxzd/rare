'use client'

import { useState, useMemo, useEffect } from 'react'
import { SidebarDashboard } from '@/components/sidebar-dashboard'
import { DashboardTopbar } from '@/components/dashboard-topbar'
import { DashboardHeader } from '@/components/dashboard-header'
import { RippleButton } from '@/components/ripple-button'
import { Skeleton } from '@/components/ui/skeleton'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format, subDays, startOfDay, endOfDay, startOfYear, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { listPayments, listWithdraws, getBalance } from '@/lib/wallet'

type PeriodFilter = 'today' | '7days' | '30days' | 'year' | 'all'

interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'income' | 'expense'
  status: string
}

export default function SummaryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('30days')
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState<any[]>([])
  const [withdraws, setWithdraws] = useState<any[]>([])
  const [balance, setBalance] = useState<number | null>(null)

  // Carregar dados reais
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Buscar pagamentos e saques (sem limite para pegar todos)
        const [paymentsRes, withdrawsRes, balanceRes] = await Promise.all([
          listPayments({ limit: 1000 }),
          listWithdraws({ limit: 1000 }),
          getBalance()
        ])

        setPayments(paymentsRes.data.payments || [])
        setWithdraws(withdrawsRes.data.withdraws || [])
        setBalance(balanceRes.data.balance.total / 100)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Converter pagamentos e saques em transações unificadas
  const allTransactions = useMemo(() => {
    const transactions: Transaction[] = []

    // Adicionar pagamentos (entradas)
    payments.forEach(payment => {
      if (payment.status === 'COMPLETED' || payment.status === 'PAID') {
        transactions.push({
          id: payment.id,
          date: parseISO(payment.createdAt),
          description: payment.description || 'Pagamento recebido',
          amount: (payment.netValue || payment.value) / 100,
          type: 'income',
          status: payment.status
        })
      }
    })

    // Adicionar saques (saídas)
    withdraws.forEach(withdraw => {
      if (withdraw.status === 'COMPLETED') {
        transactions.push({
          id: withdraw.id,
          date: parseISO(withdraw.createdAt),
          description: withdraw.description || 'Saque realizado',
          amount: -(withdraw.value / 100), // Negativo para saída
          type: 'expense',
          status: withdraw.status
        })
      }
    })

    // Ordenar por data (mais antigo primeiro)
    return transactions.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [payments, withdraws])

  // Filtrar transações baseado no período selecionado
  const filteredTransactions = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (periodFilter) {
      case 'today':
        startDate = startOfDay(now)
        break
      case '7days':
        startDate = startOfDay(subDays(now, 7))
        break
      case '30days':
        startDate = startOfDay(subDays(now, 30))
        break
      case 'year':
        startDate = startOfYear(now)
        break
      case 'all':
        startDate = new Date(2020, 0, 1) // Data muito antiga para pegar tudo
        break
    }

    return allTransactions.filter(t => t.date >= startDate && t.date <= endOfDay(now))
  }, [periodFilter, allTransactions])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const now = new Date()
    let startDate: Date
    switch (periodFilter) {
      case 'today':
        startDate = startOfDay(now)
        break
      case '7days':
        startDate = startOfDay(subDays(now, 7))
        break
      case '30days':
        startDate = startOfDay(subDays(now, 30))
        break
      case 'year':
        startDate = startOfYear(now)
        break
      case 'all':
        startDate = new Date(2020, 0, 1)
        break
    }

    // Calcular saldo inicial: saldo atual - entradas do período + saídas do período
    // Isso nos dá o saldo que existia antes do período filtrado
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = Math.abs(filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0))

    const initialBalance = balance !== null
      ? Math.max(0, balance - totalIncome + totalExpense)
      : 0

    const transactionVolume = totalIncome + totalExpense
    const totalTransactions = filteredTransactions.length
    const averageTicket = totalTransactions > 0 ? transactionVolume / totalTransactions : 0

    // Calcular total de taxas pagas no período (pagamentos + saques)
    const totalFeesFromPayments = payments
      .filter(p => {
        const pDate = parseISO(p.createdAt)
        return pDate >= startDate && pDate <= endOfDay(now) && (p.status === 'COMPLETED' || p.status === 'PAID')
      })
      .reduce((sum, p) => sum + ((p.fee || 0) / 100), 0)

    const totalFeesFromWithdraws = withdraws
      .filter(w => {
        const wDate = parseISO(w.createdAt)
        return wDate >= startDate && wDate <= endOfDay(now) && w.status === 'COMPLETED'
      })
      .reduce((sum, w) => {
        // Taxa do saque está no metadata ou pode ser calculada: value - sent
        const fee = w.metadata?.fee 
          ? w.metadata.fee / 100 
          : w.value && w.metadata?.sent 
            ? (w.value - w.metadata.sent) / 100 
            : 0
        return sum + fee
      }, 0)

    const totalFees = totalFeesFromPayments + totalFeesFromWithdraws

    return {
      initialBalance,
      totalIncome,
      totalExpense,
      availableBalance: balance || 0,
      transactionVolume,
      totalTransactions,
      averageTicket,
      totalFees,
      totalWithdrawn: totalExpense,
    }
  }, [filteredTransactions, balance, payments, withdraws, periodFilter])

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    const groupedByDate = new Map<string, { date: string; income: number; expense: number; volume: number }>()

    filteredTransactions.forEach(transaction => {
      const dateKey = format(transaction.date, 'dd/MM', { locale: ptBR })
      
      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, { date: dateKey, income: 0, expense: 0, volume: 0 })
      }

      const dayData = groupedByDate.get(dateKey)!
      if (transaction.type === 'income') {
        dayData.income += transaction.amount
      } else {
        dayData.expense += Math.abs(transaction.amount)
      }
      dayData.volume = dayData.income + dayData.expense
    })

    return Array.from(groupedByDate.values()).sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number)
      const [dayB, monthB] = b.date.split('/').map(Number)
      if (monthA !== monthB) return monthA - monthB
      return dayA - dayB
    })
  }, [filteredTransactions])

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  const periodLabels: Record<PeriodFilter, string> = {
    today: 'Hoje',
    '7days': 'Últimos 7 dias',
    '30days': 'Últimos 30 dias',
    year: 'Último ano',
    all: 'Todo o período',
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarDashboard open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar onOpenSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main data-dashboard className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <DashboardHeader loading={loading} />

            {/* Filtros de Período */}
            <div className="mt-6 flex flex-wrap gap-2">
              {(Object.keys(periodLabels) as PeriodFilter[]).map((period) => (
                <RippleButton
                  key={period}
                  onClick={() => setPeriodFilter(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    periodFilter === period
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
                  }`}
                >
                  {periodLabels[period]}
                </RippleButton>
              ))}
            </div>

            {/* Cards de Estatísticas */}
            {loading ? (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Saldo Inicial */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Saldo Inicial</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.initialBalance)}
                  </p>
                </div>

                {/* Total de Entradas */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Total de Entradas</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.totalIncome)}
                  </p>
                </div>

                {/* Total de Saídas */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Total de Saídas</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.totalExpense)}
                  </p>
                </div>

                {/* Saldo disponível */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Saldo disponível</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.availableBalance)}
                  </p>
                </div>

                {/* Volume transacionado */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Volume transacionado</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.transactionVolume)}
                  </p>
                </div>

                {/* Ticket Médio */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Ticket Médio</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.averageTicket)}
                  </p>
                </div>

                {/* Total de transações */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Total de transações</p>
                  <p className="text-lg font-bold text-foreground">
                    {stats.totalTransactions}
                  </p>
                </div>

                {/* Total de Taxas */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Total de Taxas</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.totalFees)}
                  </p>
                </div>

                {/* Total Retirado */}
                <div className="border border-foreground/10 rounded-lg p-4 bg-foreground/5">
                  <p className="text-xs text-foreground/60 mb-1">Total Retirado</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(stats.totalWithdrawn)}
                  </p>
                </div>
              </div>
            )}

            {/* Gráfico */}
            <div className="mt-6 border border-foreground/10 rounded-xl bg-foreground/2 backdrop-blur-sm p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Volume de Transações</h2>
              
              {loading ? (
                <Skeleton className="h-[400px] w-full rounded-lg" />
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                    />
                    <YAxis 
                      stroke="rgba(255,255,255,0.5)"
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'rgba(255,255,255,0.6)' }}
                      tickFormatter={(value) => {
                        if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`
                        return `R$ ${value.toFixed(0)}`
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 15, 15, 0.95)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '12px',
                      }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = {
                          volume: 'Volume Total',
                          income: 'Entradas',
                          expense: 'Saídas'
                        }
                        return [formatCurrency(value), labels[name] || name]
                      }}
                      labelFormatter={(label) => `Data: ${label}`}
                      labelStyle={{ color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="volume" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorVolume)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 6, fill: '#8884d8' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="income" 
                      stroke="#22c55e" 
                      fillOpacity={1} 
                      fill="url(#colorIncome)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#22c55e' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="expense" 
                      stroke="#ef4444" 
                      fillOpacity={1} 
                      fill="url(#colorExpense)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#ef4444' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-foreground/60">
                  <p>Nenhum dado disponível para o período selecionado</p>
                </div>
              )}

              {/* Legenda */}
              {chartData.length > 0 && (
                <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#8884d8]" />
                    <span className="text-sm text-foreground/70">Volume Total</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-foreground/70">Entradas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-foreground/70">Saídas</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
