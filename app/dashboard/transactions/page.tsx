'use client'

import { useState, useEffect } from 'react'
import { SidebarDashboard } from '@/components/sidebar-dashboard'
import { DashboardTopbar } from '@/components/dashboard-topbar'
import { DashboardHeader } from '@/components/dashboard-header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar, faFilePdf, faFileExcel, faDownload, faArrowUp, faArrowDown, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { RippleButton } from '@/components/ripple-button'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { listTransactions } from '@/lib/wallet'
import { Skeleton } from '@/components/ui/skeleton'
import { TransactionDetailsModal } from '@/components/transaction-details-modal'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Transaction {
  id: string
  date: Date
  description: string
  type: 'income' | 'expense'
  transactionType: 'payment' | 'withdraw'
  amount: number
  status: string
}

const getStatusBadge = (status: string) => {
  const statusUpper = status.toUpperCase()
  if (statusUpper === 'COMPLETED' || statusUpper === 'PAID') {
    return (
      <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs font-semibold rounded-full">
        Completo
      </span>
    )
  }
  if (statusUpper === 'PENDING' || statusUpper === 'PROCESSING' || statusUpper === 'WAITING' || statusUpper === 'ACTIVE') {
    return (
      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-semibold rounded-full">
        Pendente
      </span>
    )
  }
  if (statusUpper === 'FAILED' || statusUpper === 'CANCELLED' || statusUpper === 'EXPIRED') {
    return (
      <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs font-semibold rounded-full">
        {statusUpper === 'FAILED' ? 'Falhou' : statusUpper === 'CANCELLED' ? 'Cancelado' : 'Expirado'}
      </span>
    )
  }
  return (
    <span className="px-3 py-1 bg-gray-500/20 text-gray-300 text-xs font-semibold rounded-full">
      {status}
    </span>
  )
}

