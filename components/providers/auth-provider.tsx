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
                try {
                    // Apenas limpar se for 401
                    if (response.error === 'Token inválido ou expirado') {
                        localStorage.removeItem('token')
                        setUser(null)
                    }
                } catch (e) {
                    // ignore
                }
            }
        } catch (error) {
            console.error('Erro ao carregar usuário:', error)
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
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

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
