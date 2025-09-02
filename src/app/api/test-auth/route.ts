import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ 
        status: 'unauthenticated',
        message: 'Kullanıcı giriş yapmamış'
      });
    }

    return NextResponse.json({ 
      status: 'authenticated',
      user: session.user,
      message: 'Kullanıcı giriş yapmış'
    });
  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Auth hatası',
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

