import { useState, useEffect, useCallback } from 'react';
import { requestNotificationPermission, onMessageListener } from '@/lib/firebase';

type Notification = {
  title: string;
  body: string;
};

// Define simplified MessagePayload type that aligns with Firebase's type
interface MessagePayload {
  notification?: {
    title?: string;
    body?: string;
    [key: string]: any;
  };
  data?: Record<string, string>;
  [key: string]: any;
}

export const useNotifications = (onTokenChange?: (token: string | null) => void) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isTokenFound, setIsTokenFound] = useState(false);

  // Create a memoized fetch token function
  const fetchToken = useCallback(async () => {
    try {
      const fcmToken = await requestNotificationPermission();
      
      if (fcmToken) {
        console.log('FCM token retrieved:', fcmToken.substring(0, 15) + '...');
        setToken(fcmToken);
        setIsTokenFound(true);
        
        // Call onTokenChange callback if provided
        if (onTokenChange) {
          onTokenChange(fcmToken);
        }
        
        return fcmToken;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }, [onTokenChange]);

  // Initial token fetch
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  // Listen for messages - improved implementation
  useEffect(() => {
    console.log('Setting up FCM message listener...');
    
    // This function sets up the message listener
    const setupMessageListener = async () => {
      try {
        // Wait for onMessageListener to be ready
        onMessageListener()
          .then((payload: any) => {
            console.log('FCM message received in hook:', payload);
            
            if (payload?.notification) {
              const newNotification = {
                title: payload.notification.title || 'New Notification',
                body: payload.notification.body || 'You have a new notification',
              };
              
              console.log('Setting notification state:', newNotification);
              setNotification(newNotification);
            } else {
              console.warn('Received FCM message without notification payload:', payload);
            }
          })
          .catch(err => {
            console.error('Error in FCM message listener:', err);
          });
          
        console.log('FCM message listener setup complete');
      } catch (error) {
        console.error('Failed to set up message listener:', error);
      }
    };
    
    // Set up the listener
    setupMessageListener();
    
    // No specific cleanup needed
    return () => {
      console.log('Cleaning up FCM message listener...');
    };
  }, []);

  // Listen for custom test events
  useEffect(() => {
    const handleTestNotification = (event: CustomEvent) => {
      console.log('Received custom test notification event:', event.detail);
      if (event.detail?.notification) {
        const testNotification = {
          title: event.detail.notification.title || 'Test Notification',
          body: event.detail.notification.body || 'This is a test notification',
        };
        setNotification(testNotification);
      }
    };

    // Add event listener for test notifications
    window.addEventListener('firebase-messaging-message', handleTestNotification as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('firebase-messaging-message', handleTestNotification as EventListener);
    };
  }, []);

  return { 
    notification, 
    token, 
    isTokenFound, 
    refreshToken: fetchToken 
  };
};

export default useNotifications; 