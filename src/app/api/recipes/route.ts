import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';
import sanitize from 'mongo-sanitize';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = sanitize(url.searchParams.get('q')?.trim() || '') as string;
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const pageSize = Math.min(
      1000,
      Math.max(1, parseInt(url.searchParams.get('pageSize') || '12', 10))
    );
    const skip = (page - 1) * pageSize;

    const client = await getMongoClient();
    const db = client.db();
    const collection = db.collection('recipes');

    const filter: any = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { ingredients: { $elemMatch: { $regex: q, $options: 'i' } } },
      ];
    }

    const [rawItems, total] = await Promise.all([
      collection.find(filter).skip(skip).limit(pageSize).toArray(),
      collection.countDocuments(filter),
    ]);

    // ObjectId -> string
    const items = rawItems.map((doc: any) => ({
      ...doc,
      _id: String(doc._id),
    }));

    return NextResponse.json({ items, page, pageSize, total });
  } catch (error) {
    console.error('Recipes API Error:', error);
    return NextResponse.json({ error: 'Tarifler yüklenirken hata oluştu' }, { status: 500 });
  }
}
