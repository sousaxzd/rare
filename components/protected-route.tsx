'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // Usar estado para rastrear se já foi hidratado no cliente
  const [isMounted, setIsMounted] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [isAuthenticatedState, setIsAuthenticatedState] = useState<boolean | null>(null)
  const [hasError, setHasError] = useState(false)

  // Marcar como montado após hidratação
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Só verificar autenticação após montagem no cliente
    if (!isMounted) return

    let mounted = true
    let retryCount = 0
    const maxRetries = 5

    const checkAuth = async () => {
      try {
        // Marcar como verificando
        if (mounted) {
          setIsChecking(true)
        }

        // Pequeno delay para garantir que a hidratação completa antes de verificar
        await new Promise(resolve => setTimeout(resolve, 100))

        if (!mounted) return

        try {
          let authenticated = isAuthenticated()
          
          // Se não estiver autenticado e ainda tiver tentativas, tentar novamente após delays progressivos
          // Isso resolve problemas de timing quando o token é salvo logo antes do redirecionamento
          // Aumentar delay inicial e número de tentativas para dispositivos confiáveis
          while (!authenticated && retryCount < maxRetries && mounted) {
            const delay = retryCount === 0 ? 200 : 150 * (retryCount + 1) // Delay maior na primeira tentativa
            await new Promise(resolve => setTimeout(resolve, delay))
            authenticated = isAuthenticated()
            retryCount++
            
            // Se encontrou token, sair do loop imediatamente
            if (authenticated) break
          }
          
          if (mounted) {
            setIsAuthenticatedState(authenticated)
            setIsChecking(false)
            
            if (!authenticated) {
              // Redirecionar se não estiver autenticado após todas as tentativas
              router.replace('/login')
            }
          }
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error)
          if (mounted) {
            // Em caso de erro, verificar novamente se tem token antes de assumir autenticado
            const hasToken = isAuthenticated()
            setIsAuthenticatedState(hasToken)
            setIsChecking(false)
            
            if (!hasToken) {
              router.replace('/login')
            }
          }
        }
      } catch (error) {
        console.error('Erro no ProtectedRoute:', error)
        if (mounted) {
          setHasError(true)
          setIsChecking(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [router, isMounted])

  // Se houver erro, mostrar mensagem ao invés de tela branca
  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground p-6">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-xl font-bold">Erro ao verificar autenticação</h1>
          <p className="text-muted-foreground text-sm">
            Por favor, recarregue a página.
          </p>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload()
              }
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Recarregar
          </button>
        </div>
      </div>
    )
  }

  // Durante SSR e antes da montagem no cliente, renderizar children diretamente
  // Isso garante que o HTML do servidor seja idêntico ao HTML inicial do cliente
  if (!isMounted) {
    return <>{children}</>
  }

  // Durante verificação inicial no cliente, mostrar loading
  // Mas apenas após a hidratação (isChecking === true e isAuthenticatedState === null)
  if (isChecking && isAuthenticatedState === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado após verificação, mostrar loading de redirecionamento
  if (isAuthenticatedState === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Redirecionando...</p>
        </div>
      </div>
    )
  }

  // Renderizar children normalmente (tanto no servidor quanto no cliente após verificação)
  return <>{children}</>
}

