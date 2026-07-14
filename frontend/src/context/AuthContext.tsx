import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, profileService } from '../services/api'

interface User {
  user_id: string
  email: string
  skillswap_id: string
  created_at: string
  status: string
  profile?: {
    profile_id: string
    full_name: string
    profile_image: string | null
    bio: string | null
    experience: string | null
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const data = await profileService.getMe()
      setUser(data)
    } catch (err) {
      logout()
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const data = await profileService.getMe()
          setUser(data)
        } catch (err) {
          logout()
        }
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password)
    localStorage.setItem('token', data.access_token)
    await refreshUser()
  }

  const register = async (email: string, password: string, fullName: string) => {
    await authService.register(email, password, fullName)
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