export default function TransactionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1))
  const [endDate, setEndDate] = useState<Date>(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [minValue, setMinValue] = useState<string>('')
  const [maxValue, setMaxValue] = useState<string>('')
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>('')
  const [selectedTransactionType, setSelectedTransactionType] = useState<'payment' | 'withdraw'>('payment')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [itemsPerPage] = useState(25)

  const loadTransactions = async () => {
    try {
      setLoading(true)

      const response = await listTransactions({
        page: currentPage,
        limit: itemsPerPage,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        type: typeFilter,
        status: statusFilter
      })

      if (response.success) {
        const mappedTransactions: Transaction[] = response.data.transactions.map(t => ({
          id: t.id,
          date: new Date(t.date),
          description: t.description,
          type: t.type,
          transactionType: t.transactionType,
          amount: t.amount,
          status: t.status
        }))

        setTransactions(mappedTransactions)
        setTotalPages(response.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [currentPage, startDate, endDate, statusFilter, typeFilter])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [startDate, endDate, statusFilter, typeFilter])

  const handleExportPDF = () => {
    alert('Exportação PDF em desenvolvimento')
  }

  const handleExportExcel = () => {
    alert('Exportação Excel em desenvolvimento')
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarDashboard open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar onOpenSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main data-dashboard className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            <DashboardHeader />

            {/* Filtros e Exportação */}
            <div className="mt-6 space-y-4">
              {/* Primeira linha: Filtros principais */}
              <div className="flex flex-col gap-4">
                {/* Linha 1: Período e Exportação */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Filtro de Período */}
                  <div className="relative flex-1 min-w-0">
                    <RippleButton
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg hover:bg-foreground/10 transition-colors w-full sm:w-auto"
                    >
                      <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground font-medium truncate">
                        {format(startDate, "dd/MM/yyyy", { locale: ptBR })} até {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </RippleButton>

                    {showDatePicker && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDatePicker(false)}
                        />
                        <div className="absolute top-full left-0 right-0 sm:right-auto mt-2 p-4 bg-background border border-foreground/10 rounded-lg shadow-lg z-50 sm:w-auto w-full">
                          <div className="flex flex-col gap-3">
                            <div>
                              <label className="text-xs text-foreground/60 mb-1 block">Data Inicial</label>
                              <input
                                type="date"
                                value={format(startDate, 'yyyy-MM-dd')}
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                                className="px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-foreground/60 mb-1 block">Data Final</label>
                              <input
                                type="date"
                                value={format(endDate, 'yyyy-MM-dd')}
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                                className="px-3 py-2 rounded-lg bg-input border border-border text-foreground text-sm w-full focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Botões de Exportação */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <RippleButton
                      onClick={handleExportPDF}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors flex-1 sm:flex-initial"
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-foreground font-medium hidden sm:inline">Exportar PDF</span>
                    </RippleButton>
                    <RippleButton
                      onClick={handleExportExcel}
                      className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors flex-1 sm:flex-initial"
                    >
                      <FontAwesomeIcon icon={faFileExcel} className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-foreground font-medium hidden sm:inline">Exportar Excel</span>
                    </RippleButton>
                  </div>
                </div>

                {/* Linha 2: Status e Tipo */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Filtro de Status */}
                  <div className="flex-1 min-w-0">
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="all" textValue="Todos os Status">Todos os Status</SelectItem>
                          <SelectItem value="completed" textValue="Completo">Completo</SelectItem>
                          <SelectItem value="pending" textValue="Pendente">Pendente</SelectItem>
                          <SelectItem value="failed" textValue="Falhou">Falhou</SelectItem>
                          <SelectItem value="cancelled" textValue="Cancelado">Cancelado</SelectItem>
                          <SelectItem value="expired" textValue="Expirado">Expirado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Filtro de Tipo */}
                  <div className="flex-1 min-w-0">
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Todos os Tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo</SelectLabel>
                          <SelectItem value="all" textValue="Todos os Tipos">Todos os Tipos</SelectItem>
                          <SelectItem value="income" textValue="Entrada">Entrada</SelectItem>
                          <SelectItem value="expense" textValue="Saída">Saída</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Transações */}
            <div className="mt-6 border border-foreground/10 rounded-xl bg-foreground/2 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto -mx-6 lg:mx-0 px-6 lg:px-0">
                {loading ? (
                  <div className="p-6 space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-5 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="border-b border-foreground/10 bg-foreground/5">
                          <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Data</th>
                          <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Tipo</th>
                          <th className="px-3 sm:px-6 py-4 text-left text-xs font-semibold text-foreground/60 uppercase tracking-wider">Status</th>
                          <th className="px-3 sm:px-6 py-4 text-right text-xs font-semibold text-foreground/60 uppercase tracking-wider">Valor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/10">
                        {transactions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-3 sm:px-6 py-12 text-center text-sm text-foreground/60">
                              Nenhuma transação encontrada no período selecionado
                            </td>
                          </tr>
                        ) : (
                          transactions.map((transaction) => {
                            return (
                              <tr
                                key={transaction.id}
                                className="hover:bg-foreground/5 transition-colors cursor-pointer"
                                onClick={() => {
                                  setSelectedTransactionId(transaction.id)
                                  setSelectedTransactionType(transaction.transactionType)
                                  setDetailsModalOpen(true)
                                }}
                              >
                                <td className="px-3 sm:px-6 py-4 text-sm text-foreground/80 font-medium whitespace-nowrap">
                                  <span className="hidden sm:inline">{format(transaction.date, "dd/MM/yyyy HH:mm", { locale: ptBR })}</span>
                                  <span className="sm:hidden">{format(transaction.date, "dd/MM/yyyy", { locale: ptBR })}</span>
                                </td>
                                <td className="px-3 sm:px-6 py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-500/10' : 'bg-red-500/10'
                                      }`}>
                                      <FontAwesomeIcon
                                        icon={transaction.type === 'income' ? faArrowDown : faArrowUp}
                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                                          }`}
                                      />
                                    </div>
                                    <span className="text-sm font-medium text-foreground">
                                      {transaction.type === 'income' ? 'Entrada' : 'Saída'}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-4">
                                  {getStatusBadge(transaction.status)}
                                </td>
                                <td className={`px-3 sm:px-6 py-4 text-right text-sm font-bold whitespace-nowrap ${transaction.type === 'income' ? 'text-green-500' : 'text-foreground'
                                  }`}>
                                  {transaction.type === 'income' ? '+' : '-'}R$ {(Math.abs(transaction.amount) / 100).toFixed(2).replace('.', ',')}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>

                    {/* Paginação */}
                    {totalPages > 1 && (
                      <div className="px-6 py-4 border-t border-foreground/10 flex items-center justify-between">
                        <div className="text-sm text-foreground/60">
                          Página {currentPage} de {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <RippleButton
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${currentPage === 1
                              ? 'border-foreground/10 text-foreground/40 cursor-not-allowed'
                              : 'border-foreground/20 text-foreground hover:bg-foreground/10'
                              }`}
                          >
                            Anterior
                          </RippleButton>
                          <RippleButton
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 text-sm rounded-lg border transition-colors ${currentPage === totalPages
                              ? 'border-foreground/10 text-foreground/40 cursor-not-allowed'
                              : 'border-foreground/20 text-foreground hover:bg-foreground/10'
                              }`}
                          >
                            Próxima
                          </RippleButton>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>

      <TransactionDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        transactionId={selectedTransactionId}
        transactionType={selectedTransactionType}
      />
    </div>
  )
}
