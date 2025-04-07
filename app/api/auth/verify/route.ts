import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get('auth_token')

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    // Verify the JWT token
    const payload = await verifyToken(token.value)

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      authenticated: true,
      user 
    })

  } catch (error) {
    console.error('Token verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}