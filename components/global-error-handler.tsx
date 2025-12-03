'use client'

import { useEffect } from 'react'

export function GlobalErrorHandler() {
  useEffect(() => {
    // Garantir que só executa no cliente
    if (typeof window === 'undefined') return

    const handleError = (event: ErrorEvent) => {
      // Ignorar erros de servidor indisponível
      if (
        event.message?.includes('Servidor indisponível') ||
        event.message?.includes('Failed to fetch') ||
        event.message?.includes('NetworkError') ||
        event.message?.includes('ECONNREFUSED') ||
        event.message?.includes('ERR_CONNECTION_REFUSED')
      ) {
        console.warn('Erro de rede ignorado (servidor indisponível):', event.message)
        event.preventDefault()
        return
      }
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Ignorar rejeições de promessa relacionadas a servidor indisponível
      const reason = event.reason
      const message = reason?.message || reason?.toString() || ''
      
      if (
        message.includes('Servidor indisponível') ||
        message.includes('Failed to fetch') ||
        message.includes('NetworkError') ||
        message.includes('ECONNREFUSED') ||
        message.includes('ERR_CONNECTION_REFUSED')
      ) {
        console.warn('Rejeição de promessa ignorada (servidor indisponível):', message)
        event.preventDefault()
        return
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return null
}

