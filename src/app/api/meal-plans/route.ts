import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json([]);
  } catch (error) {
    console.error('Meal Plans API Error:', error);
    return NextResponse.json({ error: 'Meal plans yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error('Meal Plans API Error:', error);
    return NextResponse.json({ error: 'Meal plan kaydedilirken hata oluştu' }, { status: 500 });
  }
} 