// sw.js – cache shell PWA (v6)
const CACHE = "rent-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-180.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res ||
      fetch(req).then(net => {
        if (req.method === "GET" && new URL(req.url).origin === location.origin) {
          const copy = net.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return net;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
