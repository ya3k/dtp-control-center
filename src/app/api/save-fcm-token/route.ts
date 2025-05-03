import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'FCM token is required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Validate user authentication
    // 2. Associate the FCM token with the current user in your database
    // 3. Use this token to send personalized notifications to this user

    // For demonstration, just log the token
    console.log('Received FCM token:', token);

    // Return success response
    return NextResponse.json(
      { message: 'FCM token saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return NextResponse.json(
      { message: 'Failed to save FCM token' },
      { status: 500 }
    );
  }
} 