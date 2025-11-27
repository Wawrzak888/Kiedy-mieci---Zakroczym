// ZMIENIONO 'v1' na 'v2' -> TO WYMUSI AKTUALIZACJĘ NA TELEFONIE
const CACHE_NAME = 'zakroczym-v2'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalacja i wymuszenie przejęcia kontroli (skipWaiting)
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Kluczowe: Nowy SW aktywuje się od razu
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Czyszczenie starego cache (v1)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Usuwanie starej wersji:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Przejmij otwarte karty natychmiast
});
