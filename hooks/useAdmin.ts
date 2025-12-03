'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'
import { getMe } from '@/lib/auth'

/**
 * Hook para verificar se o usuário é admin e redirecionar se não for
 * Faz verificação direta com o backend para evitar bypasses no cliente
 */
export function useRequireAdmin() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [backendVerified, setBackendVerified] = useState(false)
  const hasRedirected = useRef(false)

  useEffect(() => {
    // Prevenir múltiplos redirecionamentos
    if (hasRedirected.current) return

    const verifyAdmin = async () => {
      if (loading) {
        setIsChecking(true)
        return
      }

      // Se não há usuário, redirecionar para login
      if (!user) {
        hasRedirected.current = true
        router.replace('/login')
        setIsChecking(false)
        return
      }

      // Verificação local primeiro (rápida)
      if (!user.admin) {
        hasRedirected.current = true
        router.replace('/dashboard')
        setIsChecking(false)
        setIsAdmin(false)
        setBackendVerified(false)
        return
      }

      // Verificação crítica: confirmar com o backend diretamente
      // Isso previne bypasses mesmo se alguém modificar o código do cliente
      try {
        const response = await getMe()
        
        // Verificar se a resposta do backend confirma que é admin
        if (!response.success || !response.user || !response.user.admin) {
          // Backend confirma que NÃO é admin - redirecionar imediatamente
          hasRedirected.current = true
          router.replace('/dashboard')
          setIsChecking(false)
          setIsAdmin(false)
          setBackendVerified(false)
          return
        }

        // Backend confirmou que é admin
        setBackendVerified(true)
        setIsAdmin(true)
        setIsChecking(false)
      } catch (error) {
        // Erro ao verificar com backend - por segurança, não permitir acesso
        console.error('Erro ao verificar admin com backend:', error)
        hasRedirected.current = true
        router.replace('/dashboard')
        setIsChecking(false)
        setIsAdmin(false)
        setBackendVerified(false)
      }
    }

    verifyAdmin()
  }, [user, loading, router])

  return {
    user,
    loading: loading || isChecking || !isAdmin || !backendVerified,
    isAdmin: isAdmin && backendVerified, // Só retorna true se ambas verificações passarem
  }
}

