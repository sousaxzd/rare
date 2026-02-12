'use client'

import { createContext, useContext, ReactNode } from 'react'

interface WalletContextType {
  balance: null
  userData: null
  payments: []
  withdraws: []
  internalTransfers: []
  loading: boolean
  refreshWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const refreshWallet = async () => {
    // Desabilitado - sem backend
  }

  return (
    <WalletContext.Provider value={{
      balance: null,
      userData: null,
      payments: [],
      withdraws: [],
      internalTransfers: [],
      loading: false,
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
