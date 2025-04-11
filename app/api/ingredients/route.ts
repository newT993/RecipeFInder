import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

// GET - Fetch all ingredients for authenticated user
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
    const userId = payload.userId

    // Get both ingredients and saved items
    const [ingredients, savedItems] = await Promise.all([
      prisma.ingredient.findMany({
        where: {
          userId,
        },
        include: {
          category: true,
        },
        orderBy: {
          purchaseDate: 'desc',
        },
      }),
      prisma.savedItem.findMany({
        where: {
          userId,
        },
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    ])

    // Combine and format the data
    const combinedItems = [
      ...ingredients,
      ...savedItems.map(item => ({
        ...item,
        isSaved: true // Add a flag to identify saved items
      }))
    ]

    return NextResponse.json(combinedItems)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

// POST - Create new ingredient
export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')

    if (!token || !token.value) {
      return NextResponse.json(
        { error: 'Unauthorized - No valid token' },
        { status: 401 }
      )
    }

    const payload = await verifyToken(token.value)
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Invalid token payload' },
        { status: 401 }
      )
    }

    const userId = payload.userId
    const body = await request.json()
    
    // Validate required fields
    const { name, quantity, categoryId, expiryDate } = body
    
    if (!name || !quantity || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    // Create ingredient with validated data
    const ingredient = await prisma.ingredient.create({
      data: {
        name: String(name),
        quantity: String(quantity),
        categoryId: String(categoryId),
        userId: String(userId),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        purchaseDate: new Date(),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error('Error creating ingredient:', error)
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create ingredient' },
      { status: 500 }
    )
  }
}

// PATCH - Update ingredient
export async function PATCH(request: Request) {
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
    const userId = payload.userId

    const body = await request.json()
    const { id, name, quantity, categoryId, expiryDate } = body

    const ingredient = await prisma.ingredient.update({
      where: {
        id,
        userId, // Ensure user owns the ingredient
      },
      data: {
        name,
        quantity,
        categoryId,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(ingredient)
  } catch (error) {
    console.error('Error updating ingredient:', error)
    return NextResponse.json(
      { error: 'Failed to update ingredient' },
      { status: 500 }
    )
  }
}

// DELETE - Remove ingredient
export async function DELETE(request: Request) {
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
    const userId = payload.userId

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Ingredient ID is required' },
        { status: 400 }
      )
    }

    await prisma.ingredient.delete({
      where: {
        id,
        userId, // Ensure user owns the ingredient
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting ingredient:', error)
    return NextResponse.json(
      { error: 'Failed to delete ingredient' },
      { status: 500 }
    )
  }
}