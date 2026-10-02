const CACHE_NAME = 'bang-fai-v3-secure';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700;800&family=Kanit:wght@400;600;700;900&display=swap'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    );
});

// ล้าง Cache เก่าออกเมื่อมีการอัปเดตเวอร์ชัน
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
    // ป้องกันปัญหา request schema ที่ไม่รองรับ (เช่น chrome-extension://)
    if (event.request.url.startsWith('http')) {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                // ถ้ามีข้อมูลใน Cache ให้ใช้เลย (Offline First)
                if (response) return response;
                
                // ถ้าไม่มี ให้โหลดผ่าน Network
                return fetch(event.request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        // เก็บ Cache ไว้ใช้ครั้งต่อไป
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                }).catch(() => {
                    // กรณี Offline และไม่มี Cache
                    console.log('Network request failed and no cache available');
                });
            })
        );
    }
});
