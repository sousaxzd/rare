'use client'

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react'
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

export function WalletProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth()
    const [balance, setBalance] = useState<BalanceData | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [withdraws, setWithdraws] = useState<Withdraw[]>([])
    const [loading, setLoading] = useState(false)
    const [loaded, setLoaded] = useState(false)

    const fetchingRef = useRef(false)

    const loadWalletData = async () => {
        if (!isAuthenticated || !user) return
        if (fetchingRef.current) return

        try {
            fetchingRef.current = true
            setLoading(true)
            const [balanceRes, paymentsRes, withdrawsRes] = await Promise.all([
                getBalance(),
                listPayments({ limit: 20 }),
                listWithdraws({ limit: 20 }),
            ])

            if (balanceRes.success) setBalance(balanceRes.data)
            if (paymentsRes.success) setPayments(paymentsRes.data.payments)
            if (withdrawsRes.success) setWithdraws(withdrawsRes.data.withdraws)

            setLoaded(true)
        } catch (error) {
            console.error('Erro ao carregar dados da carteira:', error)
        } finally {
            setLoading(false)
            fetchingRef.current = false
        }
    }

    useEffect(() => {
        if (isAuthenticated && user && !loaded) {
            loadWalletData()
        } else if (!isAuthenticated) {
            setBalance(null)
            setPayments([])
            setWithdraws([])
            setLoaded(false)
        }
    }, [isAuthenticated, user])

    const refreshWallet = async () => {
        await loadWalletData()
    }

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
