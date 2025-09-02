import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import sanitize from 'mongo-sanitize';
import { getMongoClient } from '@/lib/mongodb';
import { z } from 'zod';
import { encryptObject, decryptObject } from '@/lib/crypto';

export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const client = await getMongoClient();
    const db = client.db();
    const raw = await db
      .collection('meal_plans')
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();
    const plans = raw.map((p: any) => ({
      ...p,
      ...decryptObject<any>(p.__enc ?? '', {}),
      __enc: undefined,
    }));
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Meal Plans API Error:', error);
    return NextResponse.json({ error: 'Meal plans yüklenirken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
    const body = sanitize(await request.json());
    const Schema = z.object({
      day: z.string().min(1),
      mealType: z.string().min(1),
      recipeId: z.string().min(1),
      recipeTitle: z.string().min(1),
      calories: z.number().min(0).default(0),
    });
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
    const client = await getMongoClient();
    const db = client.db();
    const doc = {
      userId: session.user.id,
      __enc: encryptObject(parsed.data),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('meal_plans').insertOne(doc);
    return NextResponse.json({ ...doc, _id: result.insertedId });
  } catch (error) {
    console.error('Meal Plans API Error:', error);
    return NextResponse.json({ error: 'Meal plan kaydedilirken hata oluştu' }, { status: 500 });
  }
}
