import { useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Calendar, Download } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const salesData = [
  { name: 'Пн', продажи: 12500, заказы: 42 },
  { name: 'Вт', продажи: 14800, заказы: 48 },
  { name: 'Ср', продажи: 13200, заказы: 45 },
  { name: 'Чт', продажи: 15600, заказы: 52 },
  { name: 'Пт', продажи: 18900, заказы: 63 },
  { name: 'Сб', продажи: 22400, заказы: 78 },
  { name: 'Вс', продажи: 19800, заказы: 67 },
]

const categoryData = [
  { name: 'Кофе', value: 45, color: '#e87c2a' },
  { name: 'Выпечка', value: 25, color: '#60a5fa' },
  { name: 'Десерты', value: 20, color: '#34d399' },
  { name: 'Напитки', value: 10, color: '#fbbf24' },
]

const topProducts = [
  { name: 'Латте', quantity: 342, revenue: 119700 },
  { name: 'Капучино', quantity: 298, revenue: 83440 },
  { name: 'Круассан', quantity: 245, revenue: 61250 },
  { name: 'Раф', quantity: 189, revenue: 66150 },
  { name: 'Чизкейк', quantity: 156, revenue: 46800 },
]

export default function Analytics() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Аналитика</h2>
          <p className="text-gray-500">Отчеты и аналитика бизнеса</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="input-field w-32"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Ключевые показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Общая выручка</p>
              <p className="text-2xl font-bold text-gray-800">117,200 ₽</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% к прошлой неделе
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-800">395</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +8.3% к прошлой неделе
              </p>
            </div>
            <ShoppingBag className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Средний чек</p>
              <p className="text-2xl font-bold text-gray-800">297 ₽</p>
              <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3" />
                -2.1% к прошлой неделе
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активных клиентов</p>
              <p className="text-2xl font-bold text-gray-800">1,247</p>
              <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                +15.2% к прошлой неделе
              </p>
            </div>
            <Users className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* График продаж */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Динамика продаж</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="продажи" stroke="#e87c2a" name="Выручка (₽)" />
            <Line yAxisId="right" type="monotone" dataKey="заказы" stroke="#60a5fa" name="Заказы" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Категории и топ продукты */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Продажи по категориям</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Топ-5 продуктов</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.quantity} продаж</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">{product.revenue.toLocaleString()} ₽</p>
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                    <div 
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${(product.revenue / 119700) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Блок с отчетами */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card hover:shadow-md transition-all cursor-pointer">
          <Calendar className="w-8 h-8 text-primary-500 mb-3" />
          <h4 className="font-semibold text-gray-800">Дневной отчет</h4>
          <p className="text-sm text-gray-500 mt-1">Детальный отчет по продажам за сегодня</p>
        </div>
        <div className="card hover:shadow-md transition-all cursor-pointer">
          <BarChart3 className="w-8 h-8 text-primary-500 mb-3" />
          <h4 className="font-semibold text-gray-800">Месячный отчет</h4>
          <p className="text-sm text-gray-500 mt-1">Аналитика продаж за месяц</p>
        </div>
        <div className="card hover:shadow-md transition-all cursor-pointer">
          <Users className="w-8 h-8 text-primary-500 mb-3" />
          <h4 className="font-semibold text-gray-800">Отчет по персоналу</h4>
          <p className="text-sm text-gray-500 mt-1">KPI и эффективность сотрудников</p>
        </div>
      </div>
    </div>
  )
}