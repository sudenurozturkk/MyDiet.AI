import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMongoClient } from '@/lib/mongodb';
import { hash } from 'bcrypt';
import { z } from 'zod';
import { badRequest } from '@/lib/errors';

const RegisterSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) return badRequest('Eksik/Geçersiz alanlar', parsed.error.flatten());

    const { name, email, password } = parsed.data;
    // MongoDB üzerinde users koleksiyonu ile email uniq kontrolü
    const client = await getMongoClient();
    const db = client.db();
    const users = db.collection('users');
    const existingMongo = await users.findOne({ email });
    if (existingMongo)
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 409 });

    const passwordHash = await hash(password, 10);

    // Prisma ile domain tablolarında profil oluştur, users kaydını MongoDB’de tut
    const inserted = await users.insertOne({ name, email, passwordHash, createdAt: new Date() });
    const createdId = String(inserted.insertedId);
    await prisma.profile.create({ data: { userId: createdId } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
