'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Stats {
    totalMoneyMoved: number
    activeRegistrations: number
    totalTransactions: number
    generatedAt: string
}

function useCountUp(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0)
    const countRef = useRef(0)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if (end === 0) return

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            countRef.current = Math.floor(easeOutQuart * end)
            setCount(countRef.current)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        startTimeRef.current = null
        requestAnimationFrame(animate)
    }, [end, duration])

    return count
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value / 100)
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('pt-BR').format(value)
}

export function StatsSection() {
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchStats = async () => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'
            const response = await fetch(`${backendUrl}/api/v1/public-stats`)
            const data = await response.json()
            if (data.success) {
                setStats(data.data)
            }
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
        // Refresh every 30 seconds
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    const animatedMoney = useCountUp(stats?.totalMoneyMoved || 0, 2500)
    const animatedRegistrations = useCountUp(stats?.activeRegistrations || 0, 2000)
    const animatedTransactions = useCountUp(stats?.totalTransactions || 0, 2200)

    if (loading) {
        return (
            <section className="py-8 md:py-12">
                <div className="flex items-center justify-center gap-8 md:gap-16">
                    <div className="animate-pulse bg-foreground/10 h-16 w-48 rounded-lg" />
                    <div className="animate-pulse bg-foreground/10 h-16 w-48 rounded-lg" />
                    <div className="animate-pulse bg-foreground/10 h-16 w-48 rounded-lg" />
                </div>
            </section>
        )
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="py-8 md:py-12"
        >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-16">
                {/* Total Money Moved */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <p className="text-3xl md:text-4xl font-bold text-foreground">
                        {formatCurrency(animatedMoney)}

                    </p>
                    <p className="text-sm text-foreground/60 mt-1">movimentados</p>
                </motion.div>

                {/* Divider */}
                <div className="hidden md:block w-px h-12 bg-foreground/20" />

                {/* Active Registrations */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="text-center"
                >
                    <p className="text-3xl md:text-4xl font-bold text-foreground">
                        {formatNumber(animatedRegistrations)}

                    </p>
                    <p className="text-sm text-foreground/60 mt-1">contas ativas</p>
                </motion.div>

                {/* Divider */}
                <div className="hidden md:block w-px h-12 bg-foreground/20" />

                {/* Total Transactions */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.55 }}
                    className="text-center"
                >
                    <p className="text-3xl md:text-4xl font-bold text-foreground">
                        {formatNumber(animatedTransactions)}

                    </p>
                    <p className="text-sm text-foreground/60 mt-1">transações</p>
                </motion.div>

                {/* Divider */}
                <div className="hidden md:block w-px h-12 bg-foreground/20" />

                {/* Real-time indicator */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex items-center gap-2"
                >
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <p className="text-sm text-foreground/60">Em tempo real</p>
                </motion.div>
            </div>
        </motion.section>
    )
}
