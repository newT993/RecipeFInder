import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

interface JWTPayload {
  userId: string;
  [key: string]: unknown; // Allow for additional properties
}

export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not defined')
    }
    
    const verified = jwt.verify(token, secret)
    if (typeof verified === 'string') {
      throw new Error('Invalid token format')
    }
    
    return verified as { userId: string }
  } catch (error) {
    console.error('Token verification failed:', error)
    throw error
  }
}