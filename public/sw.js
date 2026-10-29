const CACHE_NAME = 'village-ia-pwa-v3'
const IS_LOCALHOST =
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1'

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/assets/logo-crown.png',
  '/assets/pwa-icon-192.png',
  '/assets/pwa-icon-512.png',
  '/assets/apple-touch-icon.png',
  '/assets/village-map-clean.png',
  '/assets/mask-spirit-gold.png',
  '/assets/mask-spirit-purple.png',
  '/assets/mask-spirit-green.png',
  '/assets/char-king-clean.png',
  '/assets/griot-runner-clean.png',
  '/assets/char-researcher-clean.png',
  '/assets/char-notary-clean.png',
  '/assets/char-developer-clean.png',
  '/assets/char-creative-clean.png',
  '/assets/char-advisor-clean.png'
]

self.addEventListener('install', event => {
  self.skipWaiting()
  if (IS_LOCALHOST) {
    return
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // Ignore individual asset failure during install
      })
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys.map(key => {
            if (IS_LOCALHOST || key !== CACHE_NAME) {
              return caches.delete(key)
            }
            return Promise.resolve()
          })
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  // En développement local (localhost), laisser le navigateur et Vite HMR gérer 100% des requêtes directement
  if (IS_LOCALHOST) {
    return
  }

  const { request } = event

  // Ne jamais mettre en cache les requêtes non-GET (ex: appels API vers les LLM)
  if (request.method !== 'GET') {
    return
  }

  const url = new URL(request.url)

  // Ne mettre en cache que les ressources de même origine et ignorer les fichiers de dev Vite HMR et routes API
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/@') ||
    url.pathname.startsWith('/src/') ||
    url.pathname.startsWith('/node_modules/')
  ) {
    return
  }

  // Navigation HTML : Réseau d'abord, puis repli sur le cache en mode hors-ligne
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put('/index.html', clone))
          return response
        })
        .catch(() =>
          caches.match('/index.html').then(
            cached => cached || new Response('Hors ligne', { status: 503, statusText: 'Offline' })
          )
        )
    )
    return
  }

  // Assets statiques (images, icônes, bundles de production) : Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const networkFetch = fetch(request)
        .then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseClone = networkResponse.clone()
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone))
          }
          return networkResponse
        })
        .catch(
          () =>
            cachedResponse ||
            new Response('', { status: 504, statusText: 'Gateway Timeout' })
        )

      return cachedResponse || networkFetch
    })
  )
})

