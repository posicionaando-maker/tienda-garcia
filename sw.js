const CACHE_NAME = 'garcia-tienda-v1';
const urlsToCache = [
    './',
    './index.html',
    './carrito.html',
    './css/style.css',
    './js/app.js',
    './js/carrito.js',
    './js/db.js',
    './manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

// Activar Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
        .then(() => self.clients.claim())
    );
});

// Interceptar solicitudes
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si está en caché, devolverlo
                if (response) {
                    return response;
                }
                
                // Si no, hacer fetch y guardar en caché
                return fetch(event.request)
                    .then(response => {
                        // No cachear si no es exitoso
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    })
                    .catch(() => {
                        // Si offline y no está en caché, mostrar página offline
                        if (event.request.destination === 'document') {
                            return caches.match('./');
                        }
                        return new Response('Offline', { status: 503 });
                    });
            })
    );
});
