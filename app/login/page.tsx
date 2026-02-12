'use client'

import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { RippleButton } from '@/components/ripple-button'

export default function LoginPage() {
  const handleDiscordLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1465579747512946738'
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/discord/callback`)
    const scope = encodeURIComponent('identify email')
    
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`
    
    window.location.href = discordAuthUrl
  }

  return (
    <div className="min-h-[calc(100vh-120px)] sm:min-h-[calc(100vh-200px)] flex items-center justify-center p-4 sm:p-6 -mt-4 sm:-mt-8">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="p-5 sm:p-8 rounded-2xl border border-foreground/10 bg-foreground/2 backdrop-blur-sm shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground">Bem-vindo</h1>
            <p className="text-foreground/60 text-sm mt-1">Entre com sua conta Discord</p>
          </div>

          <div className="space-y-4">
            <RippleButton
              onClick={handleDiscordLogin}
              className="w-full py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#5865F2]/30 transition-all duration-300 active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-3">
                <FontAwesomeIcon icon={faDiscord} className="w-5 h-5" />
                <span>Entrar com Discord</span>
              </span>
            </RippleButton>
          </div>

          <p className="text-center text-sm text-foreground/60 mt-6">
            Ao entrar, você concorda com nossos{' '}
            <Link href="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Termos de Uso
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-foreground/60 hover:text-foreground transition-colors inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
            <span>Voltar para o início</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
