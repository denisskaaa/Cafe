// Роли пользователей
export type UserRole = 
  | 'director' 
  | 'hr_manager' 
  | 'marketer' 
  | 'analyst' 
  | 'logistics_manager'
  | 'technologist' 
  | 'shift_admin' 
  | 'barista' 
  | 'tech_staff' 
  | 'sys_admin'

// Пользователь
export interface User {
  id: number
  full_name: string
  email: string
  role: UserRole
  position: string
  phone: string
  department: string
  avatar?: string
  hourly_rate: number
  hired_date: string
}

// Заказ
export interface Order {
  id: number
  order_number: string
  type: 'dine_in' | 'takeaway' | 'delivery'
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  total_amount: number
  items: OrderItem[]
  customer_id?: number
  customer_name?: string
  created_at: string
  employee_id: number
  employee_name: string
}

export interface OrderItem {
  id: number
  menu_item_id: number
  name: string
  quantity: number
  price: number
  modifiers?: Record<string, any>
  total: number
}

// Сотрудник
export interface Employee {
  id: number
  full_name: string
  position: string
  role: UserRole
  department: string
  hourly_rate: number
  phone: string
  email: string
  hired_date: string
  status: 'active' | 'inactive'
}

// Смена
export interface Shift {
  id: number
  employee_id: number
  employee_name: string
  date: string
  time_start: string
  time_end: string
  actual_start?: string
  actual_end?: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed'
  hours_worked?: number
}

// Ингредиент
export interface Ingredient {
  id: number
  name: string
  unit: string
  stock_quantity: number
  min_stock_level: number
  unit_cost: number
  category: string
}

// Клиент
export interface Customer {
  id: number
  name: string
  phone: string
  email: string
  bonus_points: number
  loyalty_tier: 'bronze' | 'silver' | 'gold'
  total_spent: number
  total_orders: number
  registered_at: string
  last_visit: string
}

// Позиция меню
export interface MenuItem {
  id: number
  name: string
  category: string
  category_id: number
  price: number
  is_available: boolean
  description?: string
  image?: string
  preparation_time?: number
}

// Рецепт
export interface Recipe {
  id: number
  menu_item_id: number
  ingredient_id: number
  quantity: number
  unit: string
}

// API ответы
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Статистика дашборда
export interface DashboardStats {
  today_revenue: number
  today_orders: number
  average_check: number
  active_staff: number
  low_stock_items: number
  top_items: Array<{ name: string; quantity: number; revenue: number }>
  recent_orders: Order[]
}

// Пагинация
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Задача смены
export interface Task {
  id: number
  shift_id: number
  assigned_to: number
  assigned_to_name: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  created_at: string
  completed_at?: string
}

// Уведомление
export interface Notification {
  id: number
  employee_id: number
  type: 'shift' | 'task' | 'stock' | 'system'
  message: string
  is_read: boolean
  created_at: string
}

// Акция
export interface Promotion {
  id: number
  name: string
  discount_type: 'percentage' | 'fixed'
  discount_value: number
  valid_from: string
  valid_to: string
  is_active: boolean
}

// Поставщик
export interface Supplier {
  id: number
  name: string
  contact_person: string
  phone: string
  email: string
  address: string
}

// Заявка на поставку
export interface SupplyOrder {
  id: number
  supplier_id: number
  supplier_name: string
  items: SupplyOrderItem[]
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'
  total_cost: number
  created_by: number
  created_by_name: string
  created_at: string
  delivered_at?: string
}

export interface SupplyOrderItem {
  ingredient_id: number
  ingredient_name: string
  quantity: number
  unit: string
  unit_price: number
  total: number
}