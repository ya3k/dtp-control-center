'use client';

import { useEffect } from 'react';
import { initFirebaseServiceWorker } from '@/lib/firebase-sw-init';
import FCMNotification from './FCMNotification';

const FirebaseInit = () => {
  useEffect(() => {
    // Initialize Firebase service worker
    initFirebaseServiceWorker();
  }, []);

  return <FCMNotification />;
};

export default FirebaseInit; 