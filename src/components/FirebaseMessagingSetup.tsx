'use client';

import { firebaseConfig } from '@/firebase';
import { useEffect } from 'react';

export default function FirebaseMessagingSetup() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', {
          scope: '/firebase-cloud-messaging-push-scope',
        })
        .then((registration) => {
          console.log('[Client] SW registered:', registration);

          const sendConfig = () => {
            registration.active?.postMessage({
              type: 'FIREBASE_CONFIG',
              config: firebaseConfig,
            });
          };

          if (registration.active) {
            sendConfig();
          } else {
            navigator.serviceWorker.ready.then(() => {
              sendConfig();
            });
          }
        })
        .catch((err) => {
          console.error('SW registration failed:', err);
        });
    }
  }, []);

  return null;
}
