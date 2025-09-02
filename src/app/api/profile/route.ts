import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const profile = await prisma.profile.findUnique({ where: { userId: user!.id } });
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const body = await request.json();
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const updated = await prisma.profile.update({ where: { userId: user!.id }, data: { data: body } });
  return NextResponse.json(updated);
}


