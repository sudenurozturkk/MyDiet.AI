/* eslint-disable no-console */
const { MongoClient } = require('mongodb')

const uri = process.env.DATABASE_URL
if (!uri) {
  console.error('DATABASE_URL is required')
  process.exit(1)
}

async function main() {
  const client = new MongoClient(uri)
  await client.connect()
  const db = client.db()

  console.log('Creating indexes...')
  await db.collection('recipes').createIndexes([
    { key: { title: 'text', description: 'text' }, name: 'recipes_text' },
    { key: { ingredients: 1 }, name: 'recipes_ingredients_1' },
  ])

  await db.collection('notes').createIndexes([
    { key: { userId: 1, createdAt: -1 }, name: 'notes_user_createdAt' },
  ])

  await db.collection('goals').createIndexes([
    { key: { userId: 1, updatedAt: -1 }, name: 'goals_user_updatedAt' },
  ])

  await client.close()
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


