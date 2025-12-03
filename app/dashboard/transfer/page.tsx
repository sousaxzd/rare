'use client'

import { useState, useEffect } from 'react'
import { SidebarDashboard } from '@/components/sidebar-dashboard'
import { DashboardTopbar } from '@/components/dashboard-topbar'
import { DashboardHeader } from '@/components/dashboard-header'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQrcode, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { RippleButton } from '@/components/ripple-button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { createWithdraw, getBalance } from '@/lib/wallet'
import { useRouter } from 'next/navigation'
import { TransactionModal } from '@/components/transaction-modal'
import { Checkbox } from '@/components/ui/checkbox'
import { TransferVerificationModal } from '@/components/transfer-verification-modal'
import { getSecurityStatus, type SecurityStatusResponse } from '@/lib/security'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TransferPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [pixKey, setPixKey] = useState('')
  const [pixKeyType, setPixKeyType] = useState<'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM'>('CPF')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [coverFee, setCoverFee] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [transactionFee, setTransactionFee] = useState<number | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<'success' | 'error' | 'loading'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [withdrawData, setWithdrawData] = useState<any>(null)
  const [verificationModalOpen, setVerificationModalOpen] = useState(false)
  const [transferSecurityEnabled, setTransferSecurityEnabled] = useState(false)
  const [verificationCode, setVerificationCode] = useState<string | null>(null)
  const router = useRouter()

  const parseAmount = (value: string) => {
    if (!value) return 0
    // Remover separadores de milhar e normalizar vírgula para ponto
    const cleaned = value.replace(/\./g, '').replace(',', '.')
    const num = parseFloat(cleaned)
    return Number.isFinite(num) ? num : 0
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        // Verificar se há código PIX salvo do chat da IA (apenas no cliente)
        if (typeof window !== 'undefined') {
          const savedPixKey = localStorage.getItem('vision_pix_key_to_transfer')
          const savedPixKeyType = localStorage.getItem('vision_pix_key_type_to_transfer')
          
          if (savedPixKey) {
            setPixKey(savedPixKey)
            if (savedPixKeyType) {
              setPixKeyType(savedPixKeyType as 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'RANDOM')
            } else {
              // Detectar tipo automaticamente se for chave aleatória (32 caracteres)
              if (savedPixKey.length === 32 && /^[a-zA-Z0-9]+$/.test(savedPixKey)) {
                setPixKeyType('RANDOM')
              }
            }
            // Limpar após usar
            localStorage.removeItem('vision_pix_key_to_transfer')
            localStorage.removeItem('vision_pix_key_type_to_transfer')
          }
        }

        const [balanceRes, securityRes] = await Promise.all([
          getBalance(),
          getSecurityStatus().catch(() => ({ data: { transferSecurityEnabled: false } }))
        ])
        
        setBalance(balanceRes.data.balance.total / 100)
        if (balanceRes.data.plan) {
          setTransactionFee(balanceRes.data.plan.transactionFee / 100)
        }
        
        setTransferSecurityEnabled(securityRes.data.transferSecurityEnabled)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        // Sincronizar com tempo de loading da página
        setTimeout(() => {
          setPageLoading(false)
        }, 800)
      }
    }
    loadData()
  }, [])

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Se segurança estiver ativada e não tiver código, pedir código primeiro
    if (transferSecurityEnabled && !verificationCode) {
      setVerificationModalOpen(true)
      return
    }

    // Prosseguir com a transferência
    await executeTransfer()
  }

  const executeTransfer = async () => {
    setLoading(true)
    setModalOpen(true)
    setModalStatus('loading')
    
    try {
      // Sanitizar chave PIX conforme tipo
      let keyToSend = pixKey
      if (pixKeyType === 'CPF' || pixKeyType === 'CNPJ' || pixKeyType === 'PHONE') {
        keyToSend = pixKey.replace(/\D/g, '')
      }

      // Garantir valor em número
      const amountNumber = parseAmount(amount)

      const response = await createWithdraw({
        amount: amountNumber,
        pixKey: keyToSend || undefined,
        pixKeyType: pixKeyType,
        description: description || undefined,
        coverFee: coverFee,
        verificationCode: verificationCode || undefined
      })
      
      setWithdrawData(response.data)
      setModalStatus('success')
      setPixKey('')
      setAmount('')
      setDescription('')
      setCoverFee(false)
      setVerificationCode(null)
      
      // Recarregar saldo
      const res = await getBalance()
      setBalance(res.data.balance.total / 100)
    } catch (error) {
      setModalStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao realizar transferência')
      
      // Se erro for de código inválido, reabrir modal
      if (error instanceof Error && error.message.includes('código')) {
        setVerificationCode(null)
        setVerificationModalOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCodeVerified = (code: string) => {
    setVerificationCode(code)
    setVerificationModalOpen(false)
    // Executar transferência após código verificado
    setTimeout(() => {
      executeTransfer()
    }, 100)
  }

  const handleVerificationCancel = () => {
    setVerificationModalOpen(false)
    setVerificationCode(null)
  }

  const formatCurrency = (value: string) => {
    const cleaned = value.replace(/[^\d,.]/g, '')
    const normalized = cleaned.replace(',', '.')
    return normalized
  }

  return (
    <div className="flex h-screen bg-background">
      <TransferVerificationModal
        open={verificationModalOpen}
        onOpenChange={setVerificationModalOpen}
        amount={amount}
        onVerified={handleCodeVerified}
        onCancel={handleVerificationCancel}
      />
      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type="withdraw"
        status={modalStatus}
        message={modalStatus === 'error' ? errorMessage : undefined}
        details={withdrawData ? {
          amount: withdrawData.value,
          fee: withdrawData.fee,
          netAmount: withdrawData.sent,
          transactionId: withdrawData.id
        } : undefined}
      />
      <SidebarDashboard open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardTopbar onOpenSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main data-dashboard className="flex-1 overflow-auto flex justify-center">
          <div className="p-6 lg:p-8 space-y-5 max-w-2xl w-full">
            <DashboardHeader loading={pageLoading} />

            {pageLoading ? (
              <div className="space-y-5">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : (
              <>
                {balance !== null && (
                  <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Saldo disponível:</span>
                      <span className="text-lg font-bold text-foreground">
                        R$ {balance.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleTransfer} className="space-y-5">
              {/* Informações de destino */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Tipo de chave PIX
                  </label>
                  <Select value={pixKeyType} onValueChange={(v) => setPixKeyType(v as any)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tipo de chave</SelectLabel>
                        <SelectItem value="CPF" textValue="CPF">CPF</SelectItem>
                        <SelectItem value="CNPJ" textValue="CNPJ">CNPJ</SelectItem>
                        <SelectItem value="EMAIL" textValue="E-mail">E-mail</SelectItem>
                        <SelectItem value="PHONE" textValue="Telefone">Telefone</SelectItem>
                        <SelectItem value="RANDOM" textValue="Chave aleatória">Chave aleatória</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Chave PIX
                  </label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faQrcode} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                    />
                    <input
                      type="text"
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                      placeholder={
                        pixKeyType === 'CPF' ? '000.000.000-00' :
                        pixKeyType === 'CNPJ' ? '00.000.000/0000-00' :
                        pixKeyType === 'EMAIL' ? 'exemplo@email.com' :
                        pixKeyType === 'PHONE' ? '(00) 00000-0000' :
                        'Chave aleatória'
                      }
                      className="w-full pl-10 pr-3 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Valor e descrição */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Valor
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      R$
                    </span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => {
                        const formatted = formatCurrency(e.target.value)
                        setAmount(formatted)
                      }}
                      placeholder="0,00"
                      className="w-full pl-10 pr-3 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Valor mínimo: R$ 5,00
                  </p>
                  {amount && transactionFee !== null && (
                    <div className="p-3 rounded-lg bg-foreground/5 border border-foreground/10 space-y-1">
                      {(() => {
                        const fee = Number.isFinite(transactionFee) ? (transactionFee as number) : 0
                        const amountNum = parseAmount(amount)
                        const feeDisplay = `R$ ${fee.toFixed(2).replace('.', ',')}`
                        const sentDisplay = `R$ ${Math.max(0, amountNum - fee).toFixed(2).replace('.', ',')}`
                        const amountDisplay = `R$ ${amountNum.toFixed(2).replace('.', ',')}`
                        const totalDebitedDisplay = `R$ ${(amountNum + fee).toFixed(2).replace('.', ',')}`
                        return (
                          <>
                            {coverFee ? (
                              <>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Valor enviado:</span>
                                  <span className="text-foreground font-medium">
                                    {amountDisplay}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Taxa:</span>
                                  <span className="text-foreground font-medium">
                                    {feeDisplay}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-foreground/10">
                                  <span className="text-sm font-medium text-foreground">Total debitado:</span>
                                  <span className="text-sm font-bold text-foreground">
                                    {totalDebitedDisplay}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Taxa:</span>
                                  <span className="text-foreground font-medium">
                                    {feeDisplay}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-foreground/10">
                                  <span className="text-sm font-medium text-foreground">Valor enviado:</span>
                                  <span className="text-sm font-bold text-green-500">
                                    {sentDisplay}
                                  </span>
                                </div>
                              </>
                            )}
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-foreground/5 border border-foreground/10">
                  <Checkbox
                    id="coverFee"
                    checked={coverFee}
                    onCheckedChange={(checked) => setCoverFee(checked === true)}
                    label="Cobrir taxa"
                    description="O valor digitado será o valor enviado. A taxa será adicionada ao total debitado."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Descrição <span className="text-muted-foreground font-normal text-xs">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Pagamento almoço"
                    className="w-full px-3 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !amount || !pixKey || (balance !== null && transactionFee !== null && (() => {
                  const fee = Number.isFinite(transactionFee) ? (transactionFee as number) : 0
                  const amountNum = parseAmount(amount)
                  return coverFee ? amountNum + fee > balance : amountNum > balance
                })())}
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <span>Transferir</span>
                )}
              </button>
            </form>
            
                {/* Espaço após o botão */}
                <div className="h-8" />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
