/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const { MongoClient } = require('mongodb')
const path = require('path')
const fs = require('fs')

async function main() {
  const uri = process.env.DATABASE_URL
  if (!uri) throw new Error('DATABASE_URL is not set')
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()
  const collection = db.collection('recipes')

  const file = path.join(__dirname, '..', 'src', 'data', 'recipes-clean.json')
  const raw = fs.readFileSync(file, 'utf-8')
  const data = JSON.parse(raw)

  await collection.deleteMany({})
  const docs = data.map((r) => ({
    title: r.title,
    description: r.description ?? '',
    ingredients: r.ingredients ?? [],
    instructions: r.instructions ?? [],
    calories: r.calories ?? null,
    protein: r.protein ?? null,
    fat: r.fat ?? null,
    carbs: r.carbs ?? null,
    category: r.category ?? null,
    createdAt: new Date(),
  }))
  await collection.insertMany(docs)
  console.log(`Seeded ${docs.length} recipes`)
  await client.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


