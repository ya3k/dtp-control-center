// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Log when service worker is loaded
console.log('[firebase-messaging-sw.js] Service worker loaded');

// Add event listener for activation at the top level
self.addEventListener('activate', () => {
  console.log('[firebase-messaging-sw.js] Service worker activated');
});

// Define variables to hold Firebase config
self.FIREBASE_API_KEY = '';
self.FIREBASE_AUTH_DOMAIN = '';
self.FIREBASE_PROJECT_ID = '';
self.FIREBASE_STORAGE_BUCKET = '';
self.FIREBASE_MESSAGING_SENDER_ID = '';
self.FIREBASE_APP_ID = '';

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  console.log('[firebase-messaging-sw.js] Message received from main thread', event.data?.type);
  
  if (event.data && event.data.type === 'FIREBASE_CONFIG') {
    const config = event.data.config;
    self.FIREBASE_API_KEY = config.FIREBASE_API_KEY;
    self.FIREBASE_AUTH_DOMAIN = config.FIREBASE_AUTH_DOMAIN;
    self.FIREBASE_PROJECT_ID = config.FIREBASE_PROJECT_ID;
    self.FIREBASE_STORAGE_BUCKET = config.FIREBASE_STORAGE_BUCKET;
    self.FIREBASE_MESSAGING_SENDER_ID = config.FIREBASE_MESSAGING_SENDER_ID;
    self.FIREBASE_APP_ID = config.FIREBASE_APP_ID;
    
    // Notify main thread that config was received
    event.source.postMessage({
      type: 'FIREBASE_CONFIG_RECEIVED',
      status: 'success'
    });
    
    // Initialize Firebase with the received config
    console.log('[firebase-messaging-sw.js] Received Firebase config, initializing...');
    initializeFirebase();
  }
});

function initializeFirebase() {
  // Initialize the Firebase app in the service worker
  const firebaseConfig = {
    apiKey: self.FIREBASE_API_KEY,
    authDomain: self.FIREBASE_AUTH_DOMAIN,
    projectId: self.FIREBASE_PROJECT_ID,
    storageBucket: self.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
    appId: self.FIREBASE_APP_ID,
  };

  // Validate config
  if (!self.FIREBASE_API_KEY || !self.FIREBASE_PROJECT_ID) {
    console.error('[firebase-messaging-sw.js] Firebase configuration is incomplete');
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'FIREBASE_ERROR',
          error: 'Configuration incomplete'
        });
      });
    });
    return;
  }

  try {
    // Check if Firebase is already initialized
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      console.log('[firebase-messaging-sw.js] Firebase initialized successfully');
    }

    // Retrieve an instance of Firebase Messaging
    const messaging = firebase.messaging();
    console.log('[firebase-messaging-sw.js] Firebase Messaging initialized');

    // Handle background messages
    messaging.onBackgroundMessage(function(payload) {
      console.log('[firebase-messaging-sw.js] Received background message:', payload);

      try {
        const notificationTitle = payload.notification?.title || 'New Notification';
        const notificationOptions = {
          body: payload.notification?.body || 'You have a new notification',
          icon: '/images/binhdinhtour.png',
          badge: '/images/binhdinhtour.png',
          data: payload.data
        };

        self.registration.showNotification(notificationTitle, notificationOptions)
          .then(() => {
            console.log('[firebase-messaging-sw.js] Notification displayed successfully');
          })
          .catch(error => {
            console.error('[firebase-messaging-sw.js] Error showing notification:', error);
          });
      } catch (error) {
        console.error('[firebase-messaging-sw.js] Error processing notification:', error);
      }
    });

    // Notify main thread that Firebase is initialized
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'FIREBASE_INITIALIZED',
          status: 'success'
        });
      });
    });
  } catch (error) {
    console.error('[firebase-messaging-sw.js] Error initializing Firebase:', error);
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'FIREBASE_ERROR',
          error: error.message
        });
      });
    });
  }
} 