import { Bell, User, ChevronDown, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Добро пожаловать, {user?.full_name?.split(' ')[0] || 'Пользователь'}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
                <p className="text-xs text-gray-500">{user?.position}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">Выйти из системы</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}