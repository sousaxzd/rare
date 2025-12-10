import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

// Font Awesome configuration to prevent icon flash on page load
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import './globals.css'
import LayoutClient from '@/components/layout-client'
import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalErrorHandler } from '@/components/global-error-handler'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://visionwallet.com.br'),
  title: 'Vision Wallet - Sua carteira digital completa',
  description: 'A solução definitiva para pagamentos via PIX: receba e envie dinheiro de forma rápida, segura e totalmente anônima, sem idade mínima, sem bloqueios e sem MEDs. Crie sua conta gratuitamente agora mesmo, sem precisar enviar documentos — simples, direto e sem burocracia. Sem idade minima e sem bloqueios ou MEDs.',
  generator: 'Vision Group Ltda',
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
  openGraph: {
    title: 'Vision Wallet - Sua carteira digital completa',
    description: 'A solução definitiva para pagamentos via PIX: receba e envie dinheiro de forma rápida, segura e totalmente anônima, sem idade mínima, sem bloqueios e sem MEDs. Crie sua conta gratuitamente agora mesmo, sem precisar enviar documentos — simples, direto e sem burocracia.',
    type: 'website',
    images: [
      {
        url: '/site.png',
        width: 1200,
        height: 630,
        alt: 'Vision Wallet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vision Wallet - Sua carteira digital completa',
    description: 'A solução definitiva para pagamentos via PIX: receba e envie dinheiro de forma rápida, segura e totalmente anônima, sem idade mínima, sem bloqueios e sem MEDs. Crie sua conta gratuitamente agora mesmo, sem precisar enviar documentos — simples, direto e sem burocracia.',
    images: ['/site.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f97316' },
    { media: '(prefers-color-scheme: dark)', color: '#f97316' },
  ],
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
