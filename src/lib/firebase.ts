import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging, MessagePayload } from 'firebase/messaging';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCpEs47b7g-rSiv5r3flXVkch4OdA46pSM",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dtp-bd-f7e16.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dtp-bd-f7e16",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dtp-bd-f7e16.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "44990674131",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:44990674131:web:2297cc3267178d370f9026",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-E3XSSH03WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
let messaging: Messaging | null = null;

// Initialize messaging only on client side
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
    console.log('Firebase messaging initialized successfully');
  } catch (error) {
    console.error('Firebase messaging error:', error);
  }
}

// Request permission and get token for FCM
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) return null;
    
    // Check if notification permission is already denied
    if (Notification.permission === 'denied') {
      console.log('Notifications are blocked. Please enable them in your browser settings.');
      alert('Notifications are blocked. Please enable them in your browser settings and reload the page.');
      return null;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Get registration token
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      
      if (!vapidKey) {
        console.error('VAPID key is required for FCM. Please provide NEXT_PUBLIC_FIREBASE_VAPID_KEY');
        return null;
      }
      
      const token = await getToken(messaging, {
        vapidKey,
      });
      
      console.log('FCM Token:', token);
      return token;
    } else if (permission === 'denied') {
      console.log('Notification permission denied by user');
      alert('You need to allow notifications to receive important updates. Please enable notifications in your browser settings and reload the page.');
    } else {
      console.log('Notification permission dismissed');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

// Handle foreground messages
export const onMessageListener = () => {
  return new Promise<MessagePayload | null>((resolve) => {
    if (!messaging) {
      console.log('Messaging not initialized, cannot set up onMessage listener');
      resolve(null);
      return;
    }
    
    console.log('Setting up onMessage listener...');
    
    // Set up the onMessage handler
    onMessage(messaging, (payload) => {
      console.log('Received foreground message:', payload);
      resolve(payload);
    });
  });
};

export { app, messaging }; 