import { useState } from 'react'
import { Settings, Bell, Lock, Palette, Globe, Database, Shield, User, Mail, Phone, MapPin, Clock, DollarSign } from 'lucide-react'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')

  const sections = [
    { id: 'profile', name: 'Профиль', icon: User },
    { id: 'notifications', name: 'Уведомления', icon: Bell },
    { id: 'security', name: 'Безопасность', icon: Lock },
    { id: 'appearance', name: 'Внешний вид', icon: Palette },
    { id: 'localization', name: 'Локализация', icon: Globe },
    { id: 'backup', name: 'Резервное копирование', icon: Database },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Настройки</h2>
        <p className="text-gray-500">Управление настройками системы и аккаунта</p>
      </div>

      <div className="flex gap-6">
        {/* Боковое меню настроек */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  activeSection === section.id
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <section.icon className="w-5 h-5" />
                <span className="font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Контент настроек */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Профиль компании</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Название кофейни</label>
                  <input type="text" className="input-field" defaultValue="CaféManager Coffee" />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input type="email" className="input-field" defaultValue="info@cafemanager.ru" />
                </div>
                <div>
                  <label className="input-label">Телефон</label>
                  <input type="tel" className="input-field" defaultValue="+7 (999) 123-45-67" />
                </div>
                <div>
                  <label className="input-label">Адрес</label>
                  <input type="text" className="input-field" defaultValue="г. Москва, ул. Примерная, д. 123" />
                </div>
                <div>
                  <label className="input-label">Часы работы</label>
                  <input type="text" className="input-field" defaultValue="Пн-Вс: 09:00 - 21:00" />
                </div>
                <button className="btn-primary">Сохранить изменения</button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Настройки уведомлений</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-800">Telegram уведомления</p>
                    <p className="text-sm text-gray-500">Получать уведомления в Telegram</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-800">Email уведомления</p>
                    <p className="text-sm text-gray-500">Получать отчеты на email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-800">Уведомления о заказах</p>
                    <p className="text-sm text-gray-500">При создании нового заказа</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
                <button className="btn-primary">Сохранить</button>
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Безопасность</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Текущий пароль</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="input-label">Новый пароль</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <div>
                  <label className="input-label">Подтверждение пароля</label>
                  <input type="password" className="input-field" placeholder="••••••••" />
                </div>
                <button className="btn-primary">Изменить пароль</button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Внешний вид</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Тема</label>
                  <select className="input-field">
                    <option>Светлая</option>
                    <option>Темная</option>
                    <option>Системная</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Основной цвет</label>
                  <div className="flex gap-2 mt-2">
                    <div className="w-10 h-10 rounded-full bg-primary-500 cursor-pointer ring-2 ring-primary-500 ring-offset-2"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer"></div>
                    <div className="w-10 h-10 rounded-full bg-green-500 cursor-pointer"></div>
                    <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer"></div>
                    <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer"></div>
                  </div>
                </div>
                <button className="btn-primary">Применить</button>
              </div>
            </div>
          )}

          {activeSection === 'localization' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Локализация</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Язык</label>
                  <select className="input-field">
                    <option>Русский</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Формат даты</label>
                  <select className="input-field">
                    <option>ДД.ММ.ГГГГ</option>
                    <option>ММ/ДД/ГГГГ</option>
                    <option>ГГГГ-ММ-ДД</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Валюта</label>
                  <select className="input-field">
                    <option>Рубль (₽)</option>
                    <option>Доллар ($)</option>
                    <option>Евро (€)</option>
                  </select>
                </div>
                <button className="btn-primary">Сохранить</button>
              </div>
            </div>
          )}

          {activeSection === 'backup' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Резервное копирование</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Последнее резервное копирование: 08.04.2024 15:30</p>
                </div>
                <button className="btn-primary w-full">Создать резервную копию</button>
                <button className="btn-secondary w-full">Восстановить из копии</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}