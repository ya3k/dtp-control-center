'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function SendNotificationPage() {
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test notification message');
  const [loading, setLoading] = useState(false);

  const sendTestNotification = async () => {
    try {
      setLoading(true);
      
      // Create a mock notification event to simulate FCM
      const mockNotification = {
        notification: {
          title,
          body
        }
      };
      
      // Dispatch a custom event to simulate a Firebase message
      const event = new CustomEvent('firebase-messaging-message', { 
        detail: mockNotification 
      });
      window.dispatchEvent(event);
      
      // Also show in toast for confirmation
      toast.success('Test notification dispatched!', {
        description: 'Check if the notification appears from FCM component'
      });
      
      console.log('Test notification dispatched:', mockNotification);
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Test Notification Sender</h1>
        <p className="text-muted-foreground">
          Use this tool to test if your notification system is working without using Firebase Console.
        </p>
        
        <div className="p-6 border rounded-lg space-y-4">
          <div className="space-y-2">
            <label className="font-medium">Notification Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notification title" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="font-medium">Notification Body</label>
            <Textarea 
              value={body} 
              onChange={(e) => setBody(e.target.value)}
              placeholder="Enter notification message" 
              rows={3}
            />
          </div>
          
          <Button 
            onClick={sendTestNotification} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Sending...' : 'Send Test Notification'}
          </Button>
          
          <div className="text-sm text-muted-foreground mt-4">
            This test uses a custom event to simulate a FCM notification.
            It will test if your FCMNotification component is properly handling messages.
          </div>
        </div>
      </div>
    </div>
  );
} 