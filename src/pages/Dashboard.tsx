import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, Star, AlertCircle, RefreshCw } from 'lucide-react'
import { analyticsService } from '../services/analytics.service'
import { stockService } from '../services/stock.service'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [todayRevenue, setTodayRevenue] = useState(0)
  const [todayOrders, setTodayOrders] = useState(0)
  const [averageCheck, setAverageCheck] = useState(0)
  const [activeStaff, setActiveStaff] = useState(0)
  const [lowStockItems, setLowStockItems] = useState(0)
  const [topItems, setTopItems] = useState<Array<{ name: string; quantity: number; revenue: number }>>([])
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      const stats = await analyticsService.getDashboardStats()
      setTodayRevenue(stats.today_revenue)
      setTodayOrders(stats.today_orders)
      setAverageCheck(stats.average_check)
      setActiveStaff(stats.active_staff)
      setLowStockItems(stats.low_stock_items)
      setTopItems(stats.top_items || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await fetchDashboardData()
    setIsRefreshing(false)
    toast.success('Данные обновлены')
  }

  useEffect(() => {
    fetchDashboardData()
    
    // Автообновление каждые 30 секунд
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statCards = [
    { title: 'Выручка сегодня', value: `${todayRevenue.toLocaleString()} ₽`, icon: TrendingUp, bg: 'bg-green-50', text: 'text-green-600' },
    { title: 'Заказов сегодня', value: todayOrders, icon: ShoppingBag, bg: 'bg-blue-50', text: 'text-blue-600' },
    { title: 'Средний чек', value: `${averageCheck.toLocaleString()} ₽`, icon: TrendingUp, bg: 'bg-purple-50', text: 'text-purple-600' },
    { title: 'Активных сотрудников', value: activeStaff, icon: Users, bg: 'bg-orange-50', text: 'text-orange-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Обзор</h2>
          <p className="text-gray-500">Ключевые показатели вашей кофейни</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-gray-400">Последнее обновление</p>
            <p className="text-xs text-gray-500 font-mono">
              {lastUpdate.toLocaleTimeString()}
            </p>
          </div>
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Обновить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="card hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
              <div className={`${card.bg} p-3 rounded-full`}>
                <card.icon className={`w-6 h-6 ${card.text}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Топ-5 позиций
          </h3>
          <div className="space-y-3">
            {topItems.length > 0 ? (
              topItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <span className="text-gray-800 font-medium">{item.name}</span>
                      <p className="text-xs text-gray-500">{item.revenue.toLocaleString()} ₽</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {item.quantity} шт.
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Нет данных</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            Состояние склада
          </h3>
          {lowStockItems > 0 ? (
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Ингредиентов на складе:</span>
              <span className="text-red-600 font-semibold">{lowStockItems}</span>
            </div>
          ) : (
            <p className="text-green-600 bg-green-50 p-3 rounded-lg">✅ Все ингредиенты в достатке</p>
          )}
        </div>
      </div>
    </div>
  )
}