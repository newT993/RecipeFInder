import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { AuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  }
}

const handler = NextAuth(authOptions)

// Export the handlers for GET and POST
export { handler as GET, handler as POST }