'use client';

import { useEffect } from 'react';
import { getMessaging, onMessage } from 'firebase/messaging';
import firebaseApp from '@/firebase';
import useFcmToken from '@/hooks/useFCMToken';
import { toast } from 'sonner';

export default function FcmTokenComp() {
  const { token, notificationPermissionStatus } = useFcmToken();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      if (notificationPermissionStatus === 'granted') {
        const messaging = getMessaging(firebaseApp);

        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground push notification received:', JSON.stringify(payload));

          // Based on the actual payload structure you're receiving
          // The notification content is in payload.data
          const title = payload.data?.title || 'Thông báo mới';
          const body = payload.data?.body || 'Bạn vừa nhận được thông báo.';

          console.log('Showing toast with:', { title, body });

          // toast.custom(() => (
          //   <div className="bg-teal-50 border border-gray-200 shadow-lg rounded-xl p-4 w-[280px]">
          //     <h4 className="text-sm font-semibold text-black">{title}</h4>
          //     <p className="text-sm text-gray-600 mt-1">{body}</p>
          //   </div>
          // ));

          toast.info(title)

      });

  return () => {
    unsubscribe(); // Clean up the listener
  };
}
    }
  }, [notificationPermissionStatus, toast]);

console.log('FCM Token:', token); // Log token for debugging

return null; // Component này không render UI, chỉ xử lý logic notification
}
