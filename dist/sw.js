/* ขับต่อ service worker — ทำให้ติดตั้งเป็นแอปได้และเปิดได้ตอนออฟไลน์
   เวอร์ชันถูกแทนที่ตอน build ทุกครั้ง แอปที่ติดตั้งแล้วจะอัปเดตเอง */
const VERSION = "20261111002233";
const STATIC = "kt-static-" + VERSION;
const PAGES = "kt-pages-" + VERSION;
const PHOTOS = "kt-photos-v1";
const PRECACHE = ["/", "/offline.html", "/assets/style.css", "/assets/site.js", "/assets/app.js", "/manifest.webmanifest", "/icons/icon-192.png", "/favicon.svg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(STATIC).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== STATIC && k !== PAGES && k !== PHOTOS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function trim(cacheName, max) {
  const c = await caches.open(cacheName);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i]);
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;                       // Google, ฟอนต์, Analytics ไปตามปกติ
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/admin")) return; // ข้อมูลสด ไม่เก็บแคช

  // หน้าเว็บ: เอาจากเน็ตก่อน ถ้าออฟไลน์ใช้ที่เคยเปิด หรือหน้าออฟไลน์
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) { const c = await caches.open(PAGES); c.put(req, res.clone()); trim(PAGES, 40); }
        return res;
      } catch (err) {
        return (await caches.match(req, { ignoreSearch: true })) || (await caches.match("/offline.html"));
      }
    })());
    return;
  }

  // รูปประกาศ: ไม่เปลี่ยนแปลง ใช้แคชก่อน
  if (url.pathname.startsWith("/p/")) {
    e.respondWith(caches.open(PHOTOS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) { c.put(req, res.clone()); trim(PHOTOS, 150); }
      return res;
    }));
    return;
  }

  // CSS, JS, ไอคอน, รูปแชร์: ใช้แคชทันทีแล้วอัปเดตเบื้องหลัง
  e.respondWith(caches.open(STATIC).then(async c => {
    const hit = await c.match(req);
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
    return hit || net;
  }));
});
