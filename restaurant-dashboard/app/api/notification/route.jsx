import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if it hasn't been already
let firebaseApp;

if (!admin.apps.length) {
  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "service-account-email@example.com",
      // Replace newlines in the private key if it comes from env vars
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || "dummy-key",
    }),
    databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
  });
} else {
  firebaseApp = admin.app();
}

// Your hardcoded FCM token
const FCM_TOKEN = process.env.NEXT_PUBLIC_FCM_TOKEN;

export async function POST(request) {
    try {
      const { notification, data, priority, android, webpush } = await request.json();
      
      // Use the hardcoded token instead of fetching from database
      const token = FCM_TOKEN;
      
      // Send notification to a single device
      const message = {
        notification: {
          title: notification.title,
          body: notification.body
        },
        data: data || {},
        token: token,
        android: android || {
          priority: priority || 'high',
          notification: {
            sound: 'default'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default'
            }
          }
        },
        webpush: webpush || {
          headers: {
            Urgency: 'high'
          }
        }
      };
      
      // Use send() instead of sendMulticast()
      const response = await admin.messaging().send(message);
      
      return NextResponse.json({
        success: true,
        messageId: response,
        message: `Successfully sent notification`
      });
      
    } catch (error) {
      console.error('Error sending notification:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }
  }