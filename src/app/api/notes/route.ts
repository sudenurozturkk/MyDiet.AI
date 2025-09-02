import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

const NoteSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1),
  content: z.string().default(''),
  tags: z.array(z.string()).default([]),
  completed: z.boolean().optional(),
});

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const client = await getMongoClient();
  const db = client.db();
  const notes = await db
    .collection('notes')
    .find({ userId: session.user.id })
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(notes);
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const parsed = NoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
  const client = await getMongoClient();
  const db = client.db();
  const doc = {
    userId: session.user.id,
    title: parsed.data.title,
    content: parsed.data.content,
    tags: parsed.data.tags,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const result = await db.collection('notes').insertOne(doc);
  return NextResponse.json({ ...doc, _id: result.insertedId });
}

export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  // Basic Origin/Referer doğrulaması
  const origin = (request.headers as any).get?.('origin') || '';
  if (process.env.NEXTAUTH_URL && origin && !origin.startsWith(process.env.NEXTAUTH_URL)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = NoteSchema.extend({ _id: z.string() }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Geçersiz veri' }, { status: 400 });
  const { _id, ...update } = parsed.data;
  const { ObjectId } = await import('mongodb');
  const client = await getMongoClient();
  const db = client.db();
  await db
    .collection('notes')
    .updateOne(
      { _id: new ObjectId(_id), userId: session.user.id },
      { $set: { ...update, updatedAt: new Date() } }
    );
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id gerekli' }, { status: 400 });
  const { ObjectId } = await import('mongodb');
  const client = await getMongoClient();
  const db = client.db();
  await db.collection('notes').deleteOne({ _id: new ObjectId(id), userId: session.user.id });
  return NextResponse.json({ ok: true });
}
