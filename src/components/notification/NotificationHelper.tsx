'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import useNotifications from '@/hooks/useNotifications';

const NotificationHelper = () => {
  const [permissionState, setPermissionState] = useState<string>('');
  const { isTokenFound } = useNotifications();

  useEffect(() => {
    // Check current permission state
    setPermissionState(Notification.permission);
  }, []);

  const openBrowserSettings = () => {
    // Detect browser and provide appropriate instructions
    const isChrome = navigator.userAgent.indexOf("Chrome") > -1;
    const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
    const isEdge = navigator.userAgent.indexOf("Edg") > -1;
    
    let instructions = '';
    
    if (isChrome) {
      instructions = 'Chrome: Click the lock icon in the address bar → Notifications → Allow';
    } else if (isFirefox) {
      instructions = 'Firefox: Click the shield icon in the address bar → Permissions → Notifications → Allow';
    } else if (isEdge) {
      instructions = 'Edge: Click the lock icon in the address bar → Notifications → Allow';
    } else {
      instructions = 'Please check your browser settings to allow notifications for this site';
    }
    
    alert(`To enable notifications: ${instructions}\n\nAfter changing settings, please refresh this page.`);
  };

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermissionState(result);
      
      if (result === 'granted') {
        // Refresh the page to initialize FCM
        window.location.reload();
      } else if (result === 'denied') {
        openBrowserSettings();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
      
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              permissionState === 'granted' ? 'bg-green-500' :
              permissionState === 'denied' ? 'bg-red-500' : 'bg-yellow-500'
            }`} 
          />
          <span>
            {permissionState === 'granted' ? 'Notifications are enabled' :
             permissionState === 'denied' ? 'Notifications are blocked' : 
             'Notification permission not set'}
          </span>
        </div>
        
        {permissionState === 'denied' && (
          <div className="bg-red-50 p-3 rounded border border-red-200">
            <p className="text-sm text-red-700 mb-2">
              Notifications are currently blocked by your browser.
            </p>
            <Button 
              variant="outline" 
              onClick={openBrowserSettings}
              className="bg-white hover:bg-red-50"
            >
              How to enable notifications
            </Button>
          </div>
        )}
        
        {permissionState === 'default' && (
          <div className="space-y-2">
            <p className="text-sm">
              Enable notifications to receive important updates and alerts.
            </p>
            <Button onClick={requestPermission}>
              Enable Notifications
            </Button>
          </div>
        )}
        
        {permissionState === 'granted' && !isTokenFound && (
          <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
            <p className="text-sm text-yellow-700 mb-2">
              Notifications are enabled, but the messaging token was not generated.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="bg-white hover:bg-yellow-50"
            >
              Retry
            </Button>
          </div>
        )}
        
        {permissionState === 'granted' && isTokenFound && (
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <p className="text-sm text-green-700">
              You will receive notifications from our application.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationHelper; 