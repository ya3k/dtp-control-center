'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import useNotifications from '@/hooks/useNotifications';
import { toast } from 'sonner';

const NotificationDebugger = () => {
  const { token, isTokenFound, refreshToken } = useNotifications();
  const [vapidKey, setVapidKey] = useState<string | null>(null);
  
  // Get VAPID key from environment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVapidKey(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || null);
    }
  }, []);

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      toast.success('FCM token copied to clipboard');
    }
  };

  const testLocalNotification = () => {
    try {
      if (Notification.permission !== 'granted') {
        toast.error('Notification permission not granted');
        return;
      }
      
      // Create and show a test notification
      const notification = new Notification('Test Notification', {
        body: 'This is a test notification from the browser API',
        icon: '/images/binhdinhtour.png'
      });
      
      notification.onclick = () => {
        console.log('Notification clicked');
        notification.close();
      };
      
      toast.success('Test notification sent');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  return (
    <div className="p-4 space-y-6 border rounded-lg">
      <h2 className="text-xl font-semibold">FCM Notification Debugger</h2>
      
      <div className="space-y-4">
        <div className="flex items-start gap-2">
          <div className={`mt-1 w-3 h-3 rounded-full ${isTokenFound ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <h3 className="font-medium">FCM Status: {isTokenFound ? 'Token Available' : 'No Token'}</h3>
            <p className="text-sm text-muted-foreground">
              {isTokenFound 
                ? 'Firebase Cloud Messaging is configured correctly' 
                : 'FCM token could not be obtained. Check console for errors.'}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">VAPID Key Status</h3>
          <p className="text-sm text-muted-foreground">
            {vapidKey 
              ? 'VAPID key is configured' 
              : 'VAPID key is missing. Add it to your environment variables.'}
          </p>
        </div>
        
        {token && (
          <div className="space-y-2">
            <h3 className="font-medium">FCM Token</h3>
            <div className="flex gap-2">
              <Textarea 
                readOnly 
                value={token} 
                className="h-20 text-xs font-mono" 
              />
            </div>
            <Button size="sm" onClick={handleCopyToken}>
              Copy Token
            </Button>
            <p className="text-xs text-muted-foreground">
              Use this token in Firebase Console to send a test notification
            </p>
          </div>
        )}
        
        <div className="space-y-2">
          <h3 className="font-medium">Test Browser Notification</h3>
          <Button 
            onClick={testLocalNotification}
            variant="outline"
          >
            Send Test Browser Notification
          </Button>
          <p className="text-xs text-muted-foreground">
            Tests if browser notifications work (independent of Firebase)
          </p>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">Refresh FCM Token</h3>
          <Button 
            onClick={() => refreshToken()}
            variant="outline"
          >
            Refresh Token
          </Button>
          <p className="text-xs text-muted-foreground">
            Try this if you&apos;re not receiving notifications
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationDebugger; 