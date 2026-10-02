const CACHE_NAME = 'meetang-timer-cache-v1';
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './42854.png'
];

// 1. ติดตั้งและแคชไฟล์ทั้งหมดเก็บไว้
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// 2. เปิดใช้งานและล้างแคชเก่า
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clientsClaim();
});

// 3. ดึงข้อมูลจากแคชมาแสดงผลทันทีเมื่อออฟไลน์
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        // กรณีไม่มีเน็ตและไม่มีในแคช ให้แสดงหน้า index สำรอง
        return caches.match('./index.html');
      });
    })
  );
});
