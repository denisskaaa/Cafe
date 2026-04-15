from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.models import Ingredient, Employee
from app.schemas.schemas import ApiResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/stock", tags=["Stock"])

# Функция преобразования Ingredient в словарь
def ingredient_to_dict(ingredient: Ingredient) -> dict:
    return {
        "id": ingredient.id,
        "name": ingredient.name,
        "category": ingredient.category,
        "unit": ingredient.unit,
        "stock_quantity": float(ingredient.stock_quantity),
        "min_stock_level": float(ingredient.min_stock_level),
        "unit_cost": float(ingredient.unit_cost)
    }

@router.get("/ingredients", response_model=ApiResponse)
async def get_ingredients(
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение списка всех ингредиентов"""
    result = await db.execute(select(Ingredient))
    ingredients = result.scalars().all()
    
    # Преобразуем каждый ингредиент в словарь
    data = [ingredient_to_dict(ing) for ing in ingredients]
    
    return ApiResponse(success=True, data=data)

@router.get("/ingredients/low-stock", response_model=ApiResponse)
async def get_low_stock_ingredients(
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение ингредиентов с низким запасом"""
    result = await db.execute(
        select(Ingredient).where(
            Ingredient.stock_quantity <= Ingredient.min_stock_level
        )
    )
    ingredients = result.scalars().all()
    
    data = [ingredient_to_dict(ing) for ing in ingredients]
    
    return ApiResponse(success=True, data=data)

@router.patch("/ingredients/{ingredient_id}", response_model=ApiResponse)
async def update_ingredient_stock(
    ingredient_id: int,
    quantity: float,
    operation: str = "set",
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Обновление количества ингредиента"""
    result = await db.execute(select(Ingredient).where(Ingredient.id == ingredient_id))
    ingredient = result.scalar_one_or_none()
    
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    
    if operation == "add":
        ingredient.stock_quantity += quantity
    elif operation == "subtract":
        ingredient.stock_quantity -= quantity
    else:
        ingredient.stock_quantity = quantity
    
    await db.commit()
    
    return ApiResponse(success=True, data=ingredient_to_dict(ingredient), message="Остаток обновлен")
