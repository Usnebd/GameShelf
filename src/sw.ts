import { precacheAndRoute } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

self.skipWaiting();
clientsClaim();

self.addEventListener("message", (event) => {
  const hour: number = event.data.hour;
  const minute: number = event.data.minute;
  const order = event.data.order;
  const nota: string = event.data.nota;
  // Funzione per controllare se è l'ora esatta
  const isExactHour = () => {
    const now = new Date();
    return now.getHours() === hour && now.getMinutes() === minute;
  };

  const checkExactHour = setInterval(() => {
    if (isExactHour()) {
      clearInterval(checkExactHour); // Interrompi il controllo
      const bodyText = `Your order is ready: ${hour
        .toString()
        .padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}\n${buildOrderText(order.prodotti)}`;
      sendNotification(nota == "" ? bodyText : bodyText + `\nNote: ${nota}`);
    }
  }, 50000);
});

const sendNotification = (messageBody: string) => {
  const title = "MyChiosco";
  const options = {
    body: messageBody,
    icon: "/assets/pwa-192x192.png",
    vibrate: [200, 100, 200], //200ms pausa, 200ms,
  };

  self.registration.showNotification(title, options);
};

const buildOrderText = (prodotti: { nome: string; quantità: number }[]) => {
  const orderStrings = prodotti.map((item) => {
    return `${item.quantità}x ${item.nome}`;
  });
  return orderStrings.join("\n");
};

// Controlla ogni minuto se è l'ora esatta
