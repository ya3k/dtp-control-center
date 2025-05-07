import envConfig from '@/configs/envConfig';
import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
    apiKey: envConfig.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: envConfig.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: envConfig.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: envConfig.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envConfig.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: envConfig.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: envConfig.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;