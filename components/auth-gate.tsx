'use client'

import { useAuth } from '@/hooks/useAuth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar tela de bloqueio
  if (!user) {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-xl flex items-center justify-center z-50">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-[url('/placeholder.jpg')] bg-cover bg-center opacity-5 blur-3xl" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto px-6 text-center"
        >
          {/* Lock Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
              <FontAwesomeIcon icon={faLock} className="text-5xl text-primary" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Acesso Privado
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-foreground/70 text-base mb-8"
          >
            Este site é privado e requer autenticação para acesso.
          </motion.p>

          {/* Discord Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full"
          >
            <Button
              className="w-full bg-[#5865F2] text-white hover:bg-[#4752C4] text-base py-6 border-none"
              onClick={() => {
                const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '1465579747512946738'
                const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/discord/callback`)
                window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify%20email`
              }}
            >
              <span className="flex items-center gap-3">
                <FontAwesomeIcon icon={faDiscord} className="text-2xl" />
                Logar com Discord
              </span>
            </Button>
          </motion.div>

          {/* Warning Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-xl blur-xl" />
            <div className="relative p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/20 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold text-base mb-2">
                    Por que precisamos disso?
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed mb-3">
                    Sua segurança é nossa prioridade. Este login serve apenas para identificação de usuários e preparação de futuras funcionalidades exclusivas. Não coletamos dados sensíveis e não temos acesso à sua conta do Discord.
                  </p>
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>100% Seguro e Confiável</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-foreground/10 flex items-center justify-between">
                <span className="text-foreground/50 text-xs">Equipe Raridades</span>
                <div className="flex items-center gap-1 text-foreground/50 text-xs">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Criptografado</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Se autenticado, mostrar conteúdo
  return <>{children}</>
}
