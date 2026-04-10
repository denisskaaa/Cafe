import { useState } from 'react'
import { Package, AlertCircle, TrendingUp, Plus, Search, Edit2, Truck, CheckCircle, XCircle } from 'lucide-react'
import type { Ingredient, SupplyOrder } from '../types'

const demoIngredients: Ingredient[] = [
  { id: 1, name: 'Зерна кофе (арабика)', unit: 'кг', stock_quantity: 5.2, min_stock_level: 3, unit_cost: 1200, category: 'Кофе' },
  { id: 2, name: 'Молоко 3.2%', unit: 'л', stock_quantity: 8.5, min_stock_level: 5, unit_cost: 85, category: 'Молочные' },
  { id: 3, name: 'Сахар', unit: 'кг', stock_quantity: 2.1, min_stock_level: 1, unit_cost: 60, category: 'Бакалея' },
  { id: 4, name: 'Мука', unit: 'кг', stock_quantity: 1.5, min_stock_level: 2, unit_cost: 50, category: 'Бакалея' },
  { id: 5, name: 'Масло сливочное', unit: 'кг', stock_quantity: 0.8, min_stock_level: 1, unit_cost: 400, category: 'Молочные' },
  { id: 6, name: 'Яйца', unit: 'шт', stock_quantity: 30, min_stock_level: 20, unit_cost: 10, category: 'Бакалея' },
  { id: 7, name: 'Сироп карамельный', unit: 'л', stock_quantity: 1.2, min_stock_level: 0.5, unit_cost: 350, category: 'Сиропы' },
  { id: 8, name: 'Какао-порошок', unit: 'кг', stock_quantity: 0.6, min_stock_level: 0.5, unit_cost: 500, category: 'Кофе' },
]

const demoSupplies: SupplyOrder[] = [
  { id: 1, supplier_id: 1, supplier_name: 'CoffeeImport', status: 'pending', total_cost: 15000, created_by: 1, created_by_name: 'Иван', created_at: '2024-04-08', items: [] },
  { id: 2, supplier_id: 2, supplier_name: 'МолПродукт', status: 'approved', total_cost: 8500, created_by: 1, created_by_name: 'Иван', created_at: '2024-04-07', items: [] },
]

export default function Stock() {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'orders'>('ingredients')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', ...new Set(demoIngredients.map(i => i.category))]

  const filteredIngredients = demoIngredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Критический' }
    if (current <= min * 1.5) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Низкий' }
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'Норма' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Склад</h2>
          <p className="text-gray-500">Управление ингредиентами и поставками</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Новый заказ
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего ингредиентов</p>
              <p className="text-2xl font-bold text-gray-800">{demoIngredients.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Критический запас</p>
              <p className="text-2xl font-bold text-red-600">{demoIngredients.filter(i => i.stock_quantity <= i.min_stock_level).length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Общая стоимость</p>
              <p className="text-2xl font-bold text-gray-800">45,230 ₽</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активных заказов</p>
              <p className="text-2xl font-bold text-gray-800">2</p>
            </div>
            <Truck className="w-8 h-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'ingredients'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Ингредиенты
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'orders'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Заказы поставщикам
        </button>
      </div>

      {activeTab === 'ingredients' && (
        <>
          {/* Поиск и фильтры */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск ингредиентов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field w-48"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat === 'all' ? 'Все категории' : cat}</option>
              ))}
            </select>
          </div>

          {/* Таблица ингредиентов */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ингредиент</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Категория</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Остаток</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Мин. запас</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Статус</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Себестоимость</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredIngredients.map((ingredient) => {
                  const status = getStockStatus(ingredient.stock_quantity, ingredient.min_stock_level)
                  return (
                    <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{ingredient.name}</td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.category}</td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.stock_quantity} {ingredient.unit}</td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.min_stock_level} {ingredient.unit}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.unit_cost} ₽/{ingredient.unit}</td>
                      <td className="px-6 py-4">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">№ заказа</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Поставщик</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Дата</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Сумма</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Статус</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {demoSupplies.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-gray-800">#{order.id}</td>
                  <td className="px-6 py-4 text-gray-600">{order.supplier_name}</td>
                  <td className="px-6 py-4 text-gray-600">{order.created_at}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{order.total_cost.toLocaleString()} ₽</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      order.status === 'pending' ? 'badge-warning' :
                      order.status === 'approved' ? 'badge-info' :
                      order.status === 'received' ? 'badge-success' : 'badge-danger'
                    }`}>
                      {order.status === 'pending' ? 'В обработке' :
                       order.status === 'approved' ? 'Подтвержден' :
                       order.status === 'received' ? 'Получен' : 'Отменен'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <>
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}