import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/jwt'

export async function GET(request: Request) {
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

    const savedItems = await prisma.savedItem.findMany({
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

    return NextResponse.json(savedItems)
  } catch (error) {
    console.error('Error fetching saved items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
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
    const { name, quantity, categoryId } = body

    const savedItem = await prisma.savedItem.create({
      data: {
        name,
        quantity,
        categoryId,
        userId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(savedItem)
  } catch (error) {
    console.error('Error creating saved item:', error)
    return NextResponse.json(
      { error: 'Failed to create saved item' },
      { status: 500 }
    )
  }
}