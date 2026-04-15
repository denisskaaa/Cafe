import { useState, useEffect } from 'react'
import { Coffee, Plus, Edit2, Trash2, Search, DollarSign, Clock, Tag, Package, BookOpen } from 'lucide-react'
import type { MenuItem } from '../types'
import api from '../services/api'
import toast from 'react-hot-toast'

// Интерфейсы для рецептов
interface Recipe {
    id: number
    menu_item_id: number
    menu_item_name: string
    ingredient_id: number
    ingredient_name: string
    quantity: number
}

interface Ingredient {
    id: number
    name: string
    unit: string
    stock_quantity: number
}

const demoMenuItems: MenuItem[] = [
  { id: 1, name: 'Латте', category: 'Кофе', category_id: 1, price: 350, is_available: true, description: 'Классический латте с нежной пенкой', preparation_time: 3 },
  { id: 2, name: 'Капучино', category: 'Кофе', category_id: 1, price: 280, is_available: true, description: 'Эспрессо с пышной молочной пеной', preparation_time: 2 },
  { id: 3, name: 'Раф', category: 'Кофе', category_id: 1, price: 350, is_available: true, description: 'Кофейный напиток со сливками', preparation_time: 3 },
  { id: 4, name: 'Эспрессо', category: 'Кофе', category_id: 1, price: 150, is_available: true, description: 'Классический эспрессо', preparation_time: 2 },
  { id: 5, name: 'Круассан', category: 'Выпечка', category_id: 2, price: 250, is_available: true, description: 'Французский круассан', preparation_time: 1 },
  { id: 6, name: 'Чизкейк', category: 'Десерты', category_id: 3, price: 300, is_available: false, description: 'Нью-Йорк чизкейк', preparation_time: 1 },
  { id: 7, name: 'Сэндвич с курицей', category: 'Еда', category_id: 4, price: 450, is_available: true, description: 'Сэндвич с курицей гриль', preparation_time: 5 },
  { id: 8, name: 'Матча латте', category: 'Напитки', category_id: 5, price: 380, is_available: true, description: 'Чай матча с молоком', preparation_time: 3 },
]

const categories = ['Все', 'Кофе', 'Выпечка', 'Десерты', 'Еда', 'Напитки']

