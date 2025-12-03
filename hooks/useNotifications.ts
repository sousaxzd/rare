'use client'

import { useState, useEffect } from 'react'

export interface NotificationPreferences {
  enabled: boolean
  paymentReceived: boolean
  withdrawCompleted: boolean
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: false,
    paymentReceived: false,
    withdrawCompleted: false,
  })
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Carregar preferências do localStorage
      const savedPrefs = localStorage.getItem('notificationPreferences')
      if (savedPrefs) {
        try {
          setPreferences(JSON.parse(savedPrefs))
        } catch (e) {
          console.error('Erro ao carregar preferências de notificação:', e)
        }
      }
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      console.warn('Notificações não são suportadas neste navegador')
      return false
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error)
      return false
    }
  }

  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences }
    setPreferences(updated)
    localStorage.setItem('notificationPreferences', JSON.stringify(updated))
  }

  const showNotification = async (
    title: string,
    options: NotificationOptions = {}
  ) => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Notificações não estão disponíveis')
      return
    }

    if (!preferences.enabled) {
      return
    }

    // Verificar se Service Worker está disponível
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(title, {
          icon: '/logo_fundo.png',
          badge: '/logo_fundo.png',
          ...options,
        })
      } catch (error) {
        console.error('Erro ao mostrar notificação via Service Worker:', error)
        // Fallback para notificação padrão
        new Notification(title, {
          icon: '/icon.svg',
          ...options,
        })
      }
    } else {
      // Fallback para notificação padrão
      new Notification(title, {
        icon: '/logo_fundo.png',
        ...options,
      })
    }
  }

  const notifyPaymentReceived = async (amount: number, description?: string) => {
    if (!preferences.paymentReceived) return

    await showNotification('Pagamento Recebido', {
      body: description || `Você recebeu R$ ${(amount / 100).toFixed(2).replace('.', ',')}`,
      tag: 'payment-received',
      data: {
        url: '/dashboard/transactions',
        type: 'payment',
      },
    })
  }

  const notifyWithdrawCompleted = async (amount: number, description?: string) => {
    if (!preferences.withdrawCompleted) return

    await showNotification('Saque Realizado', {
      body: description || `Seu saque de R$ ${(amount / 100).toFixed(2).replace('.', ',')} foi realizado com sucesso`,
      tag: 'withdraw-completed',
      data: {
        url: '/dashboard/transactions',
        type: 'withdraw',
      },
    })
  }

  return {
    isSupported,
    permission,
    preferences,
    requestPermission,
    updatePreferences,
    showNotification,
    notifyPaymentReceived,
    notifyWithdrawCompleted,
  }
}

