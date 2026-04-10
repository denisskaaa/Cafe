import { useState } from 'react'
import { Coffee, Plus, Edit2, Trash2, Search, DollarSign, Clock, Tag } from 'lucide-react'
import type { MenuItem } from '../types'

const demoMenuItems: MenuItem[] = [
  { id: 1, name: 'Латте', category: 'Кофе', category_id: 1, price: 350, is_available: true, description: 'Классический латте с нежной пенкой', preparation_time: 3 },
  { id: 2, name: 'Капучино', category: 'Кофе', category_id: 1, price: 280, is_available: true, description: 'Эспрессо с пышной молочной пеной', preparation_time: 2 },
  { id: 3, name: 'Раф', category: 'Кофе', category_id: 1, price: 350, is_available: true, description: 'Кофейный напиток со сливками', preparation_time: 3 },
  { id: 4, name: 'Эспрессо', category: 'Кофе', category_id: 1, price: 150, is_available: true, description: 'Классический эспрессо', preparation_time: 2 },
  { id: 5, name: 'Круассан', category: 'Выпечка', category_id: 2, price: 250, is_available: true, description: 'Французский круассан', preparation_time: 1 },
  { id: 6, name: 'Чизкейк', category: 'Десерты', category_id: 3, price: 300, is_available: false, description: 'Нью-Йорк чизкейк', preparation_time: 1 },
  { id: 7, name: 'Сэндвич с курицей', category: 'Еда', category_id: 4, price: 450, is_available: true, description: 'Сэндвич с курицей гриль', preparation_time: 5 },
  { id: 8, name: 'Матча латте', category: 'Напитки', category_id: 5, price: 380, is_available: true, description: 'Чай матча с молоком', preparation_time: 3 },
]

const categories = ['Все', 'Кофе', 'Выпечка', 'Десерты', 'Еда', 'Напитки']

export default function MenuManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

  const filteredItems = demoMenuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory
    const matchesAvailability = !showOnlyAvailable || item.is_available
    return matchesSearch && matchesCategory && matchesAvailability
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Меню</h2>
          <p className="text-gray-500">Управление меню и рецептами</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Добавить позицию
        </button>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по меню..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field w-40"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyAvailable}
            onChange={(e) => setShowOnlyAvailable(e.target.checked)}
            className="w-4 h-4 text-primary-600 rounded"
          />
          <span className="text-sm text-gray-700">Только доступные</span>
        </label>
      </div>

      {/* Сетка меню */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="card hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Coffee className="w-5 h-5 text-primary-500" />
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
              </div>
              <div className="flex gap-1">
                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-3">{item.description}</p>

            <div className="flex items-center justify-between text-sm mb-2">
              <div className="flex items-center gap-1 text-gray-600">
                <Tag className="w-4 h-4" />
                <span>{item.category}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{item.preparation_time} мин</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-gray-400" />
                <span className="text-xl font-bold text-primary-600">{item.price} ₽</span>
              </div>
              <span className={`badge ${item.is_available ? 'badge-success' : 'badge-danger'}`}>
                {item.is_available ? 'В наличии' : 'Нет в наличии'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Ничего не найдено</p>
        </div>
      )}
    </div>
  )
}