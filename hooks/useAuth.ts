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
      try {
        // Verificar se está no cliente
        if (typeof window === 'undefined') {
          setLoading(false)
          return
        }

        if (!isAuthenticated()) {
          if (mounted) {
            setLoading(false)
          }
          return
        }

        try {
          const response = await getMe()
          if (mounted) {
            if (response.success && response.user) {
              setUser(response.user)
            } else {
              // Token inválido, limpar apenas se realmente não houver usuário
              // Não limpar em caso de erro de servidor
              try {
                localStorage.removeItem('token')
              } catch (e) {
                // Ignorar erros de localStorage
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
            // Não definir usuário, apenas continuar
            return
          }
          
          // Se for erro 401 (não autorizado), limpar token
          if (httpStatus === 401) {
            console.warn('Token inválido ou expirado (401), removendo token')
            if (mounted) {
              try {
                localStorage.removeItem('token')
              } catch (e) {
                // Ignorar erros de localStorage
              }
            }
            return
          }
          
          // Para outros erros (500, 503, etc), manter token mas não carregar usuário
          // Pode ser erro temporário do servidor (reiniciando, etc)
          console.warn(`Erro ao carregar usuário (status ${httpStatus || 'unknown'}, mantendo token):`, errorMessage)
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
            console.warn('Backend indisponível, mantendo token mas não carregando usuário')
            // Não limpar token quando backend está indisponível
            // Não definir usuário, apenas continuar
          } else if (httpStatus === 401) {
            // Erro 401 = não autorizado, limpar token
            console.warn('Token inválido ou expirado (401), removendo token')
            try {
              localStorage.removeItem('token')
            } catch (e) {
              // Ignorar erros de localStorage
            }
          } else {
            // Para outros erros (500, 503, etc), manter token
            // Pode ser erro temporário do servidor
            console.warn(`Erro ao carregar usuário (status ${httpStatus || 'unknown'}, mantendo token):`, errorMessage)
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      mounted = false
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

