import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '')

const PostSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(4000),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const parsed = PostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz istek', details: parsed.error.flatten() }, { status: 400 })
  }
  const { conversationId, message } = parsed.data

  // Konuşma var mı? Yoksa oluştur
  let conversation = null as unknown as { id: string } | null
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      select: { id: true },
    })
  }
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: session.user.id as unknown as string, title: message.slice(0, 60) },
      select: { id: true },
    })
  }

  // Mesaj + Asistan kaydını atomic işlem olarak yürüt
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const history = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
    take: 20,
  })
  const prompt = history.map(h => `${h.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${h.content}`).join('\n')

  // Timeout + basit retry
  async function callModelWithTimeout(signal: AbortSignal) {
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: `${prompt}\nKullanıcı: ${message}\nAsistan:` }]}]}, { signal } as any)
    return result.response.text()
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  let text = ''
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      text = await callModelWithTimeout(controller.signal)
      break
    } catch (e) {
      if (attempt === 1) {
        clearTimeout(timeout)
        return NextResponse.json({ error: 'LLM isteği başarısız' }, { status: 502 })
      }
    }
  }
  clearTimeout(timeout)

  await prisma.$transaction([
    prisma.message.create({ data: { conversationId: conversation.id, role: 'user', content: message } }),
    prisma.message.create({ data: { conversationId: conversation.id, role: 'assistant', content: text } }),
  ])

  return NextResponse.json({ conversationId: conversation.id, reply: text })
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const conversations = await prisma.conversation.findMany({
    where: { userId: user!.id },
    orderBy: { updatedAt: 'desc' },
    include: { messages: { orderBy: { createdAt: 'asc' }, take: 1 } },
  });
  return NextResponse.json(conversations);
}


