import { useState } from 'react'
import { Heart, UserPlus, Search, Filter, Star, Gift, Mail, Phone, Calendar, TrendingUp, Award, Crown, Sparkles, Plus } from 'lucide-react'
import type { Customer } from '../types'

const demoCustomers: Customer[] = [
  { id: 1, name: 'Анна Смирнова', phone: '+7 (999) 123-45-67', email: 'anna@mail.ru', bonus_points: 1250, loyalty_tier: 'gold', total_spent: 15230, total_orders: 28, registered_at: '2024-01-15', last_visit: '2024-04-08' },
  { id: 2, name: 'Михаил Иванов', phone: '+7 (999) 234-56-78', email: 'mikhail@mail.ru', bonus_points: 750, loyalty_tier: 'silver', total_spent: 8750, total_orders: 15, registered_at: '2024-02-20', last_visit: '2024-04-07' },
  { id: 3, name: 'Елена Петрова', phone: '+7 (999) 345-67-89', email: 'elena@mail.ru', bonus_points: 320, loyalty_tier: 'bronze', total_spent: 3420, total_orders: 8, registered_at: '2024-03-10', last_visit: '2024-04-06' },
  { id: 4, name: 'Дмитрий Сидоров', phone: '+7 (999) 456-78-90', email: 'dmitry@mail.ru', bonus_points: 2100, loyalty_tier: 'gold', total_spent: 21800, total_orders: 42, registered_at: '2024-01-05', last_visit: '2024-04-08' },
  { id: 5, name: 'Ольга Кузнецова', phone: '+7 (999) 567-89-01', email: 'olga@mail.ru', bonus_points: 580, loyalty_tier: 'silver', total_spent: 6540, total_orders: 12, registered_at: '2024-02-01', last_visit: '2024-04-05' },
]

const loyaltyTiers = [
  { name: 'Бронза', points: '0-499', color: 'bg-amber-600', icon: '🥉', discount: '3%' },
  { name: 'Серебро', points: '500-999', color: 'bg-gray-400', icon: '🥈', discount: '5%' },
  { name: 'Золото', points: '1000+', color: 'bg-yellow-500', icon: '🥇', discount: '10%' },
]

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTier, setSelectedTier] = useState('all')
  const [activeTab, setActiveTab] = useState<'customers' | 'loyalty' | 'promotions'>('customers')

  const filteredCustomers = demoCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTier = selectedTier === 'all' || customer.loyalty_tier === selectedTier
    return matchesSearch && matchesTier
  })

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'gold': return <Crown className="w-4 h-4 text-yellow-500" />
      case 'silver': return <Award className="w-4 h-4 text-gray-400" />
      case 'bronze': return <Star className="w-4 h-4 text-amber-600" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'badge-warning'
      case 'silver': return 'badge-info'
      case 'bronze': return 'badge-success'
      default: return 'badge'
    }
  }

  const getTierName = (tier: string) => {
    switch (tier) {
      case 'gold': return 'Золото'
      case 'silver': return 'Серебро'
      case 'bronze': return 'Бронза'
      default: return tier
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Клиенты</h2>
          <p className="text-gray-500">Управление клиентской базой и программой лояльности</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Добавить клиента
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего клиентов</p>
              <p className="text-2xl font-bold text-gray-800">{demoCustomers.length}</p>
            </div>
            <Heart className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Новых за месяц</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <UserPlus className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активных клиентов</p>
              <p className="text-2xl font-bold text-gray-800">156</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Выдано бонусов</p>
              <p className="text-2xl font-bold text-gray-800">5,230</p>
            </div>
            <Gift className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'customers'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Клиенты
        </button>
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'loyalty'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Программа лояльности
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'promotions'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Акции и скидки
        </button>
      </div>

      {activeTab === 'customers' && (
        <>
          {/* Поиск и фильтры */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по имени, телефону или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">Все уровни</option>
              <option value="gold">Золото</option>
              <option value="silver">Серебро</option>
              <option value="bronze">Бронза</option>
            </select>
            <button className="btn-secondary flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Фильтры
            </button>
          </div>

          {/* Таблица клиентов */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Клиент</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Контакты</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Уровень</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Бонусы</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Потрачено</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Заказов</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Последний визит</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{customer.name}</p>
                        <p className="text-xs text-gray-500">ID: {customer.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="w-3 h-3" />
                          <span>{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          <span>{customer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTierIcon(customer.loyalty_tier)}
                        <span className={`badge ${getTierColor(customer.loyalty_tier)}`}>
                          {getTierName(customer.loyalty_tier)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary-600">{customer.bonus_points}</span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{customer.total_spent.toLocaleString()} ₽</td>
                    <td className="px-6 py-4 text-gray-600">{customer.total_orders}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.last_visit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'loyalty' && (
        <div className="space-y-6">
          {/* Уровни лояльности */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loyaltyTiers.map((tier) => (
              <div key={tier.name} className="card text-center">
                <div className="text-4xl mb-2">{tier.icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{tier.name}</h3>
                <p className="text-sm text-gray-500 mt-1">Бонусов: {tier.points}</p>
                <div className="mt-3">
                  <span className="text-2xl font-bold text-primary-600">{tier.discount}</span>
                  <span className="text-gray-500"> скидка</span>
                </div>
              </div>
            ))}
          </div>

          {/* Правила программы */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Правила программы лояльности
            </h3>
            <div className="space-y-3 text-gray-600">
              <p>• За каждые 100 ₽ в чеке начисляется 5 бонусных баллов</p>
              <p>• 1 бонусный балл = 1 ₽ скидки</p>
              <p>• Бонусы можно использовать при следующем заказе</p>
              <p>• Бонусы сгорают через 90 дней</p>
              <p>• Уровень обновляется автоматически при достижении порога</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'promotions' && (
        <div className="space-y-6">
          <button className="btn-primary flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5" />
            Создать акцию
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Активная акция */}
            <div className="card border-2 border-green-200 bg-gradient-to-r from-green-50 to-white">
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge-success text-xs">Активна</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">Счастливые часы</h3>
                  <p className="text-gray-600 mt-1">Скидка 20% на все кофейные напитки</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p>📅 Пн-Пт: 15:00 - 17:00</p>
                    <p>🎯 Для всех клиентов</p>
                  </div>
                </div>
                <div className="text-3xl">☕</div>
              </div>
            </div>

            {/* Акция 2 */}
            <div className="card border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-white">
              <div className="flex items-start justify-between">
                <div>
                  <span className="badge-warning text-xs">Скоро</span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">Двойные бонусы</h3>
                  <p className="text-gray-600 mt-1">Двойные бонусы за заказ от 500 ₽</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-500">
                    <p>📅 Выходные дни</p>
                    <p>🎯 Для всех клиентов</p>
                  </div>
                </div>
                <div className="text-3xl">🎁</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}