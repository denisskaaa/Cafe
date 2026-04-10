import api from './api'
import type { Order, ApiResponse, PaginatedResponse } from '../types'

export const ordersService = {
  async getOrders(page: number = 1, perPage: number = 20): Promise<PaginatedResponse<Order>> {
    const response = await api.get(`/orders?page=${page}&per_page=${perPage}`)
    return response.data.data
  },

  async getActiveOrders(): Promise<Order[]> {
    const response = await api.get<ApiResponse<Order[]>>('/orders/active')
    return response.data.data || []
  },

  async getOrder(id: number): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`)
    return response.data.data!
  },

  async createOrder(data: Partial<Order>): Promise<Order> {
    const response = await api.post<ApiResponse<Order>>('/orders', data)
    return response.data.data!
  },

  async updateOrderStatus(id: number, status: Order['status']): Promise<Order> {
    const response = await api.patch<ApiResponse<Order>>(`/orders/${id}/status`, null, {
      params: { status }
    })
    return response.data.data!
  },

  async cancelOrder(id: number): Promise<void> {
    await api.post(`/orders/${id}/cancel`)
  },
}