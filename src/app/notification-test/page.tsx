'use client';

import NotificationDebugger from '@/components/notification/NotificationDebugger';
import Link from 'next/link';

export default function NotificationTestPage() {
  return (
    <div className="container py-8 mx-auto">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Notification Test Page</h1>
        <p className="text-muted-foreground">
          Use this page to troubleshoot Firebase Cloud Messaging (FCM) notifications.
        </p>
        
        <NotificationDebugger />
        
        <div className="p-4 border rounded-lg space-y-2">
          <h2 className="text-xl font-semibold">Debugging Steps</h2>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Verify permission is granted (green status indicator)</li>
            <li>Confirm VAPID key is configured</li>
            <li>Try the browser test notification to verify basics work</li>
            <li>Copy your FCM token and use it to send a test message from Firebase Console</li>
            <li>Check browser console for any errors</li>
            <li className="mt-4">
              <Link 
                href="/notification-test/send" 
                className="text-blue-600 hover:underline font-medium"
              >
                Try our local notification test tool →
              </Link>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
} 