import { useState, useEffect } from 'react'
import { Package, AlertCircle, TrendingUp, Plus, Search, Edit2, Truck, CheckCircle, XCircle, RefreshCw, Save, X } from 'lucide-react'
import type { Ingredient, SupplyOrder } from '../types'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function Stock() {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'orders'>('ingredients')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [editOperation, setEditOperation] = useState<'set' | 'add' | 'subtract'>('set')

  // Функция загрузки ингредиентов из API
  const fetchIngredients = async () => {
    try {
      const response = await api.get('/stock/ingredients')
      setIngredients(response.data.data || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching ingredients:', error)
      toast.error('Ошибка загрузки ингредиентов')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Функция обновления количества ингредиента
  const updateIngredientStock = async (id: number, quantity: number, operation: 'set' | 'add' | 'subtract') => {
    try {
      const response = await api.patch(`/stock/ingredients/${id}`, null, {
        params: { quantity, operation }
      })
      
      if (response.data.success) {
        toast.success('Остаток обновлен')
        fetchIngredients() // Обновляем список
        setEditingId(null)
      } else {
        toast.error(response.data.message || 'Ошибка обновления')
      }
    } catch (error: any) {
      console.error('Error updating stock:', error)
      toast.error(error.response?.data?.detail || 'Ошибка обновления')
    }
  }

  // Ручное обновление
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchIngredients()
    toast.success('Данные обновлены')
  }

  // Начать редактирование
  const startEdit = (ingredient: Ingredient) => {
    setEditingId(ingredient.id)
    setEditValue(ingredient.stock_quantity)
    setEditOperation('set')
  }

  // Отмена редактирования
  const cancelEdit = () => {
    setEditingId(null)
    setEditValue(0)
    setEditOperation('set')
  }

  // Сохранение изменений
  const saveEdit = (id: number) => {
    if (editValue < 0) {
      toast.error('Количество не может быть отрицательным')
      return
    }
    updateIngredientStock(id, editValue, editOperation)
  }

  // Загружаем ингредиенты при монтировании компонента
  useEffect(() => {
    fetchIngredients()
    
    // Автообновление каждые 30 секунд
    const interval = setInterval(() => {
      fetchIngredients()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Получаем уникальные категории из ингредиентов
  const categories = ['all', ...new Set(ingredients.map(i => i.category))]

  const filteredIngredients = ingredients.filter(ingredient => {
    const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStockStatus = (current: number, min: number) => {
    if (current <= min) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Критический' }
    if (current <= min * 1.5) return { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Низкий' }
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'Норма' }
  }

  const lowStockCount = ingredients.filter(i => i.stock_quantity <= i.min_stock_level).length
  const totalCost = ingredients.reduce((sum, i) => sum + (i.stock_quantity * i.unit_cost), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Склад</h2>
          <p className="text-gray-500">Управление ингредиентами и поставками</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Обновить
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Новый заказ
          </button>
        </div>
      </div>

      {/* Индикатор автообновления */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Автообновление каждые 30 секунд</span>
        </div>
        <div className="text-xs text-gray-400">
          Последнее обновление: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего ингредиентов</p>
              <p className="text-2xl font-bold text-gray-800">{ingredients.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Критический запас</p>
              <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Общая стоимость</p>
              <p className="text-2xl font-bold text-gray-800">{Math.round(totalCost).toLocaleString()} ₽</p>
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
                  const isEditing = editingId === ingredient.id
                  
                  return (
                    <tr key={ingredient.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{ingredient.name}</td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.category}</td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editOperation}
                              onChange={(e) => setEditOperation(e.target.value as any)}
                              className="input-field w-24 text-sm py-1"
                            >
                              <option value="set">Установить</option>
                              <option value="add">Добавить</option>
                              <option value="subtract">Списать</option>
                            </select>
                            <input
                              type="number"
                              step="0.01"
                              value={editValue}
                              onChange={(e) => setEditValue(parseFloat(e.target.value))}
                              className="input-field w-28 text-sm py-1"
                            />
                            <span className="text-sm text-gray-500">{ingredient.unit}</span>
                          </div>
                        ) : (
                          <span className={`font-medium ${status.color}`}>
                            {ingredient.stock_quantity} {ingredient.unit}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.min_stock_level} {ingredient.unit}</td>
                      <td className="px-6 py-4">
                        <span className={`badge ${status.bg} ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{ingredient.unit_cost} ₽/{ingredient.unit}</td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <button
                              onClick={() => saveEdit(ingredient.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Сохранить"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                              title="Отмена"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(ingredient)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Ингредиенты не найдены</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Модуль заказов поставщикам в разработке</p>
        </div>
      )}
    </div>
  )
}