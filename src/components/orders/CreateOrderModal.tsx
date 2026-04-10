import { useState } from 'react'
import { X, Plus, Minus, Coffee, Loader } from 'lucide-react'
import type { MenuItem, OrderItem } from '../../types'

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateOrder: (order: any) => void
}

const demoMenu: MenuItem[] = [
  { id: 1, name: 'Латте', category: 'Кофе', category_id: 1, price: 350, is_available: true },
  { id: 2, name: 'Капучино', category: 'Кофе', category_id: 1, price: 280, is_available: true },
  { id: 3, name: 'Раф', category: 'Кофе', category_id: 1, price: 350, is_available: true },
  { id: 4, name: 'Эспрессо', category: 'Кофе', category_id: 1, price: 150, is_available: true },
  { id: 5, name: 'Американо', category: 'Кофе', category_id: 1, price: 180, is_available: true },
  { id: 6, name: 'Флэт Уайт', category: 'Кофе', category_id: 1, price: 320, is_available: true },
  { id: 7, name: 'Круассан', category: 'Выпечка', category_id: 2, price: 250, is_available: true },
  { id: 8, name: 'Чизкейк', category: 'Десерты', category_id: 3, price: 300, is_available: true },
  { id: 9, name: 'Сэндвич с курицей', category: 'Еда', category_id: 4, price: 450, is_available: true },
  { id: 10, name: 'Сэндвич с лососем', category: 'Еда', category_id: 4, price: 550, is_available: true },
  { id: 11, name: 'Маффин', category: 'Выпечка', category_id: 2, price: 180, is_available: true },
  { id: 12, name: 'Горячий шоколад', category: 'Напитки', category_id: 5, price: 280, is_available: true },
]

export default function CreateOrderModal({ isOpen, onClose, onCreateOrder }: CreateOrderModalProps) {
  const [selectedItems, setSelectedItems] = useState<Map<number, { item: MenuItem; quantity: number }>>(new Map())
  const [orderType, setOrderType] = useState<'dine_in' | 'takeaway' | 'delivery'>('dine_in')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', ...new Set(demoMenu.map(item => item.category))]

  const filteredMenu = selectedCategory === 'all' 
    ? demoMenu 
    : demoMenu.filter(item => item.category === selectedCategory)

  const addItem = (item: MenuItem) => {
    const existing = selectedItems.get(item.id)
    if (existing) {
      selectedItems.set(item.id, { ...existing, quantity: existing.quantity + 1 })
    } else {
      selectedItems.set(item.id, { item, quantity: 1 })
    }
    setSelectedItems(new Map(selectedItems))
  }

  const removeItem = (itemId: number) => {
    const existing = selectedItems.get(itemId)
    if (existing && existing.quantity > 1) {
      selectedItems.set(itemId, { ...existing, quantity: existing.quantity - 1 })
    } else {
      selectedItems.delete(itemId)
    }
    setSelectedItems(new Map(selectedItems))
  }

  const calculateTotal = () => {
    let total = 0
    selectedItems.forEach(({ item, quantity }) => {
      total += item.price * quantity
    })
    return total
  }

  const handleSubmit = async () => {
    if (selectedItems.size === 0) return
    
    setIsSubmitting(true)
    
    // Имитация задержки отправки
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const items: OrderItem[] = Array.from(selectedItems.values()).map(({ item, quantity }) => ({
      id: 0,
      menu_item_id: item.id,
      name: item.name,
      quantity,
      price: item.price,
      total: item.price * quantity
    }))

    const order = {
      order_number: `ORD${Date.now()}`,
      type: orderType,
      status: 'pending',
      total_amount: calculateTotal(),
      items,
      created_at: new Date().toISOString(),
      employee_id: 1,
      employee_name: 'Текущий пользователь'
    }

    onCreateOrder(order)
    setIsSubmitting(false)
    setSelectedItems(new Map())
    onClose()
  }

  const clearCart = () => {
    setSelectedItems(new Map())
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Новый заказ</h2>
            <p className="text-sm text-gray-500 mt-1">Выберите позиции из меню</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Левая часть - меню */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-primary-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Все' : cat}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-2">
                {filteredMenu.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-all border border-gray-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-primary-600 font-semibold">{item.price} ₽</p>
                    </div>
                    <button
                      onClick={() => addItem(item)}
                      className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1"
                      disabled={isSubmitting}
                    >
                      <Plus className="w-4 h-4" />
                      Добавить
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Правая часть - корзина */}
          <div className="w-1/2 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">Корзина</h3>
              <p className="text-xs text-gray-500 mt-1">
                {selectedItems.size === 0 ? 'Корзина пуста' : `${selectedItems.size} позиций`}
              </p>
            </div>
            
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setOrderType('dine_in')}
                  className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                    orderType === 'dine_in' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  disabled={isSubmitting}
                >
                  🍽️ В зале
                </button>
                <button
                  onClick={() => setOrderType('takeaway')}
                  className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                    orderType === 'takeaway' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  disabled={isSubmitting}
                >
                  📦 С собой
                </button>
                <button
                  onClick={() => setOrderType('delivery')}
                  className={`flex-1 py-2 rounded-lg transition-all font-medium ${
                    orderType === 'delivery' 
                      ? 'bg-primary-500 text-white shadow-md' 
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                  disabled={isSubmitting}
                >
                  🚚 Доставка
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 space-y-2">
              {Array.from(selectedItems.values()).map(({ item, quantity }) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price} ₽ × {quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-800">{quantity}</span>
                    <button
                      onClick={() => addItem(item)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      disabled={isSubmitting}
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
              
              {selectedItems.size === 0 && (
                <div className="text-center py-12">
                  <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-400">Корзина пуста</p>
                  <p className="text-sm text-gray-400">Добавьте позиции из меню</p>
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Количество позиций:</span>
                  <span className="font-medium text-gray-800">{selectedItems.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Количество единиц:</span>
                  <span className="font-medium text-gray-800">
                    {Array.from(selectedItems.values()).reduce((sum, { quantity }) => sum + quantity, 0)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-lg font-semibold text-gray-800">Итого:</span>
                  <span className="text-2xl font-bold text-primary-600">{calculateTotal().toLocaleString()} ₽</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={clearCart}
                  disabled={selectedItems.size === 0 || isSubmitting}
                  className="flex-1 btn-secondary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Очистить
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedItems.size === 0 || isSubmitting}
                  className="flex-1 btn-primary py-2.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Оформление...</span>
                    </>
                  ) : (
                    <>
                      <Coffee className="w-5 h-5" />
                      <span>Оформить заказ</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}