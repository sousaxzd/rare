'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiGet, apiPost, apiDelete } from '@/lib/api'

export interface NotificationPreferences {
  enabled: boolean
  paymentReceived: boolean
  withdrawCompleted: boolean
}

interface PushStatusResponse {
  success: boolean
  hasSubscriptions: boolean
  count: number
}

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: false,
    paymentReceived: true,
    withdrawCompleted: true,
  })
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar se o navegador suporta notificações
    if (typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator) {
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

      // Verificar se já está inscrito no backend
      checkSubscriptionStatus()
    }
  }, [])

  const checkSubscriptionStatus = async () => {
    try {
      const res = await apiGet<PushStatusResponse>('/v1/push/status')
      setIsSubscribed(res.hasSubscriptions)
    } catch {
      // Ignora erro se não estiver autenticado
    }
  }

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

  const subscribeToPush = useCallback(async (): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Notificações não estão disponíveis ou não foram permitidas')
      return false
    }

    setLoading(true)
    try {
      // Obter chave pública VAPID do backend
      const vapidRes = await apiGet<{ success: boolean; publicKey: string }>('/v1/push/vapid-key')
      if (!vapidRes.success || !vapidRes.publicKey) {
        console.error('Chave VAPID não disponível')
        return false
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.ready

      // Criar subscription
      const vapidKey = urlBase64ToUint8Array(vapidRes.publicKey)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey as BufferSource
      })

      // Enviar subscription para o backend
      const subJson = subscription.toJSON()
      await apiPost('/v1/push/subscribe', {
        subscription: {
          endpoint: subJson.endpoint,
          keys: subJson.keys
        },
        deviceType: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop'
      })

      setIsSubscribed(true)
      updatePreferences({ enabled: true })
      console.log('✅ Inscrito para push notifications')
      return true
    } catch (error) {
      console.error('Erro ao inscrever para push:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [isSupported, permission])

  const unsubscribeFromPush = useCallback(async (): Promise<boolean> => {
    setLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        await apiDelete('/v1/push/unsubscribe', { endpoint: subscription.endpoint })
      }

      setIsSubscribed(false)
      updatePreferences({ enabled: false })
      console.log('✅ Desinscrito de push notifications')
      return true
    } catch (error) {
      console.error('Erro ao desinscrever de push:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

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
          icon: '/logo_fundo.png',
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

    await showNotification('💰 Pagamento Recebido', {
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

    await showNotification('✅ Saque Realizado', {
      body: description || `Sua transferência de R$ ${(amount / 100).toFixed(2).replace('.', ',')} foi realizado`,
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
    isSubscribed,
    loading,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    updatePreferences,
    showNotification,
    notifyPaymentReceived,
    notifyWithdrawCompleted,
  }
}

// Helper function para converter VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

