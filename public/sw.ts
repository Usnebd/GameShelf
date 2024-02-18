import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;
self.skipWaiting();
cleanupOutdatedCaches();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new CacheFirst({
    cacheName: "google-fonts-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
// Configura la caching per le Google Fonts static
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "gstatic-fonts-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
registerRoute(
  /\/images\/.*\.(png|jpg|webp|avif|svg)$/,
  new CacheFirst({
    cacheName: "api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 365 * 24 * 60 * 60,
      }),
    ],
  })
);
registerRoute(
  ({ request }) => request.mode === "navigate",
  async (event) => {
    const fetchEvent = event as unknown as FetchEvent;
    try {
      const response = await fetch(fetchEvent.request);
      return response || fetch(fetchEvent.request);
    } catch (error) {
      console.error("Errore durante il fetch:", error);
      const offlineResponse = await caches.match("/assets/offline.html");
      if (offlineResponse) {
        return offlineResponse;
      } else {
        return new Response("Offline Page", {
          headers: { "Content-Type": "text/html" },
        });
      }
    }
  }
);
