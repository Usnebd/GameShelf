import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

if (!("Notification" in window)) {
  alert("This browser does not support desktop notification");
} else if (Notification.permission === "granted") {
  var notification = new Notification("Hello!", {
    lang: "en",
    body: "Testo della notifica",
    icon: "icon_url.png",
    vibrate: [200, 100, 200], //200ms pausa, 200ms,
    image: "imgurl",
  });
} else if (Notification.permission !== "denied") {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const notification = new Notification("Hi there!");
      //
    }
  });
}
