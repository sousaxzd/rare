'use client'

import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showUnlockButton, setShowUnlockButton] = useState(false)

  // Verificar se está logado
  useEffect(() => {
    if (user) {
      setIsUnlocked(true)
    } else {
      // Mostrar botão após 1 segundo
      setTimeout(() => setShowUnlockButton(true), 1000)
    }
  }, [user])

  const handleUnlock = () => {
    setIsUnlocked(true)
  }

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Se não estiver desbloqueado, mostrar botão de desbloquear
  if (!isUnlocked) {
    return (
      <>
        {/* Overlay com blur */}
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl flex items-center justify-center z-50">
          <AnimatePresence>
            {showUnlockButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-4"
                >
                  <FontAwesomeIcon icon={faLock} className="text-6xl text-foreground/30 mb-4" />
                  <h2 className="text-2xl font-bold text-foreground mb-2">Site Bloqueado</h2>
                  <p className="text-foreground/60">Segure o botão para desbloquear</p>
                </motion.div>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  onMouseDown={(e) => {
                    const button = e.currentTarget
                    const progressBar = button.querySelector('.progress-bar') as HTMLElement
                    
                    if (progressBar) {
                      progressBar.style.transition = 'width 2s linear'
                      progressBar.style.width = '100%'
                      
                      setTimeout(() => {
                        handleUnlock()
                      }, 2000)
                    }
                  }}
                  onMouseUp={(e) => {
                    const button = e.currentTarget
                    const progressBar = button.querySelector('.progress-bar') as HTMLElement
                    
                    if (progressBar && progressBar.style.width !== '100%') {
                      progressBar.style.transition = 'width 0.2s ease'
                      progressBar.style.width = '0%'
                    }
                  }}
                  onMouseLeave={(e) => {
                    const button = e.currentTarget
                    const progressBar = button.querySelector('.progress-bar') as HTMLElement
                    
                    if (progressBar && progressBar.style.width !== '100%') {
                      progressBar.style.transition = 'width 0.2s ease'
                      progressBar.style.width = '0%'
                    }
                  }}
                  className="relative overflow-hidden px-8 py-4 rounded-xl bg-foreground/10 hover:bg-foreground/15 border-2 border-foreground/20 hover:border-[#FFD700]/50 transition-all duration-300 group"
                >
                  <div className="progress-bar absolute bottom-0 left-0 h-full bg-gradient-to-r from-green-500/30 to-green-400/30 w-0" />
                  <span className="relative z-10 flex items-center gap-3 text-foreground font-semibold text-lg">
                    <FontAwesomeIcon icon={faLockOpen} className="text-xl group-hover:scale-110 transition-transform" />
                    Desbloquear
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    )
  }

  // Se desbloqueado, mostrar conteúdo
  return <>{children}</>
}
