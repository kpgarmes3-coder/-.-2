const CACHE_NAME = 'bang-fai-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/42854.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&family=Kanit:wght@400;600;700;900&display=swap'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            // โหลดจากแคชถ้าเจอ ถ้าไม่เจอให้โหลดจากอินเทอร์เน็ต
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
