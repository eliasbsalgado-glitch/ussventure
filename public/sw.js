// ============================================
// SERVICE WORKER — Frota Venture PWA
// Cache estrategico + Push Notifications
// ============================================

const CACHE_NAME = 'venture-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install — pre-cache arquivos essenciais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — Network first, cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// ============================================
// PUSH NOTIFICATIONS
// ============================================

// Receber push notification
self.addEventListener('push', (event) => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.body || '',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/',
      },
      actions: [
        { action: 'open', title: 'Abrir' },
      ],
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Frota Venture', options)
    );
  } catch (err) {
    // Fallback para texto simples
    event.waitUntil(
      self.registration.showNotification('Frota Venture', {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
      })
    );
  }
});

// Clicar na notificacao — abrir o site
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Se ja tem uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url.includes('frotaventure') && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Senao, abrir nova janela
      return clients.openWindow(url);
    })
  );
});
