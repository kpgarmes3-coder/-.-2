const CACHE_NAME = 'bang-fai-offline-v4';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './42854.png',
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

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).catch(() => {
                // กรณีไม่มีเน็ตและเรียกหน้าเว็บหลัก ให้คืนค่า index.html จากแคช
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
