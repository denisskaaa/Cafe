from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.models.models import Recipe, MenuItem, Ingredient, Employee
from app.schemas.schemas import ApiResponse
from app.routers.auth import get_current_user
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/recipes", tags=["Recipes"])

# Схемы для запросов
class RecipeCreate(BaseModel):
    menu_item_id: int
    ingredient_id: int
    quantity: float

class RecipeUpdate(BaseModel):
    quantity: Optional[float] = None

# Функция преобразования Recipe в словарь
def recipe_to_dict(recipe: Recipe, menu_name: str = None, ingredient_name: str = None) -> dict:
    return {
        "id": recipe.id,
        "menu_item_id": recipe.menu_item_id,
        "menu_item_name": menu_name,
        "ingredient_id": recipe.ingredient_id,
        "ingredient_name": ingredient_name,
        "quantity": float(recipe.quantity)
    }

@router.get("/", response_model=ApiResponse)
async def get_all_recipes(
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение всех рецептов"""
    result = await db.execute(
        select(Recipe, MenuItem.name, Ingredient.name).join(
            MenuItem, Recipe.menu_item_id == MenuItem.id
        ).join(
            Ingredient, Recipe.ingredient_id == Ingredient.id
        )
    )
    recipes = result.all()
    
    data = []
    for recipe, menu_name, ingredient_name in recipes:
        data.append({
            "id": recipe.id,
            "menu_item_id": recipe.menu_item_id,
            "menu_item_name": menu_name,
            "ingredient_id": recipe.ingredient_id,
            "ingredient_name": ingredient_name,
            "quantity": float(recipe.quantity)
        })
    
    return ApiResponse(success=True, data=data)

@router.get("/menu-item/{menu_item_id}", response_model=ApiResponse)
async def get_recipe_by_menu_item(
    menu_item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение рецепта для конкретного блюда"""
    result = await db.execute(
        select(Recipe, Ingredient.name).join(
            Ingredient, Recipe.ingredient_id == Ingredient.id
        ).where(Recipe.menu_item_id == menu_item_id)
    )
    recipes = result.all()
    
    data = []
    for recipe, ingredient_name in recipes:
        data.append({
            "id": recipe.id,
            "ingredient_id": recipe.ingredient_id,
            "ingredient_name": ingredient_name,
            "quantity": float(recipe.quantity)
        })
    
    return ApiResponse(success=True, data=data)

@router.post("/", response_model=ApiResponse)
async def create_recipe(
    recipe: RecipeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Создание нового рецепта (только для директора/технолога)"""
    if current_user.role not in ["director", "technologist"]:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    # Проверяем существование блюда и ингредиента
    menu_result = await db.execute(select(MenuItem).where(MenuItem.id == recipe.menu_item_id))
    menu_item = menu_result.scalar_one_or_none()
    if not menu_item:
        raise HTTPException(status_code=404, detail="Блюдо не найдено")
    
    ing_result = await db.execute(select(Ingredient).where(Ingredient.id == recipe.ingredient_id))
    ingredient = ing_result.scalar_one_or_none()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ингредиент не найден")
    
    # Проверяем, нет ли уже такого рецепта
    existing = await db.execute(
        select(Recipe).where(
            Recipe.menu_item_id == recipe.menu_item_id,
            Recipe.ingredient_id == recipe.ingredient_id
        )
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Рецепт для этого блюда и ингредиента уже существует")
    
    new_recipe = Recipe(
        menu_item_id=recipe.menu_item_id,
        ingredient_id=recipe.ingredient_id,
        quantity=recipe.quantity
    )
    
    db.add(new_recipe)
    await db.commit()
    await db.refresh(new_recipe)
    
    return ApiResponse(
        success=True, 
        data=recipe_to_dict(new_recipe, menu_item.name, ingredient.name), 
        message="Рецепт добавлен"
    )

@router.put("/{recipe_id}", response_model=ApiResponse)
async def update_recipe(
    recipe_id: int,
    recipe_data: RecipeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Обновление рецепта"""
    if current_user.role not in ["director", "technologist"]:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalar_one_or_none()
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецепт не найден")
    
    if recipe_data.quantity is not None:
        recipe.quantity = recipe_data.quantity
    
    await db.commit()
    await db.refresh(recipe)
    
    # Получаем названия для ответа
    menu_result = await db.execute(select(MenuItem.name).where(MenuItem.id == recipe.menu_item_id))
    menu_name = menu_result.scalar_one_or_none()
    ing_result = await db.execute(select(Ingredient.name).where(Ingredient.id == recipe.ingredient_id))
    ingredient_name = ing_result.scalar_one_or_none()
    
    return ApiResponse(
        success=True, 
        data=recipe_to_dict(recipe, menu_name, ingredient_name), 
        message="Рецепт обновлен"
    )

@router.delete("/{recipe_id}", response_model=ApiResponse)
async def delete_recipe(
    recipe_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Удаление рецепта"""
    if current_user.role not in ["director", "technologist"]:
        raise HTTPException(status_code=403, detail="Недостаточно прав")
    
    result = await db.execute(select(Recipe).where(Recipe.id == recipe_id))
    recipe = result.scalar_one_or_none()
    
    if not recipe:
        raise HTTPException(status_code=404, detail="Рецепт не найден")
    
    await db.delete(recipe)
    await db.commit()
    
    return ApiResponse(success=True, message="Рецепт удален")