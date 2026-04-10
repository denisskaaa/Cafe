import { useState } from 'react'
import { Users, UserPlus, Edit2, Trash2, Calendar, Clock, Award } from 'lucide-react'
import type { Employee } from '../types'

const demoEmployees: Employee[] = [
  { id: 1, full_name: 'Иван Директоров', position: 'Директор', role: 'director', department: 'Управление', hourly_rate: 1000, phone: '+7 (999) 123-45-67', email: 'director@coffee.ru', hired_date: '2024-01-01', status: 'active' },
  { id: 2, full_name: 'Анна Бариста', position: 'Старший бариста', role: 'barista', department: 'Производство', hourly_rate: 500, phone: '+7 (999) 234-56-78', email: 'barista@coffee.ru', hired_date: '2024-02-01', status: 'active' },
  { id: 3, full_name: 'Сергей Администраторов', position: 'Администратор', role: 'shift_admin', department: 'Управление', hourly_rate: 700, phone: '+7 (999) 345-67-89', email: 'admin@coffee.ru', hired_date: '2024-01-15', status: 'active' },
  { id: 4, full_name: 'Мария Пекарь', position: 'Пекарь', role: 'technologist', department: 'Производство', hourly_rate: 450, phone: '+7 (999) 456-78-90', email: 'baker@coffee.ru', hired_date: '2024-03-01', status: 'active' },
]

export default function Staff() {
  const [employees, setEmployees] = useState<Employee[]>(demoEmployees)
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  const departments = ['all', ...new Set(employees.map(e => e.department))]

  const filteredEmployees = selectedDepartment === 'all' 
    ? employees 
    : employees.filter(e => e.department === selectedDepartment)

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'director': return 'badge-danger'
      case 'shift_admin': return 'badge-warning'
      case 'barista': return 'badge-info'
      default: return 'badge-success'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Персонал</h2>
          <p className="text-gray-500">Управление сотрудниками и сменами</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Добавить сотрудника
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Всего сотрудников</p>
              <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
            </div>
            <Users className="w-8 h-8 text-primary-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Активных</p>
              <p className="text-2xl font-bold text-gray-800">{employees.filter(e => e.status === 'active').length}</p>
            </div>
            <Award className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Сегодня на смене</p>
              <p className="text-2xl font-bold text-gray-800">5</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Отработано часов</p>
              <p className="text-2xl font-bold text-gray-800">342</p>
            </div>
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Фильтр по отделам */}
      <div className="flex gap-2">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedDepartment === dept
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {dept === 'all' ? 'Все отделы' : dept}
          </button>
        ))}
      </div>

      {/* Таблица сотрудников */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Сотрудник</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Должность</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Отдел</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ставка</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Статус</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-800">{employee.full_name}</p>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`badge ${getRoleBadgeColor(employee.role)}`}>
                    {employee.position}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{employee.department}</td>
                <td className="px-6 py-4 text-gray-600">{employee.hourly_rate} ₽/час</td>
                <td className="px-6 py-4">
                  <span className={`badge ${employee.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                    {employee.status === 'active' ? 'Активен' : 'Уволен'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}