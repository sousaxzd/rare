// Service Worker para Vision Wallet
const CACHE_NAME = 'vision-wallet-v1'
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/deposit',
  '/dashboard/transfer',
]

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    })
  )
  self.skipWaiting()
})

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  return self.clients.claim()
})

// Interceptar requisições
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    })
  )
})

// Receber mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Notificações push
self.addEventListener('push', (event) => {
  console.log('[SW] Push recebido:', event)

  let data = {
    title: 'Vision Wallet',
    body: 'Nova notificação',
    icon: '/logo_fundo.png',
    badge: '/logo_fundo.png',
    tag: 'vision-notification',
    data: {}
  }

  if (event.data) {
    try {
      const payload = event.data.json()
      data = { ...data, ...payload }
    } catch (e) {
      data.body = event.data.text()
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo_fundo.png',
    badge: data.badge || '/logo_fundo.png',
    tag: data.tag || 'vision-notification',
    requireInteraction: data.requireInteraction || true,
    vibrate: [200, 100, 200, 100, 200], // Vibrar no mobile
    data: data.data || {},
    actions: [
      { action: 'open', title: '📱 Abrir' },
      { action: 'close', title: '❌ Fechar' }
    ],
    // Mostrar mesmo se app estiver em foco
    silent: false,
    renotify: true
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Clique na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const urlToOpen = event.notification.data?.url || '/dashboard'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se já existe uma janela aberta, focar nela
      for (let client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      // Caso contrário, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

