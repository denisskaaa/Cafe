from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

from app.database import get_db
from app.models.models import Order, Employee, Customer, OrderStatus
from app.schemas.schemas import OrderCreate, ApiResponse
from app.routers.auth import get_current_user
from app.models.models import Recipe, Ingredient

router = APIRouter(prefix="/orders", tags=["Orders"])

# Функция для преобразования Order в словарь
def order_to_dict(order: Order) -> dict:
    return {
        "id": order.id,
        "order_number": order.order_number,
        "type": order.type.value if hasattr(order.type, 'value') else order.type,
        "status": order.status.value if hasattr(order.status, 'value') else order.status,
        "total_amount": float(order.total_amount),
        "items": order.items,
        "customer_id": order.customer_id,
        "employee_id": order.employee_id,
        "created_at": order.created_at.isoformat() if order.created_at else None
    }

@router.get("/", response_model=ApiResponse)
async def get_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение списка заказов с пагинацией"""
    offset = (page - 1) * per_page
    
    result = await db.execute(
        select(Order).order_by(Order.created_at.desc()).offset(offset).limit(per_page)
    )
    orders = result.scalars().all()
    
    total_result = await db.execute(select(func.count()).select_from(Order))
    total = total_result.scalar()
    
    # Преобразуем каждый заказ в словарь
    items = [order_to_dict(order) for order in orders]
    
    return ApiResponse(
        success=True,
        data={
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": (total + per_page - 1) // per_page
        }
    )

@router.get("/active", response_model=ApiResponse)
async def get_active_orders(
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение активных заказов (не завершенные)"""
    result = await db.execute(
        select(Order).where(
            Order.status.in_([OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.READY])
        ).order_by(Order.created_at)
    )
    orders = result.scalars().all()
    
    # Преобразуем каждый заказ в словарь
    items = [order_to_dict(order) for order in orders]
    
    return ApiResponse(success=True, data=items)

@router.get("/{order_id}", response_model=ApiResponse)
async def get_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение заказа по ID"""
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return ApiResponse(success=True, data=order_to_dict(order))

async def deduct_ingredients(db: AsyncSession, items: list):
    """Списание ингредиентов при создании заказа"""
    deductions = []
    
    for order_item in items:
        menu_item_id = order_item.get('menu_item_id')
        quantity = order_item.get('quantity', 1)
        
        # Получаем рецепт блюда
        result = await db.execute(
            select(Recipe).where(Recipe.menu_item_id == menu_item_id)
        )
        recipes = result.scalars().all()
        
        # Если рецепта нет, пропускаем (не все блюда могут требовать ингредиенты)
        if not recipes:
            continue
        
        for recipe in recipes:
            # Получаем ингредиент
            ing_result = await db.execute(
                select(Ingredient).where(Ingredient.id == recipe.ingredient_id)
            )
            ingredient = ing_result.scalar_one()
            
            # Рассчитываем сколько нужно списать
            required = recipe.quantity * quantity
            
            # Проверяем достаточно ли ингредиентов
            if ingredient.stock_quantity < required:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Недостаточно ингредиента: {ingredient.name}. Нужно: {required}, в наличии: {ingredient.stock_quantity}"
                )
            
            # Списание
            ingredient.stock_quantity -= required
            deductions.append({
                "ingredient": ingredient.name,
                "deducted": required,
                "remaining": round(ingredient.stock_quantity, 2)
            })
    
    return deductions


@router.post("/", response_model=ApiResponse)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Создание нового заказа с автоматическим списанием ингредиентов"""
    
    # 1. Проверяем и списываем ингредиенты
    try:
        deductions = await deduct_ingredients(db, order_data.items)
    except HTTPException as e:
        return ApiResponse(success=False, error=e.detail, message="Ошибка при проверке ингредиентов")
    
    # 2. Создаем заказ
    order_number = f"ORD{int(datetime.now().timestamp())}"
    total_amount = sum(item.get('total', 0) for item in order_data.items)
    
    new_order = Order(
        order_number=order_number,
        type=order_data.type,
        status=OrderStatus.PENDING,
        total_amount=total_amount,
        items=order_data.items,
        customer_id=order_data.customer_id,
        employee_id=current_user.id,
        created_at=datetime.now()
    )
    
    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)
    
    # 3. Обновляем статистику клиента если есть
    if order_data.customer_id:
        customer_result = await db.execute(select(Customer).where(Customer.id == order_data.customer_id))
        customer = customer_result.scalar_one_or_none()
        if customer:
            customer.total_spent += total_amount
            customer.total_orders += 1
            customer.last_visit = datetime.now()
            await db.commit()
    
    # 4. Формируем ответ
    order_dict = {
        "id": new_order.id,
        "order_number": new_order.order_number,
        "type": new_order.type.value if hasattr(new_order.type, 'value') else new_order.type,
        "status": new_order.status.value if hasattr(new_order.status, 'value') else new_order.status,
        "total_amount": float(new_order.total_amount),
        "items": new_order.items,
        "customer_id": new_order.customer_id,
        "employee_id": new_order.employee_id,
        "created_at": new_order.created_at.isoformat() if new_order.created_at else None
    }
    
    return ApiResponse(
        success=True, 
        data={
            "order": order_dict,
            "stock_deductions": deductions
        }, 
        message=f"Заказ #{order_number} успешно создан. Ингредиенты списаны."
    )

