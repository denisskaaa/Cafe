import api from './api'
import type { User } from '../types'

export const authService = {
  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const response = await api.post('/auth/login', { email, password })
    const { access_token } = response.data
    
    // Важно: для получения профиля нужно передать токен
    const profileResponse = await api.get<User>('/auth/profile', {
      headers: { Authorization: `Bearer ${access_token}` }
    })
    const user = profileResponse.data
    
    return { access_token, user }
  },

  async logout(): Promise<void> {
    return Promise.resolve()
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile')
    return response.data
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/auth/profile', data)
    return response.data
  },
}