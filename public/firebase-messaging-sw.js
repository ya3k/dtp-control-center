// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.0/firebase-messaging-compat.js');

let messaging = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    try {
      firebase.initializeApp(event.data.config);
      messaging = firebase.messaging();

      // ✅ Handle background message
      messaging.onBackgroundMessage((payload) => {
        console.log('[Service Worker] Received background message:', payload);
        const { title, body, image, ...restPayload } = payload?.data;
        const notificationOptions = {
          body,
          icon: image || '/icon.png',
          data: restPayload,
        };
        self.registration.showNotification(title, notificationOptions);
      });

    } catch (e) {
      console.error('Firebase init failed:', e);
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link;
  if (link) {
    event.waitUntil(clients.openWindow(link));
  }
});