@router.patch("/{order_id}/status", response_model=ApiResponse)
async def update_order_status(
    order_id: int,
    status: str,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Обновление статуса заказа"""
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    await db.commit()
    await db.refresh(order)
    
    return ApiResponse(success=True, data=order_to_dict(order), message="Статус обновлен")

@router.post("/{order_id}/cancel", response_model=ApiResponse)
async def cancel_order(
    order_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Отмена заказа"""
    result = await db.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.status in [OrderStatus.COMPLETED, OrderStatus.CANCELLED]:
        raise HTTPException(status_code=400, detail="Cannot cancel completed or cancelled order")
    
    order.status = OrderStatus.CANCELLED
    await db.commit()
    await db.refresh(order)
    
    return ApiResponse(success=True, data=order_to_dict(order), message="Заказ отменен")

async def deduct_ingredients(db: AsyncSession, items: list):
    """Списание ингредиентов при создании заказа"""
    deductions = []
    
    for order_item in items:
        menu_item_id = order_item.get('menu_item_id')
        quantity = order_item.get('quantity', 1)
        
        # Получаем рецепт блюда
        result = await db.execute(
            select(Recipe).where(Recipe.menu_item_id == menu_item_id)
        )
        recipes = result.scalars().all()
        
        for recipe in recipes:
            # Получаем ингредиент
            ing_result = await db.execute(
                select(Ingredient).where(Ingredient.id == recipe.ingredient_id)
            )
            ingredient = ing_result.scalar_one()
            
            # Рассчитываем сколько нужно списать
            required = recipe.quantity * quantity
            
            if ingredient.stock_quantity < required:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Недостаточно ингредиента: {ingredient.name}"
                )
            
            # Списание
            ingredient.stock_quantity -= required
            deductions.append({
                "ingredient": ingredient.name,
                "deducted": required,
                "remaining": ingredient.stock_quantity
            })
    
    return deductions

@router.get("/check-availability/{menu_item_id}", response_model=ApiResponse)
async def check_item_availability(
    menu_item_id: int,
    quantity: int = 1,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Проверка возможности приготовления блюда"""
    result = await db.execute(
        select(Recipe).where(Recipe.menu_item_id == menu_item_id)
    )
    recipes = result.scalars().all()
    
    # Если рецепта нет, блюдо всегда доступно
    if not recipes:
        return ApiResponse(
            success=True,
            data={
                "available": True,
                "message": "Для этого блюда не требуется ингредиентов"
            }
        )
    
    availability = []
    can_make = True
    missing_ingredients = []
    
    for recipe in recipes:
        ing_result = await db.execute(
            select(Ingredient).where(Ingredient.id == recipe.ingredient_id)
        )
        ingredient = ing_result.scalar_one()
        
        required = recipe.quantity * quantity
        available = ingredient.stock_quantity >= required
        
        availability.append({
            "ingredient": ingredient.name,
            "required": round(required, 2),
            "available": round(ingredient.stock_quantity, 2),
            "unit": ingredient.unit,
            "sufficient": available
        })
        
        if not available:
            can_make = False
            missing_ingredients.append({
                "name": ingredient.name,
                "required": round(required, 2),
                "available": round(ingredient.stock_quantity, 2),
                "unit": ingredient.unit
            })
    
    return ApiResponse(
        success=True,
        data={
            "available": can_make,
            "can_make": can_make,
            "ingredients": availability,
            "missing_ingredients": missing_ingredients if not can_make else None
        }
    )