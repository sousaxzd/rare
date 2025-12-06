'use client'

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react'
import { getBalance, listPayments, listWithdraws, BalanceData, Payment, Withdraw } from '@/lib/wallet'
import { useAuth } from '@/hooks/useAuth'

interface WalletContextType {
    balance: BalanceData | null
    payments: Payment[]
    withdraws: Withdraw[]
    loading: boolean
    refreshWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Intervalo de polling em ms (30 segundos)
const POLL_INTERVAL = 30000

export function WalletProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth()
    const [balance, setBalance] = useState<BalanceData | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [withdraws, setWithdraws] = useState<Withdraw[]>([])
    const [loading, setLoading] = useState(false)

    const fetchingRef = useRef(false)
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const loadWalletData = useCallback(async (showLoading = true) => {
        if (!isAuthenticated || !user) return
        if (fetchingRef.current) return

        try {
            fetchingRef.current = true
            if (showLoading) setLoading(true)

            const [balanceRes, paymentsRes, withdrawsRes] = await Promise.all([
                getBalance(),
                listPayments({ limit: 20 }),
                listWithdraws({ limit: 20 }),
            ])

            if (balanceRes.success) setBalance(balanceRes.data)
            if (paymentsRes.success) setPayments(paymentsRes.data.payments)
            if (withdrawsRes.success) setWithdraws(withdrawsRes.data.withdraws)

        } catch (error) {
            console.error('Erro ao carregar dados da carteira:', error)
        } finally {
            if (showLoading) setLoading(false)
            fetchingRef.current = false
        }
    }, [isAuthenticated, user])

    // Carregar dados iniciais quando autenticado
    useEffect(() => {
        if (isAuthenticated && user) {
            loadWalletData()
        } else {
            setBalance(null)
            setPayments([])
            setWithdraws([])
        }
    }, [isAuthenticated, user, loadWalletData])

    // Polling automático quando a janela está em foco
    useEffect(() => {
        if (!isAuthenticated || !user) return

        const startPolling = () => {
            if (pollIntervalRef.current) return
            pollIntervalRef.current = setInterval(() => {
                loadWalletData(false) // Não mostrar loading no polling
            }, POLL_INTERVAL)
        }

        const stopPolling = () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current)
                pollIntervalRef.current = null
            }
        }

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadWalletData(false) // Atualizar ao voltar para a aba
                startPolling()
            } else {
                stopPolling()
            }
        }

        // Iniciar polling se a aba estiver visível
        if (document.visibilityState === 'visible') {
            startPolling()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)

        return () => {
            stopPolling()
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [isAuthenticated, user, loadWalletData])

    const refreshWallet = useCallback(async () => {
        await loadWalletData(true)
    }, [loadWalletData])

    return (
        <WalletContext.Provider value={{
            balance,
            payments,
            withdraws,
            loading,
            refreshWallet
        }}>
            {children}
        </WalletContext.Provider>
    )
}

export function useWallet() {
    const context = useContext(WalletContext)
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider')
    }
    return context
}

