const CACHE_NAME = 'currency-converter-v1';
const urlsToCache = [
    '/currency-app/',
    '/currency-app/index.html',  // Changed from usdtoyen.html
    '/currency-app/icon-192x192.png',
    '/currency-app/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Add error handling for each file
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error('Failed to cache:', url, err);
              // Continue with other files even if one fails
              return Promise.resolve();
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).catch(error => {
          console.error('Fetch failed:', error);
          return new Response('Network error occurred', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
      })
  );
});