'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'
import { AuthGate } from '@/components/auth-gate'
import { motion } from 'framer-motion'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isHome = pathname === '/'
  const isLogin = pathname === '/login'

  return (
    <ErrorBoundary>
      <AuthGate>
        <div className="relative flex flex-col min-h-screen">
          {/* Grid Pattern Background */}
          <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>

          {/* Static Background - NO LAG */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Static Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(245, 158, 11, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(245, 158, 11, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px'
              }}
            />

            {/* Subtle Gradient Orbs - CSS Only */}
            <div 
              className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
                animation: 'float 20s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)',
                animation: 'float 25s ease-in-out infinite reverse'
              }}
            />

            {/* Radial Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/20 to-background/80" />
          </div>
          
          <div className="relative z-10">
            <Navbar />
            <div className="overflow-x-hidden flex-grow flex flex-col">
              <main className={`flex-grow ${isHome ? 'mt-[-30] md:mt-0' : isLogin ? 'mt-4 md:mt-6' : 'mt-8 md:mt-12'} mb-10 ${isHome ? '' : 'container mx-auto max-w-7xl px-4 sm:px-6'}`}>
                <div className={isHome ? 'max-w-7xl mx-auto px-6' : ''}>
                  {children}
                </div>
              </main>
              <Footer />
            </div>
          </div>
        </div>
        <Toaster />
      </AuthGate>
    </ErrorBoundary>
  )
}

