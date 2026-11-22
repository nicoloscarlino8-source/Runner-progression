// Service worker: rende la tessera disponibile anche con connessione scarsa.
// Gestisce solo i file del sito: le chiamate al database vanno sempre in rete.
const CACHE = "pradio-tessera-v2";
const ASSETS = [
  "./",
  "index.html",
  "cassa.html",
  "privacy.html",
  "style.css",
  "config.js",
  "api.js",
  "vendor/qrcode.js",
  "vendor/supabase.js",
  "vendor/jsQR.js",
  "logo.png",
  "manifest.webmanifest",
  "manifest-cassa.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Rete prima (così si vede sempre l'ultima versione), cache se offline
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request, { ignoreSearch: true }).then((r) =>
          r || (e.request.mode === "navigate" ? caches.match("index.html") : Response.error())
        )
      )
  );
});
