import api from './api'
import type { Employee, Shift, ApiResponse } from '../types'

export const staffService = {
  async getEmployees(): Promise<Employee[]> {
    const response = await api.get<ApiResponse<Employee[]>>('/staff/employees')
    return response.data.data || []
  },

  async getEmployee(id: number): Promise<Employee> {
    const response = await api.get<ApiResponse<Employee>>(`/staff/employees/${id}`)
    return response.data.data!
  },

  async createEmployee(data: Partial<Employee>): Promise<Employee> {
    const response = await api.post<ApiResponse<Employee>>('/staff/employees', data)
    return response.data.data!
  },

  async updateEmployee(id: number, data: Partial<Employee>): Promise<Employee> {
    const response = await api.put<ApiResponse<Employee>>(`/staff/employees/${id}`, data)
    return response.data.data!
  },

  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/staff/employees/${id}`)
  },

  async getShifts(startDate: string, endDate: string): Promise<Shift[]> {
    const response = await api.get<ApiResponse<Shift[]>>('/staff/shifts', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response.data.data || []
  },

  async createShift(data: Partial<Shift>): Promise<Shift> {
    const response = await api.post<ApiResponse<Shift>>('/staff/shifts', data)
    return response.data.data!
  },
}