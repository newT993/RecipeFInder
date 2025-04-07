import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function createToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token expires in 7 days
  })
}

export function verifyToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}