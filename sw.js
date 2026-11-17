// Сначала сеть (чтобы обновления приходили сразу), без интернета — сохранённая копия.
const CACHE = "finance-v12";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png",
  "./ic/assistant.webp", "./ic/bills.webp", "./ic/buy.webp", "./ic/c-cafe.webp", "./ic/c-food.webp", "./ic/c-habit.webp", "./ic/c-snack.webp", "./ic/c-fun.webp", "./ic/c-health.webp", "./ic/c-home.webp", "./ic/c-other.webp", "./ic/c-shop.webp", "./ic/c-transport.webp", "./ic/capital.webp", "./ic/days.webp", "./ic/debts.webp", "./ic/deposit.webp", "./ic/incomes.webp", "./ic/settings.webp", "./ic/stash.webp", "./ic/stats.webp", "./ic/summary.webp"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
