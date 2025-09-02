import { NextResponse } from 'next/server'
import recipes from '@/data/recipes-clean.json'
import { z } from 'zod'

export async function GET() {
  try {
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Recipes API Error:', error)
    return NextResponse.json({ error: 'Recipes yüklenirken hata oluştu' }, { status: 500 })
  }
}