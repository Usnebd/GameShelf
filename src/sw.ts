import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

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
          const bodyText = `Your order is ready: ${element.hour
            .toString()
            .padStart(2, "0")}:${element.minute
            .toString()
            .padStart(2, "0")}\n${buildOrderText(element.order.prodotti)}`;
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
  setInterval(checkExactHour, 45000);
});

self.addEventListener("message", (event) => {
  const hour: number = event.data.hour;
  const minute: number = event.data.minute - 1;
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
