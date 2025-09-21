import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "admin" | "user"

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users data
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@restaurant.com",
    role: "admin",
    name: "Quản trị viên",
  },
  {
    id: "2",
    username: "staff",
    email: "staff@restaurant.com",
    role: "user",
    name: "Nhân viên",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find((u) => u.username === username)

    if (foundUser && password === "123456") {
      // Simple password for demo
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