// Компонент для управления рецептами
function RecipeManagement() {
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [menuItems, setMenuItems] = useState<MenuItem[]>([])
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [selectedMenuItem, setSelectedMenuItem] = useState<number | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
    const [formData, setFormData] = useState({
        menu_item_id: 0,
        ingredient_id: 0,
        quantity: 0
    })

    useEffect(() => {
        fetchRecipes()
        fetchIngredients()
    }, [])

    useEffect(() => {
        // Используем демо-меню для отображения
        setMenuItems(demoMenuItems)
    }, [])

    const fetchRecipes = async () => {
        try {
            const response = await api.get('/recipes')
            setRecipes(response.data.data || [])
        } catch (error) {
            console.error('Error fetching recipes:', error)
        }
    }

    const fetchIngredients = async () => {
        try {
            const response = await api.get('/stock/ingredients')
            setIngredients(response.data.data || [])
        } catch (error) {
            console.error('Error fetching ingredients:', error)
        }
    }

    const handleSubmit = async () => {
        if (formData.menu_item_id === 0 || formData.ingredient_id === 0 || formData.quantity <= 0) {
            toast.error('Заполните все поля')
            return
        }

        try {
            if (editingRecipe) {
                await api.put(`/recipes/${editingRecipe.id}`, { quantity: formData.quantity })
                toast.success('Рецепт обновлен')
            } else {
                await api.post('/recipes', formData)
                toast.success('Рецепт добавлен')
            }
            setShowForm(false)
            setEditingRecipe(null)
            setFormData({ menu_item_id: 0, ingredient_id: 0, quantity: 0 })
            fetchRecipes()
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Ошибка')
        }
    }

    const handleDelete = async (id: number) => {
        if (confirm('Удалить рецепт?')) {
            try {
                await api.delete(`/recipes/${id}`)
                toast.success('Рецепт удален')
                fetchRecipes()
            } catch (error: any) {
                toast.error(error.response?.data?.detail || 'Ошибка')
            }
        }
    }

    const filteredRecipes = selectedMenuItem
        ? recipes.filter(r => r.menu_item_id === selectedMenuItem)
        : recipes

    const getIngredientUnit = (ingredientId: number) => {
        const ingredient = ingredients.find(i => i.id === ingredientId)
        return ingredient?.unit || ''
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Технологические карты</h3>
                    <p className="text-sm text-gray-500">Укажите сколько ингредиентов уходит на каждое блюдо</p>
                </div>
                <button
                    onClick={() => {
                        setEditingRecipe(null)
                        setFormData({ menu_item_id: 0, ingredient_id: 0, quantity: 0 })
                        setShowForm(true)
                    }}
                    className="btn-primary flex items-center gap-2 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Добавить рецепт
                </button>
            </div>

            {/* Фильтр по блюдам */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedMenuItem(null)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedMenuItem ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                    Все блюда
                </button>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setSelectedMenuItem(item.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedMenuItem === item.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            {/* Таблица рецептов */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredRecipes.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-400">Нет добавленных рецептов</p>
                        <p className="text-sm text-gray-400">Добавьте рецепт, чтобы указать состав блюда</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Блюдо</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ингредиент</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Кол-во на порцию</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Ед. изм.</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Остаток на складе</th>
                                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredRecipes.map((recipe) => {
                                const ingredient = ingredients.find(i => i.id === recipe.ingredient_id)
                                const enoughStock = ingredient && ingredient.stock_quantity >= recipe.quantity
                                return (
                                    <tr key={recipe.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            <div className="flex items-center gap-2">
                                                <Coffee className="w-4 h-4 text-primary-500" />
                                                {recipe.menu_item_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-4 h-4 text-gray-400" />
                                                {recipe.ingredient_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">{recipe.quantity}</td>
                                        <td className="px-6 py-4 text-gray-600">{getIngredientUnit(recipe.ingredient_id)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${enoughStock ? 'badge-success' : 'badge-danger'}`}>
                                                {ingredient?.stock_quantity || 0} {getIngredientUnit(recipe.ingredient_id)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingRecipe(recipe)
                                                        setFormData({
                                                            menu_item_id: recipe.menu_item_id,
                                                            ingredient_id: recipe.ingredient_id,
                                                            quantity: recipe.quantity
                                                        })
                                                        setShowForm(true)
                                                    }}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(recipe.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Модальное окно */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {editingRecipe ? 'Редактировать рецепт' : 'Новый рецепт'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="input-label">Блюдо</label>
                                <select
                                    value={formData.menu_item_id}
                                    onChange={(e) => setFormData({ ...formData, menu_item_id: parseInt(e.target.value) })}
                                    className="input-field"
                                    disabled={!!editingRecipe}
                                >
                                    <option value={0}>Выберите блюдо</option>
                                    {menuItems.map(item => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Ингредиент</label>
                                <select
                                    value={formData.ingredient_id}
                                    onChange={(e) => setFormData({ ...formData, ingredient_id: parseInt(e.target.value) })}
                                    className="input-field"
                                    disabled={!!editingRecipe}
                                >
                                    <option value={0}>Выберите ингредиент</option>
                                    {ingredients.map(ing => (
                                        <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Количество на порцию</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                                    className="input-field"
                                    placeholder="Например: 0.02"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={handleSubmit} className="btn-primary flex-1">
                                    {editingRecipe ? 'Сохранить' : 'Добавить'}
                                </button>
                                <button onClick={() => {
                                    setShowForm(false)
                                    setEditingRecipe(null)
                                }} className="btn-secondary flex-1">
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Основной компонент страницы меню
export default function MenuManagement() {
    const [activeTab, setActiveTab] = useState<'items' | 'recipes'>('items')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Все')
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

    const filteredItems = demoMenuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'Все' || item.category === selectedCategory
        const matchesAvailability = !showOnlyAvailable || item.is_available
        return matchesSearch && matchesCategory && matchesAvailability
    })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Меню</h2>
                    <p className="text-gray-500">Управление меню и рецептами</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Добавить позицию
                </button>
            </div>

            {/* Вкладки */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('items')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'items'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Coffee className="w-4 h-4" />
                    Позиции меню
                </button>
                <button
                    onClick={() => setActiveTab('recipes')}
                    className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
                        activeTab === 'recipes'
                            ? 'text-primary-600 border-b-2 border-primary-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Рецепты
                </button>
            </div>

            {/* Контент вкладки "Позиции меню" */}
            {activeTab === 'items' && (
                <>
                    {/* Поиск и фильтры */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Поиск по меню..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="input-field w-40"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showOnlyAvailable}
                                onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                                className="w-4 h-4 text-primary-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Только доступные</span>
                        </label>
                    </div>

                    {/* Сетка меню */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="card hover:shadow-lg transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Coffee className="w-5 h-5 text-primary-500" />
                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mb-3">{item.description}</p>

                                <div className="flex items-center justify-between text-sm mb-2">
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Tag className="w-4 h-4" />
                                        <span>{item.category}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{item.preparation_time} мин</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4 text-gray-400" />
                                        <span className="text-xl font-bold text-primary-600">{item.price} ₽</span>
                                    </div>
                                    <span className={`badge ${item.is_available ? 'badge-success' : 'badge-danger'}`}>
                                        {item.is_available ? 'В наличии' : 'Нет в наличии'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <Coffee className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Ничего не найдено</p>
                        </div>
                    )}
                </>
            )}

            {/* Контент вкладки "Рецепты" */}
            {activeTab === 'recipes' && <RecipeManagement />}
        </div>
    )
}