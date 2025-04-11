'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  user: null | { id: string; email: string }
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<null | { id: string; email: string }>(null)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check localStorage for session token
        const token = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user')

        if (token && savedUser) {
          // Verify token with your backend
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })

          if (response.ok) {
            setIsAuthenticated(true)
            setUser(JSON.parse(savedUser))
          } else {
            // Clear invalid session
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const data = await response.json()
      
      // Store session data
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      setIsAuthenticated(true)
      setUser(data.user)
      
      // Set session expiry (e.g., 7 days)
      const expiryDate = new Date()
      expiryDate.setDate(expiryDate.getDate() + 7)
      localStorage.setItem('session_expiry', expiryDate.toISOString())
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  const register = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      router.push('/login')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Clear session data
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('session_expiry')
      document.cookie = 'auth_token=; Max-Age=0; path=/;';
      setIsAuthenticated(false)
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)