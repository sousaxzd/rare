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
              // Token inválido, limpar
              try {
                localStorage.removeItem('token')
              } catch (e) {
                // Ignorar erros de localStorage
              }
            }
          }
        } catch (getMeError) {
          // Erro ao buscar usuário - tratar separadamente
          throw getMeError
        }
      } catch (error) {
        // Erro ao carregar usuário - sempre tratar sem quebrar a aplicação
        if (mounted) {
          // Se for erro de servidor indisponível, não limpar token, apenas não carregar usuário
          if (error instanceof Error && (
            error.message.includes('Servidor indisponível') ||
            error.message.includes('Failed to fetch') ||
            error.message.includes('NetworkError') ||
            error.message.includes('ECONNREFUSED')
          )) {
            console.warn('Backend indisponível, mantendo token mas não carregando usuário')
            // Não limpar token quando backend está indisponível
            // Não definir usuário, apenas continuar
          } else {
            // Para outros erros (autenticação inválida, etc), limpar token
            console.error('Erro ao carregar usuário:', error)
            try {
              localStorage.removeItem('token')
            } catch (e) {
              // Ignorar erros de localStorage
            }
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

