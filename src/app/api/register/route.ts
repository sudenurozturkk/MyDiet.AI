import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import { z } from 'zod'
import { badRequest } from '@/lib/errors'

const RegisterSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) return badRequest('Eksik/Geçersiz alanlar', parsed.error.flatten())

    const { name, email, password } = parsed.data
    const existing = await prisma.user.findFirst({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Bu e-posta zaten kayıtlı' }, { status: 409 })
    }
    const passwordHash = await hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, passwordHash } })
    await prisma.profile.create({ data: { userId: user.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}


