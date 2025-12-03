import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import LayoutClient from '@/components/layout-client'
import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalErrorHandler } from '@/components/global-error-handler'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Vision Wallet - Sua carteira digital completa',
  description: 'A melhor solução de pagamentos via PIX, receba e transfira dinheiro de forma rápida, segura e anônima.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Vision Wallet',
  },
}

import { AuthProvider } from '@/components/providers/auth-provider'
import { WalletProvider } from '@/components/providers/wallet-provider'
import { TooltipProvider } from '@/components/ui/tooltip'

// ...

import { DevToolsBlocker } from '@/components/devtools-blocker'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <DevToolsBlocker />
          <AuthProvider>
            <WalletProvider>
              <TooltipProvider>
                <LayoutClient>{children}</LayoutClient>
              </TooltipProvider>
            </WalletProvider>
          </AuthProvider>
          <Analytics />
        </ErrorBoundary>
        <GlobalErrorHandler />
      </body>
    </html>
  )
}
