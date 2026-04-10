import api from './api'
import type { MenuItem, ApiResponse } from '../types'

export const menuService = {
  async getMenuItems(category?: string, availableOnly?: boolean): Promise<MenuItem[]> {
    const response = await api.get<ApiResponse<MenuItem[]>>('/menu/items', {
      params: { category, available_only: availableOnly }
    })
    return response.data.data || []
  },

  async getMenuItem(id: number): Promise<MenuItem> {
    const response = await api.get<ApiResponse<MenuItem>>(`/menu/items/${id}`)
    return response.data.data!
  },

  async createMenuItem(data: Partial<MenuItem>): Promise<MenuItem> {
    const response = await api.post<ApiResponse<MenuItem>>('/menu/items', data)
    return response.data.data!
  },

  async toggleAvailability(id: number, isAvailable: boolean): Promise<MenuItem> {
    const response = await api.patch<ApiResponse<MenuItem>>(`/menu/items/${id}/availability`, null, {
      params: { is_available: isAvailable }
    })
    return response.data.data!
  },
}