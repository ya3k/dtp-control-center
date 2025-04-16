import { NextResponse } from "next/server";

const ZIOMAP_API_BASE_URL = 'https://ziomap-main-db8d725.zuplo.app';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${ZIOMAP_API_BASE_URL}/geocoding?address=${encodeURIComponent(address)}`
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
} 