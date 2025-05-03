'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import useNotifications from '@/hooks/useNotifications';

const FCMNotification = () => {
  const { notification, isTokenFound, token } = useNotifications();

  // Log FCM status on mount
  useEffect(() => {
    console.log('FCMNotification mounted, FCM status:', { 
      isTokenFound, 
      tokenAvailable: !!token,
      tokenValue: token ? token.substring(0, 15) + '...' : 'no token' 
    });
  }, [isTokenFound, token]);

  // Handle notification display
  useEffect(() => {
    if (notification) {
      console.log('FCMNotification: Displaying notification:', notification);
      
      // Show notification as toast
      toast(notification.title, {
        description: notification.body,
        position: 'top-left',
        duration: 5000,
      });
      
      // Also try showing a native notification as fallback
      try {
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.body,
            icon: '/images/binhdinhtour.png'
          });
        }
      } catch (error) {
        console.error('Error showing native notification:', error);
      }
    }
  }, [notification]);

  return null; // This component doesn't render anything
};

export default FCMNotification; 