'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getMe, logout as apiLogout, isAuthenticated as checkIsAuthenticated, User } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    user: User | null
    loading: boolean
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const loadUser = async () => {
        // Verificar se está no cliente
        if (typeof window === 'undefined') {
            setLoading(false)
            return
        }

        // Verificar se tem token
        if (!checkIsAuthenticated()) {
            setLoading(false)
            return
        }

        try {
            const response = await getMe()
            if (response.success && response.user) {
                setUser(response.user)
            } else {
                // Se falhar ao carregar usuário, limpar token
                localStorage.removeItem('token')
                setUser(null)
            }
        } catch (error: any) {
            console.error('Erro ao carregar usuário:', error)
            // Se for erro 401 ou token inválido, limpar token
            if (error?.status === 401 || error?.message?.includes('Token inválido') || error?.message?.includes('Token expirado')) {
                localStorage.removeItem('token')
                setUser(null)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadUser()

        // Ouvir eventos de storage para logout em outras abas
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token' && !e.newValue) {
                setUser(null)
                router.push('/')
            } else if (e.key === 'token' && e.newValue) {
                // Token foi adicionado, recarregar usuário
                loadUser()
            }
        }

        // Ouvir evento customizado de mudança de autenticação (disparado após login)
        const handleAuthChange = (e: CustomEvent) => {
            if (e.detail?.user && e.detail?.token) {
                setUser(e.detail.user)
                setLoading(false)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        window.addEventListener('auth-change', handleAuthChange as EventListener)
        
        return () => {
            window.removeEventListener('storage', handleStorageChange)
            window.removeEventListener('auth-change', handleAuthChange as EventListener)
        }
    }, [router])

    const logout = async () => {
        try {
            await apiLogout()
        } catch (error) {
            // Ignorar erros
        } finally {
            setUser(null)
            localStorage.removeItem('token')
            router.push('/')
        }
    }

    const refreshUser = async () => {
        await loadUser()
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            logout,
            refreshUser,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider')
    }
    return context
}
