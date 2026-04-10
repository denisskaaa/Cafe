import api from './api'
import type { Ingredient, ApiResponse } from '../types'

export const stockService = {
  async getIngredients(): Promise<Ingredient[]> {
    const response = await api.get<ApiResponse<Ingredient[]>>('/stock/ingredients')
    return response.data.data || []
  },

  async getLowStockIngredients(): Promise<Ingredient[]> {
    const response = await api.get<ApiResponse<Ingredient[]>>('/stock/ingredients/low-stock')
    return response.data.data || []
  },

  async updateIngredientStock(
    ingredientId: number, 
    quantity: number, 
    operation: 'set' | 'add' | 'subtract' = 'set'
  ): Promise<Ingredient> {
    const response = await api.patch<ApiResponse<Ingredient>>(
      `/stock/ingredients/${ingredientId}`,
      null,
      { params: { quantity, operation } }
    )
    return response.data.data!
  },
}