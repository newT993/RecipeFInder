'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

interface AuthContextType {
  isAuthenticated: boolean
  user: null | { id: string; email: string }
  loginWithCredentials: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loginWithCredentials: async () => {},
  loginWithGoogle: async () => {},
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
        const token = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user')

        if (token && savedUser) {
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            setIsAuthenticated(true)
            setUser(JSON.parse(savedUser))
          } else {
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

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Invalid email or password')

      const data = await response.json()

      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      setIsAuthenticated(true)
      setUser(data.user)

      router.push('/dashboard') // Redirect to dashboard
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

   const loginWithGoogle = async () => {
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard', // Specify where to redirect after successful login
      });
      console.log('Google signIn result:', result);
  
      // If result has error or no result, throw error
      if (result?.error) {
        throw new Error(result.error);
      }
  
      // Wait briefly for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const sessionResponse = await fetch('/api/auth/session', {
        credentials: 'include', // Important: include credentials
      });
      const sessionData = await sessionResponse.json();
      console.log('Session data:', sessionData);
  
      if (!sessionData?.user) {
        throw new Error('Failed to fetch user session');
      }
  
      // Create a token (you might want to generate this on the server)
      const token = btoa(JSON.stringify(sessionData.user));
  
      // Set localStorage items
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(sessionData.user));
  
      // Update state
      setIsAuthenticated(true);
      setUser(sessionData.user);
  
      // Redirect to dashboard
      if (result?.url) {
        router.push(result.url);
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Google login error:', error);
      // Clear any partial data
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      throw error;
    }
  };

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
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('session_expiry')
      document.cookie = 'auth_token=; Max-Age=0; path=/;'
      setIsAuthenticated(false)
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loginWithCredentials,
        loginWithGoogle,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)