import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Heart, 
  BarChart3, 
  Coffee, 
  Settings,
  LogOut
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { path: '/orders', icon: ShoppingBag, label: 'Заказы' },
  { path: '/staff', icon: Users, label: 'Персонал' },
  { path: '/stock', icon: Package, label: 'Склад' },
  { path: '/crm', icon: Heart, label: 'Клиенты' },
  { path: '/analytics', icon: BarChart3, label: 'Аналитика' },
  { path: '/menu', icon: Coffee, label: 'Меню' },
  { path: '/settings', icon: Settings, label: 'Настройки' },
]

export default function Sidebar() {
  const { logout, user } = useAuthStore()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Coffee className="w-8 h-8 text-primary-600" />
          <div>
            <span className="text-xl font-bold text-gray-800 block">CaféManager</span>
            <span className="text-xs text-gray-500">v1.0.0</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="mb-4 px-2 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Текущая роль</p>
          <p className="text-sm font-semibold text-gray-700 capitalize">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Выйти</span>
        </button>
      </div>
    </aside>
  )
}