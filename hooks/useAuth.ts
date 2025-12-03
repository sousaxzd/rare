'use client'

import { useState, useEffect } from 'react'
import { getMe, logout, isAuthenticated, User } from '@/lib/auth'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      // Verificar se há usuário temporário salvo (login com dispositivo confiável ou código)
      let tempUser: User | null = null
      
      try {
        // Verificar se está no cliente
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }

        // Tentar carregar usuário temporário
        try {
          const tempUserStr = sessionStorage.getItem('temp_user')
          if (tempUserStr) {
            tempUser = JSON.parse(tempUserStr)
            if (mounted && tempUser) {
              setUser(tempUser)
              setLoading(false) // Definir loading como false imediatamente se tiver usuário temporário
            }
          }
        } catch (e) {
          // Ignorar erros ao ler usuário temporário
        }

        // Se tem usuário temporário, não precisa verificar token ainda
        // Continuar para tentar carregar do backend
        if (!tempUser && !isAuthenticated()) {
          if (mounted) {
            setLoading(false)
          }
          return
        }

        // Se já temos usuário temporário, tentar carregar do backend para atualizar
        // mas não esperar se der erro (já temos o usuário temporário)
        try {
          const response = await getMe()
          if (mounted) {
            if (response.success && response.user) {
              setUser(response.user)
              // Limpar usuário temporário após carregar do backend com sucesso
              try {
                sessionStorage.removeItem('temp_user')
              } catch (e) {
                // Ignorar erros
              }
            } else {
              // Se não conseguiu carregar do backend mas tem usuário temporário, manter
              if (!tempUser) {
                // Token inválido, limpar apenas se realmente não houver usuário
                try {
                  localStorage.removeItem('token')
                  if (mounted) {
                    setUser(null)
                  }
                } catch (e) {
                  // Ignorar erros de localStorage
                }
              }
            }
          }
        } catch (getMeError: any) {
          // Verificar status HTTP primeiro (mais confiável)
          const httpStatus = getMeError?.status || getMeError?.response?.status
          const errorMessage = getMeError?.message || ''
          
          // Status 0 ou undefined geralmente indica erro de rede (sem resposta do servidor)
          const isNetworkError = (
            httpStatus === 0 ||
            httpStatus === undefined ||
            errorMessage.includes('Servidor indisponível') ||
            errorMessage.includes('Failed to fetch') ||
            errorMessage.includes('NetworkError') ||
            errorMessage.includes('ECONNREFUSED') ||
            errorMessage.includes('ERR_CONNECTION_REFUSED') ||
            errorMessage.includes('ERR_NETWORK_CHANGED') ||
            errorMessage.includes('Tempo de espera esgotado') ||
            getMeError?.name === 'AbortError' ||
            // Verificar se é erro de conexão (sem resposta do servidor)
            (getMeError?.cause && typeof getMeError.cause === 'object' && 'code' in getMeError.cause && 
             ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'].includes(getMeError.cause.code as string))
          )
          
          // Se for erro de rede, manter token e não limpar
          if (isNetworkError) {
            console.warn('Backend indisponível, mantendo token mas não carregando usuário')
            // Não limpar token quando backend está indisponível
            // Se tem usuário temporário, manter ele
            if (!tempUser && mounted) {
              // Não definir usuário se não tiver temporário
            }
            return
          }
          
          // Se for erro 401 (não autorizado), limpar token apenas se não tiver usuário temporário
          if (httpStatus === 401) {
            console.warn('Token inválido ou expirado (401)')
            if (!tempUser && mounted) {
              // Só limpar se não tiver usuário temporário
              try {
                localStorage.removeItem('token')
                setUser(null)
              } catch (e) {
                // Ignorar erros de localStorage
              }
            }
            return
          }
          
          // Para outros erros (500, 503, etc), manter token e usuário temporário se existir
          // Pode ser erro temporário do servidor (reiniciando, etc)
          console.warn(`Erro ao carregar usuário (status ${httpStatus || 'unknown'}, mantendo token):`, errorMessage)
          // Se tem usuário temporário, manter ele mesmo com erro
        }
      } catch (error: any) {
        // Erro ao carregar usuário - sempre tratar sem quebrar a aplicação
        if (mounted) {
          const httpStatus = error?.status || error?.response?.status
          const errorMessage = error instanceof Error ? error.message : String(error)
          
          // Status 0 ou undefined geralmente indica erro de rede
          const isNetworkError = (
            httpStatus === 0 ||
            httpStatus === undefined ||
            errorMessage.includes('Servidor indisponível') ||
            errorMessage.includes('Failed to fetch') ||
            errorMessage.includes('NetworkError') ||
            errorMessage.includes('ECONNREFUSED') ||
            errorMessage.includes('ERR_CONNECTION_REFUSED') ||
            errorMessage.includes('ERR_NETWORK_CHANGED') ||
            errorMessage.includes('Tempo de espera esgotado')
          )
          
          if (isNetworkError) {
            console.warn('Backend indisponível, mantendo token e usuário temporário se existir')
            // Não limpar token quando backend está indisponível
            // Se tem usuário temporário, manter ele
            if (!tempUser && mounted) {
              // Não definir usuário se não tiver temporário
            }
          } else if (httpStatus === 401) {
            // Erro 401 = não autorizado, limpar token apenas se não tiver usuário temporário
            console.warn('Token inválido ou expirado (401)')
            if (!tempUser && mounted) {
              try {
                localStorage.removeItem('token')
                setUser(null)
              } catch (e) {
                // Ignorar erros de localStorage
              }
            }
          } else {
            // Para outros erros (500, 503, etc), manter token e usuário temporário
            // Pode ser erro temporário do servidor
            console.warn(`Erro ao carregar usuário (status ${httpStatus || 'unknown'}, mantendo token):`, errorMessage)
            // Se tem usuário temporário, manter ele mesmo com erro
          }
        }
      } finally {
        if (mounted) {
          // Se não tem usuário temporário e não carregou do backend, definir loading como false
          if (!tempUser) {
            setLoading(false)
          }
          // Se tem usuário temporário, loading já foi definido como false antes
        }
      }
    }

    loadUser()

    // Ouvir eventos de mudança de autenticação
    const handleAuthChangeEvent = (event: any) => {
      if (event.detail?.user && mounted) {
        setUser(event.detail.user)
        setLoading(false)
        // Limpar usuário temporário se foi definido via evento
        try {
          sessionStorage.removeItem('temp_user')
        } catch (e) {
          // Ignorar erros
        }
      }
    }

    const handleStorageChange = () => {
      // Recarregar usuário quando o token mudar
      if (mounted) {
        // Pequeno delay para garantir que o token foi salvo
        setTimeout(() => {
          if (isAuthenticated() && mounted) {
            loadUser()
          }
        }, 100)
      }
    }

    window.addEventListener('auth-change', handleAuthChangeEvent as EventListener)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      mounted = false
      window.removeEventListener('auth-change', handleAuthChangeEvent as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      // Ignorar erros no logout
    } finally {
      setUser(null)
      localStorage.removeItem('token')
      router.push('/')
    }
  }

  const refreshUser = async () => {
    if (!isAuthenticated()) {
      return
    }

    try {
      const response = await getMe()
      if (response.success && response.user) {
        setUser(response.user)
      }
    } catch (error) {
      // Erro ao atualizar usuário
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  return {
    user,
    loading,
    logout: handleLogout,
    refreshUser,
    isAuthenticated: !!user,
  }
}

