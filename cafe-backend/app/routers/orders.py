from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

from app.database import get_db
from app.models.models import Order, Employee, Customer, OrderStatus
from app.schemas.schemas import OrderCreate, ApiResponse
from app.routers.auth import get_current_user

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

@router.post("/", response_model=ApiResponse)
async def create_order(
    order_data: OrderCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Создание нового заказа"""
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
    
    # Обновляем статистику клиента если есть
    if order_data.customer_id:
        customer_result = await db.execute(select(Customer).where(Customer.id == order_data.customer_id))
        customer = customer_result.scalar_one_or_none()
        if customer:
            customer.total_spent += total_amount
            customer.total_orders += 1
            customer.last_visit = datetime.now()
            await db.commit()
    
    return ApiResponse(success=True, data=order_to_dict(new_order), message="Заказ успешно создан")

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