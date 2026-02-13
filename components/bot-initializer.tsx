'use client'

import { useEffect, useState } from 'react'

export function BotInitializer() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Inicializar o bot quando o componente montar
    const initBot = async () => {
      try {
        const response = await fetch('/api/bot')
        const data = await response.json()
        
        if (data.success) {
          setStatus('success')
          setMessage('Bot Discord conectado')
          console.log('✅ Bot Discord inicializado:', data)
        } else {
          setStatus('error')
          setMessage('Erro ao conectar bot')
          console.error('❌ Erro ao inicializar bot:', data)
        }
      } catch (error) {
        setStatus('error')
        setMessage('Erro ao conectar bot')
        console.error('❌ Erro ao inicializar bot:', error)
      }
    }

    initBot()
  }, [])

  // Componente invisível - apenas para inicializar o bot
  return null
}
