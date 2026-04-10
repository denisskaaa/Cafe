import { create } from 'zustand'
import type { Order } from '../types'


interface OrdersState {
  activeOrders: Order[]
  completedOrders: Order[]
  setActiveOrders: (orders: Order[]) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: number, status: Order['status']) => void
}

export const useOrdersStore = create<OrdersState>((set) => ({
  activeOrders: [],
  completedOrders: [],
  setActiveOrders: (orders) => set({ activeOrders: orders }),
  addOrder: (order) => set((state) => ({ 
    activeOrders: [...state.activeOrders, order] 
  })),
  updateOrderStatus: (orderId, status) => set((state) => ({
    activeOrders: state.activeOrders.map(order => 
      order.id === orderId ? { ...order, status } : order
    )
  }))
}))