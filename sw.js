const CACHE_NAME = 'zakroczym-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalacja i cache'owanie plików
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Otwarto cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Strategia: Cache First (Najpierw pamięć, potem sieć)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jeśli plik jest w cache, zwróć go
      if (response) {
        return response;
      }
      // Jeśli nie ma, pobierz z sieci
      return fetch(event.request);
    })
  );
});

// Aktualizacja cache (czyszczenie starych wersji)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});