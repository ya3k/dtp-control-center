 'use client';

import { useEffect, useState } from 'react';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const NotificationDemo = () => {
  const { token, isTokenFound, notification } = useNotifications();
  const [tokenSaved, setTokenSaved] = useState(false);

  useEffect(() => {
    // When notification is received
    if (notification) {
      toast('New notification received', {
        description: `${notification.title}: ${notification.body}`,
      });
    }
  }, [notification]);

  // Function to save FCM token to your backend
  const saveTokenToServer = async () => {
    if (!token) return;
    
    try {
      // Example API call to save token
      // const response = await fetch('/api/save-fcm-token', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ token }),
      // });
      
      // For demo purposes, just simulate success
      console.log('Token would be saved to server:', token);
      setTokenSaved(true);
      toast.success('Notification token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
      toast.error('Failed to save notification token');
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isTokenFound ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>
            {isTokenFound 
              ? 'Notifications are enabled' 
              : 'Notifications are not enabled'}
          </span>
        </div>
        
        {isTokenFound && !tokenSaved && (
          <Button onClick={saveTokenToServer}>
            Save Notification Settings
          </Button>
        )}
        
        {!isTokenFound && (
          <Button onClick={() => window.location.reload()}>
            Enable Notifications
          </Button>
        )}
        
        {tokenSaved && (
          <p className="text-sm text-green-600">
            You will now receive notifications from our application!
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationDemo; 