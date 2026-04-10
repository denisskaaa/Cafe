import { useState } from 'react'
import { Coffee, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { access_token, user } = await authService.login(email, password)
      console.log('Login successful:', { access_token, user })
      setAuth(access_token, user)
      toast.success('Добро пожаловать в CaféManager!')
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Login error:', err)
      toast.error(err.response?.data?.detail || 'Неверный email или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-coffee-light">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-lg">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">CaféManager</h1>
          <p className="text-gray-500 mt-2">Система управления кофейней</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="input-label">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="director@coffee.ru"
                required
              />
            </div>
          </div>

          <div>
            <label className="input-label">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Вход...</span>
              </div>
            ) : (
              'Войти в систему'
            )}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-2">Демо-доступ</p>
          <div className="space-y-1 text-sm font-mono text-gray-600">
            <p><strong>Директор:</strong> director@coffee.ru / 123456</p>
            <p><strong>Бариста:</strong> barista@coffee.ru / 123456</p>
          </div>
        </div>
      </div>
    </div>
  )
}