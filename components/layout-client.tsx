'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { PWAProvider } from './pwa-provider'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideLayout = pathname?.startsWith('/dashboard')
  const isHome = pathname === '/'
  const isLogin = pathname === '/login'
  const isSignup = pathname === '/signup'

  return (
    <ErrorBoundary>
      <PWAProvider>
        <div className={`relative flex flex-col overflow-x-hidden ${hideLayout ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
          {!hideLayout && <Navbar />}
          {hideLayout ? (
            children
          ) : (
            <main className={`flex-grow container mx-auto max-w-7xl ${isHome ? 'mt-[-30] md:mt-0' : (isLogin || isSignup) ? 'mt-4 md:mt-6' : 'mt-8 md:mt-12'} mb-10 px-4 sm:px-6`}>
              {children}
            </main>
          )}
          {!hideLayout && <Footer />}
        </div>
        <Toaster />
      </PWAProvider>
    </ErrorBoundary>
  )
}

