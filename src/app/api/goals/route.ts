import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const GoalToggleSchema = z.object({
  _id: z.string(),
  completed: z.boolean(),
});

export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  // Basic Origin/Referer doğrulaması
  const origin = (request.headers as any).get?.('origin') || '';
  if (process.env.NEXTAUTH_URL && origin && !origin.startsWith(process.env.NEXTAUTH_URL)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = GoalToggleSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
  const { ObjectId } = await import('mongodb');
  const client = await getMongoClient();
  const db = client.db();
  const id = parsed.data._id;
  const filter: any = { userId: session.user.id };
  if (ObjectId.isValid(id)) {
    filter._id = new ObjectId(id);
  } else {
    // Legacy/local id'ler için güncelleme atlanır; optimistic update istemcide kalır
    return NextResponse.json({ ok: true, note: 'legacy-id' });
  }
  await db
    .collection('goals')
    .updateOne(
      filter,
      { $set: { completed: parsed.data.completed, updatedAt: new Date() } },
      { upsert: false }
    );
  return NextResponse.json({ ok: true });
}
