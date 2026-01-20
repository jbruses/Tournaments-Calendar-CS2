const CACHE_NAME = 'cs2-cal-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './js/main.js',
  './js/ui.js',
  './js/tournaments.js',
  './js/utils.js',
  './js/calendar.js',
  './js/highlights.js',
  'https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js',
  'https://cdn.tailwindcss.com'
];

// 1. Instalación: Guardamos los archivos en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activación: Limpiamos cachés viejas si actualizamos la versión
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// 3. Fetch: Servimos desde caché, si no hay, vamos a internet
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en caché, lo devolvemos
      if (response) {
        return response;
      }
      // Si no, lo pedimos a la red
      return fetch(event.request);
    })
  );
});