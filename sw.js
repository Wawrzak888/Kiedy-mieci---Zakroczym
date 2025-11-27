// ZMIANA WERSJI NA V2 WYMUSI POBRANIE NOWEGO INDEX.HTML
const CACHE_NAME = 'zakroczym-v2'; 

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalacja i cache'owanie plików
self.addEventListener('install', (event) => {
  self.skipWaiting(); // NOWOŚĆ: Zmusza nowy serwis worker do natychmiastowego przejęcia kontroli
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Otwarto cache v2');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Strategia: Cache First (Najpierw pamięć, potem sieć)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

// Aktualizacja cache (czyszczenie starych wersji v1)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Usuwanie starego cache:', cacheName);
            return caches.delete(cacheName); // Usuwa v1
          }
        })
      );
    })
  );
  self.clients.claim(); // Przejmij kontrolę nad wszystkimi otwartymi kartami
});
