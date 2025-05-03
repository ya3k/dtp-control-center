# Firebase Configuration Setup

To properly configure Firebase in this application, you need to set up the following environment variables in your `.env.local` file:

## Required Environment Variables

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCpEs47b7g-rSiv5r3flXVkch4OdA46pSM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dtp-bd-f7e16.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dtp-bd-f7e16
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dtp-bd-f7e16.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=44990674131
NEXT_PUBLIC_FIREBASE_APP_ID=1:44990674131:web:2297cc3267178d370f9026
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-E3XSSH03WT
NEXT_PUBLIC_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY_HERE
```

## Getting your VAPID Key

The VAPID key (Voluntary Application Server Identification) is necessary for Firebase Cloud Messaging (FCM) web push notifications. It helps establish a secure connection between your server and the browser's push service.

To get your VAPID key:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (dtp-bd-f7e16)
3. Go to Project Settings
4. Navigate to the Cloud Messaging tab
5. Find the "Web Push certificates" section
6. Click "Generate key pair" if none exists
7. Copy the "Key pair" value - this is your VAPID key
8. Add this key to your `.env.local` file as `NEXT_PUBLIC_FIREBASE_VAPID_KEY`

## Why We Need the VAPID Key

The VAPID key is required by FCM to:

1. Authenticate your application with push services
2. Enable web push notifications in browsers
3. Establish a secure connection for delivering push messages

Without a valid VAPID key, your web application will not be able to receive push notifications through Firebase Cloud Messaging.

## Note on Environment Variables

While the application includes fallback values for most Firebase configuration settings, we recommend setting these values in your environment for better security and configurability. The VAPID key does not have a fallback value and must be provided via environment variables. 