'use client'

import { useEffect } from 'react'
import { RippleButton } from '@/components/ripple-button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para debugging
    console.error('Erro capturado pelo error.tsx:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-2xl font-bold">Ops! Algo deu errado</h1>
        <p className="text-muted-foreground">
          Ocorreu um erro ao carregar a página. Por favor, tente novamente.
        </p>
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="p-4 bg-foreground/5 rounded-lg text-left">
            <p className="text-sm text-muted-foreground font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        <div className="flex gap-2 justify-center">
          <RippleButton
            onClick={() => reset()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </RippleButton>
          <RippleButton
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-foreground/5 text-foreground border border-foreground/10 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            Recarregar página
          </RippleButton>
        </div>
      </div>
    </div>
  )
}

