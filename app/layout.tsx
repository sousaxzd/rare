import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://raremush.com.br'),
  title: 'Rare Mush - Raridades do MushMC',
  description: 'A comunidade definitiva para gamers e criadores de conteúdo. Conecte-se, compartilhe e cresça junto com outros membros. Junte-se ao clã agora mesmo!',
  generator: 'Rare Mush',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: 'https://cdn.discordapp.com/attachments/1469478776206393345/1471283379285655685/New-Project_1__1_.png?ex=698e5eec&is=698d0d6c&hm=8ed7e7068d9f805ff3cc78379824252d0e7076a8da72142c4b025ac99c98b10d&',
        type: 'image/png',
        sizes: 'any',
      },
    ],
    apple: [
      {
        url: 'https://cdn.discordapp.com/attachments/1469478776206393345/1471283379285655685/New-Project_1__1_.png?ex=698e5eec&is=698d0d6c&hm=8ed7e7068d9f805ff3cc78379824252d0e7076a8da72142c4b025ac99c98b10d&',
        type: 'image/png',
        sizes: 'any',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Rare Mush',
  },
  openGraph: {
    title: 'Rare Mush - Raridades do MushMC',
    description: 'A comunidade definitiva para gamers e criadores de conteúdo. Conecte-se, compartilhe e cresça junto com outros membros.',
    type: 'website',
    images: [
      {
        url: '/site.png',
        width: 1200,
        height: 630,
        alt: 'Rare Mush',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rare Mush - Raridades do MushMC',
    description: 'A comunidade definitiva para gamers e criadores de conteúdo. Conecte-se, compartilhe e cresça junto com outros membros.',
    images: ['/site.png'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F59E0B' },
    { media: '(prefers-color-scheme: dark)', color: '#F59E0B' },
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
        </ErrorBoundary>
        <GlobalErrorHandler />
      </body>
    </html>
  )
}
