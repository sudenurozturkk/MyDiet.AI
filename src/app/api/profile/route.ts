import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { badRequest, unauthorized } from '@/lib/errors';
import { getMongoClient } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { encryptObject, decryptObject } from '@/lib/crypto';

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return unauthorized();

  const client = await getMongoClient();
  const db = client.db();
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
  const rawProfile = (user as any)?.profile || {};
  const profileData = decryptObject<any>(rawProfile?.__enc ?? '') || rawProfile;

  // Prisma'daki profil kaydı opsiyonel; MongoDB tek kaynak
  return NextResponse.json({ userId: session.user.id, ...profileData });
}

const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  goal: z.string().max(200).optional(),
  data: z.record(z.any()).optional(),
});

export async function PUT(request: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user?.id) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = ProfileUpdateSchema.safeParse(body);
  if (!parsed.success) return badRequest('Geçersiz veri', parsed.error.flatten());

  const { name, goal, data } = parsed.data;
  const encrypted = encryptObject<any>({ ...(goal ? { goal } : {}), ...(data ?? {}) });

  const client = await getMongoClient();
  const db = client.db();
  await db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { ...(name ? { name } : {}), profile: { __enc: encrypted } } },
      { upsert: false }
    );

  // Prisma profilini senkron tutmak isterseniz (opsiyonel):
  // await prisma.profile.upsert({
  //   where: { userId: session.user.id },
  //   update: { data: { ...(goal ? { goal } : {}), ...(data ?? {}) } },
  //   create: { userId: session.user.id, data: { ...(goal ? { goal } : {}), ...(data ?? {}) } },
  // })

  return NextResponse.json({ ok: true });
}
