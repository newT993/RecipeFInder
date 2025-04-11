import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token.value)
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const userId = payload.userId

    // Get dashboard statistics
    const [ingredients, categories, savedItems] = await Promise.all([
      prisma.ingredient.findMany({
        where: { userId },
      }),
      prisma.category.findMany(),
      prisma.savedItem.findMany({
        where: { userId },
      }),
    ])

    // Calculate expiring items (within 7 days)
    const expiringItems = ingredients.filter(i => 
      i.expiryDate && 
      new Date(i.expiryDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length

    return NextResponse.json({
      totalIngredients: ingredients.length,
      expiringItems,
      savedRecipes: savedItems.length,
      totalCategories: categories.length,
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}