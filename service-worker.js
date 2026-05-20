const CACHE_NAME = "home-study-room-v2";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./family-login.jpg",
  "./app-icon-180.png",
  "./app-icon-192.png",
  "./app-icon-512.png",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const responseClone = response.clone();

        if (request.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});

function getNotificationIcon() {
  return fetch("./app-icon-v2-192.png", { method: "HEAD" })
    .then((response) => (response.ok ? "./app-icon-v2-192.png" : "./app-icon-192.png"))
    .catch(() => "./app-icon-192.png");
}

self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    try {
      data = event.data.json();
    } catch (error) {
      data = {
        body: event.data.text(),
      };
    }
  }

  const title = data.title || "우리집 공부방";

  event.waitUntil(
    getNotificationIcon().then((icon) =>
      self.registration.showNotification(title, {
        body: data.body || "행복 우체통에 새 메시지가 도착했어요.",
        icon,
        badge: icon,
        data: {
          url: data.url || "./index.html",
        },
      })
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const studyRoomClient = clientList.find((client) =>
        client.url.startsWith(self.location.origin)
      );

      if (studyRoomClient) {
        return studyRoomClient.focus();
      }

      return self.clients.openWindow("./index.html");
    })
  );
});
