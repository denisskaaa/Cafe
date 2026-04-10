import api from './api'
import type { DashboardStats, ApiResponse } from '../types'

export const analyticsService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get<DashboardStats>('/analytics/dashboard')
    return response.data
  },

  async getRevenueStats(days: number = 7): Promise<Array<{ date: string; revenue: number; orders: number }>> {
    const response = await api.get<ApiResponse<any>>('/analytics/revenue', {
      params: { days }
    })
    return response.data.data || []
  },
}