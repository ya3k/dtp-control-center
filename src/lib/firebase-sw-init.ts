export const initFirebaseServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    console.log('Attempting to register Firebase service worker...');
    
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        // Pass environment variables to the service worker
        const serviceWorker = registration.installing || registration.waiting || registration.active;
        
        if (serviceWorker) {
          console.log('Service worker state:', serviceWorker.state);
          
          // Define Firebase config in the service worker scope with fallback values
          const firebaseConfig = {
            FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCpEs47b7g-rSiv5r3flXVkch4OdA46pSM",
            FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dtp-bd-f7e16.firebaseapp.com",
            FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dtp-bd-f7e16",
            FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dtp-bd-f7e16.firebasestorage.app",
            FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "44990674131",
            FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:44990674131:web:2297cc3267178d370f9026"
          };
          
          console.log('Sending Firebase config to service worker:', {
            ...firebaseConfig,
            // Mask sensitive data in logs
            FIREBASE_API_KEY: firebaseConfig.FIREBASE_API_KEY ? '***' : 'missing',
            FIREBASE_APP_ID: firebaseConfig.FIREBASE_APP_ID ? '***' : 'missing'
          });
          
          serviceWorker.postMessage({
            type: 'FIREBASE_CONFIG',
            config: firebaseConfig
          });
        } else {
          console.error('No active service worker found');
        }
        
        console.log('Firebase Service Worker registered successfully:', registration.scope);
      })
      .catch((err) => {
        console.error('Firebase Service Worker registration failed:', err);
      });
      
    // Make sure we can receive messages
    if ('PushManager' in window) {
      console.log('Push messaging is supported by this browser');
    } else {
      console.warn('Push messaging is NOT supported by this browser');
    }
    
    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received message from service worker:', event.data);
    });
  } else {
    console.error('Service workers are not supported in this browser or environment');
  }
}; 