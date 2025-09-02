import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import { getMongoClient } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { decryptText, encryptObject, decryptObject } from '@/lib/crypto';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

const PostSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1).max(4000),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Geçersiz istek', details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const { conversationId, message } = parsed.data;

  // Kullanıcı llmApiKey'ini Mongo'dan çek ve decrypt et
  const client = await getMongoClient();
  const db = client.db();
  const userDoc = await db
    .collection('users')
    .findOne({ _id: new ObjectId(session.user.id as string) });
  const profile = decryptObject<any>((userDoc as any)?.profile?.__enc ?? '', {}) || {};
  const llmApiKeyEnc = profile?.llmApiKey as string | undefined;
  const llmApiKey = llmApiKeyEnc
    ? decryptText(llmApiKeyEnc)
    : process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
  const genAI = new GoogleGenerativeAI(llmApiKey);

  // Konuşma var mı? Yoksa oluştur
  let conversation = null as unknown as { id: string } | null;
  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: { id: conversationId },
      select: { id: true },
    });
  }
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { userId: session.user.id as unknown as string, title: message.slice(0, 60) },
      select: { id: true },
    });
  }

  // Mesaj + Asistan kaydını atomic işlem olarak yürüt
  const SYSTEM_TALIMATI = `
[ROL]
Sen "Pofi" adında, bütünsel yaklaşıma sahip, empatik ve proaktif bir kişisel sağlıklı yaşam koçusun. Görevin yalnızca beslenme önerileri vermek değil, kullanıcının fiziksel, zihinsel ve yaşam tarzına dair tüm faktörleri dikkate alarak uyarlanabilir rehberler sunmak. Sağlık profesyoneli değilsin, tıbbi teşhis veya tedavi öneremezsin. Amacın kullanıcıya yol arkadaşlığı yapmak, rehberlik sağlamak ve davranış değişikliğini sürdürülebilir kılmaktır.

[GÖREV TANIMI]
Kullanıcının profil verilerini analiz ederek ona özel, bütünsel ve sürdürülebilir bir "Sağlıklı Yaşam Rehberi" oluştur. Rehber beslenme, egzersiz, uyku, stres ve su tüketim hedeflerini içermeli. Rehber sonunda kullanıcıya mikro hedef belirlet.

[İLETİŞİM ADIMLARI – ZORUNLU AKIŞ]

Tanıtım ve uyarı

Profil toplama (yaş, cinsiyet, kilo, boy, sağlık durumu, beslenme tercihi, hedef, aktivite, uyku, stres)

Prensip tanıtımı

Kişiselleştirilmiş rehber sun (beslenme/egzersiz/uyku-stres/su)

Mikro hedef belirleme

Kapanış

[KURALLAR VE KISITLAR]

Yasaklı terimler: "tedavi", "reçete", "kesin sonuç", "garanti"

İzinli terimler: "öneri", "yaklaşık plan", "rehber", "eğitim amaçlı"

Kalori ve porsiyonlar tahmini sunulacak

Teşhis/tedavi yok

Üslup nazik, empatik, motive edici, Markdown ile net

[DİNAMİK ADAPTASYON]

Alerji/tercih bildirildiğinde alternatif öner

Plandan sapıldığında motive et, planı revize et

Krizleri büyütmeden yönet

[EGZERSİZ PLANI]

Doktor onayı uyarısı

FITT prensibine göre haftalık tablo

Güvenli hareketler, tekrar sayıları

Kolaylaştırıldıkça artırılabilir

[EK YETENEKLER]

Haftalık değerlendirme

Tarif oluşturma

Alışveriş listesi çıkarma

Bilimsel ama sade yanıt
`;
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const history = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: 'asc' },
    select: { role: true, content: true },
    take: 20,
  });
  const prompt = [
    `Sistem: ${SYSTEM_TALIMATI}`,
    ...history.map((h) => `${h.role === 'user' ? 'Kullanıcı' : 'Asistan'}: ${h.content}`),
  ].join('\n');

  // Timeout + basit retry
  async function callModelWithTimeout(signal: AbortSignal) {
    const result = await model.generateContent(
      {
        contents: [
          { role: 'user', parts: [{ text: `${prompt}\nKullanıcı: ${message}\nAsistan:` }] },
        ],
      },
      { signal } as any
    );
    return result.response.text();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let text = '';
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      text = await callModelWithTimeout(controller.signal);
      break;
    } catch (e) {
      if (attempt === 1) {
        clearTimeout(timeout);
        return NextResponse.json({ error: 'LLM isteği başarısız' }, { status: 502 });
      }
    }
  }
  clearTimeout(timeout);

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId: conversation.id, role: 'user', content: message },
    }),
    prisma.message.create({
      data: { conversationId: conversation.id, role: 'assistant', content: text },
    }),
  ]);

  return NextResponse.json({ conversationId: conversation.id, reply: text });
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
