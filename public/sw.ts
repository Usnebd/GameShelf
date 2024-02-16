import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";

declare let self: ServiceWorkerGlobalScope;
self.skipWaiting();
clientsClaim();
precacheAndRoute(self.__WB_MANIFEST);

let notifications: {
  hour: number;
  minute: number;
  order: { prodotti: { nome: string; quantità: number }[] };
  nota: string;
}[] = [];

self.addEventListener("activate", () => {
  const buildOrderText = (prodotti: { nome: string; quantità: number }[]) => {
    const orderStrings = prodotti.map((item) => {
      return `${item.quantità}x ${item.nome}`;
    });
    return orderStrings.join("\n");
  };
  const checkExactHour = () => {
    if (notifications.length > 0) {
      if (
        new Date().getHours() === notifications[0].hour &&
        new Date().getMinutes() === notifications[0].minute
      ) {
        const element = notifications.shift();
        if (element) {
          const bodyText = `Your order is ready:\n${buildOrderText(
            element.order.prodotti
          )}`;
          const title = "MyChiosco";
          const options = {
            body:
              element.nota == ""
                ? bodyText
                : bodyText + `\nNote: ${element.nota}`,
            icon: "/assets/pwa-192x192.png",
            vibrate: [200, 100, 200], //200ms pausa, 200ms,
          };
          self.registration.showNotification(title, options);
        }
      } else if (new Date().getHours() >= notifications[0].hour) {
        if (new Date().getMinutes() > notifications[0].minute) {
          const element = notifications.shift();
          if (element) {
            const bodyText = `Your order is ready:\n${buildOrderText(
              element.order.prodotti
            )}`;
            const title = "MyChiosco";
            const options = {
              body:
                element.nota == ""
                  ? bodyText
                  : bodyText + `\nNote: ${element.nota}`,
              icon: "/assets/pwa-192x192.png",
              vibrate: [200, 100, 200], //200ms pausa, 200ms,
            };
            self.registration.showNotification(title, options);
          }
        }
      }
    }
  };
  setInterval(checkExactHour, 50000);
});

self.addEventListener("message", (event) => {
  const hour: number = event.data.hour;
  const minute: number = event.data.minute;
  const order = event.data.order;
  const nota: string = event.data.nota;
  if (
    hour !== undefined &&
    nota !== undefined &&
    order !== undefined &&
    minute !== undefined
  ) {
    notifications.push({ hour, minute, order, nota });
  }
});

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
  /\.(?:html|js|css|png|jpg|webp|avif|svg)$/,
  new CacheFirst({
    cacheName: "static-assets",
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
      const offlineResponse = await caches.match("/offline.html");
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
