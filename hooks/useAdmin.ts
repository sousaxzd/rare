'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { useRouter } from 'next/navigation'

/**
 * Hook para verificar se o usuário é admin e redirecionar se não for
 */
export function useRequireAdmin() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
        return
      }

      if (!user.admin) {
        router.push('/dashboard')
        return
      }

      setIsAdmin(true)
    }
  }, [user, loading, router])

  return {
    user,
    loading: loading || !isAdmin,
    isAdmin,
  }
}

