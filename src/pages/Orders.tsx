import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, Clock, CheckCircle, XCircle, Coffee, Plus, Search, Filter, RefreshCw } from 'lucide-react'
import { ordersService } from '../services/orders.service'
import CreateOrderModal from '../components/orders/CreateOrderModal'
import toast from 'react-hot-toast'
import type { Order } from '../types'

export default function Orders() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const queryClient = useQueryClient()

  // Активные заказы - обновляем каждые 5 секунд (только этот список)
  const { data: activeOrders = [], isLoading: activeLoading, refetch: refetchActive } = useQuery({
    queryKey: ['active-orders'],
    queryFn: () => ordersService.getActiveOrders(),
    refetchInterval: 5000, // Обновляем только активные заказы каждые 5 секунд
  })

  // История заказов - не обновляется автоматически
  const { data: completedOrdersData, isLoading: completedLoading, refetch: refetchCompleted } = useQuery({
    queryKey: ['completed-orders'],
    queryFn: () => ordersService.getOrders(1, 50),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersService.updateOrderStatus(id, status as any),
    onSuccess: () => {
      // Обновляем только активные заказы без перезагрузки страницы
      queryClient.invalidateQueries({ queryKey: ['active-orders'] })
      toast.success('Статус заказа обновлен')
    },
  })

  const createOrderMutation = useMutation({
    mutationFn: (order: Partial<Order>) => ordersService.createOrder(order),
    onSuccess: () => {
      // Обновляем только активные заказы
      queryClient.invalidateQueries({ queryKey: ['active-orders'] })
      toast.success('Заказ успешно создан!')
      setIsModalOpen(false)
    },
  })

  // Ручное обновление
  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    await refetchActive()
    if (activeTab === 'completed') {
      await refetchCompleted()
    }
    setTimeout(() => setIsRefreshing(false), 500)
    toast.success('Данные обновлены')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'badge-warning'
      case 'preparing': return 'badge-info'
      case 'ready': return 'badge-success'
      case 'completed': return 'badge-success'
      case 'cancelled': return 'badge-danger'
      default: return 'badge'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает'
      case 'preparing': return 'Готовится'
      case 'ready': return 'Готов'
      case 'completed': return 'Выполнен'
      case 'cancelled': return 'Отменен'
      default: return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'dine_in': return 'В зале'
      case 'takeaway': return 'С собой'
      case 'delivery': return 'Доставка'
      default: return type
    }
  }

  const isLoading = activeTab === 'active' ? activeLoading : completedLoading
  const orders = activeTab === 'active' 
    ? activeOrders.filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : (completedOrdersData?.items || []).filter(order => 
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const handleCreateOrder = (order: Partial<Order>) => {
    createOrderMutation.mutate(order)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Заказы</h2>
          <p className="text-gray-500">Управление заказами кофейни</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Обновить
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Новый заказ
          </button>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру заказа..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Активные заказы ({activeOrders.length})
          {activeTab === 'active' && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Live
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'completed'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          История заказов ({completedOrdersData?.total || 0})
        </button>
      </div>

      {/* Индикатор обновления */}
      {activeTab === 'active' && (
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          Автообновление каждые 5 секунд
        </div>
      )}

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.map((order: Order) => (
          <div key={order.id} className="card hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="font-mono text-lg font-bold text-gray-800">
                    #{order.order_number}
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-gray-500">{getTypeText(order.type)}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <span className={`badge ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {order.items?.slice(0, 3).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity} x {item.name}
                  </span>
                  <span className="text-gray-800 font-medium">
                    {item.total.toLocaleString()} ₽
                  </span>
                </div>
              ))}
              {order.items?.length > 3 && (
                <p className="text-xs text-gray-400">+ еще {order.items.length - 3} позиций</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Сумма</p>
                <p className="text-lg font-bold text-gray-800">
                  {order.total_amount.toLocaleString()} ₽
                </p>
              </div>
              <div className="flex gap-2">
                {activeTab === 'active' && order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'preparing' })}
                      className="btn-secondary text-sm py-1 px-3"
                    >
                      <Clock className="w-4 h-4 inline mr-1" />
                      В работу
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'cancelled' })}
                      className="btn-danger text-sm py-1 px-3"
                    >
                      <XCircle className="w-4 h-4 inline mr-1" />
                      Отмена
                    </button>
                  </>
                )}
                {activeTab === 'active' && order.status === 'preparing' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'ready' })}
                    className="btn-primary text-sm py-1 px-3"
                  >
                    <CheckCircle className="w-4 h-4 inline mr-1" />
                    Готово
                  </button>
                )}
                {activeTab === 'active' && order.status === 'ready' && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: order.id, status: 'completed' })}
                    className="btn-primary text-sm py-1 px-3"
                  >
                    <Coffee className="w-4 h-4 inline mr-1" />
                    Выдан
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {activeTab === 'active' ? 'Нет активных заказов' : 'Нет заказов в истории'}
          </p>
        </div>
      )}

      <CreateOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  )
}