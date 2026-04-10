import api from './api'
import type { Customer, ApiResponse } from '../types'

export const crmService = {
  async getCustomers(page: number = 1, perPage: number = 20, search?: string): Promise<{ items: Customer[]; total: number }> {
    const response = await api.get<ApiResponse<any>>('/crm/customers', {
      params: { page, per_page: perPage, search }
    })
    return response.data.data
  },

  async getCustomer(id: number): Promise<Customer> {
    const response = await api.get<ApiResponse<Customer>>(`/crm/customers/${id}`)
    return response.data.data!
  },

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    const response = await api.post<ApiResponse<Customer>>('/crm/customers', data)
    return response.data.data!
  },

  async addBonusPoints(customerId: number, points: number): Promise<Customer> {
    const response = await api.post<ApiResponse<Customer>>(`/crm/customers/${customerId}/bonus`, null, {
      params: { points }
    })
    return response.data.data!
  },
}