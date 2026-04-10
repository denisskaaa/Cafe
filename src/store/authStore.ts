import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Определяем тип User прямо в файле, чтобы не импортировать
interface User {
  id: number
  full_name: string
  email: string
  role: string
  position: string
  phone: string
  department: string
  hourly_rate: number
  hired_date: string
}

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)