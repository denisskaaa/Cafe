from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime

from app.database import get_db
from app.models.models import Customer, Employee
from app.schemas.schemas import ApiResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/crm", tags=["CRM"])

# Функция преобразования Customer в словарь
def customer_to_dict(customer: Customer) -> dict:
    return {
        "id": customer.id,
        "name": customer.name,
        "phone": customer.phone,
        "email": customer.email,
        "bonus_points": customer.bonus_points,
        "loyalty_tier": customer.loyalty_tier,
        "total_spent": float(customer.total_spent) if customer.total_spent else 0,
        "total_orders": customer.total_orders or 0,
        "registered_at": customer.registered_at.isoformat() if customer.registered_at else None,
        "last_visit": customer.last_visit.isoformat() if customer.last_visit else None
    }

@router.get("/customers", response_model=ApiResponse)
async def get_customers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str = None,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение списка клиентов"""
    offset = (page - 1) * per_page
    
    query = select(Customer)
    if search:
        query = query.where(
            (Customer.name.ilike(f"%{search}%")) |
            (Customer.phone.ilike(f"%{search}%")) |
            (Customer.email.ilike(f"%{search}%"))
        )
    
    result = await db.execute(query.order_by(Customer.registered_at.desc()).offset(offset).limit(per_page))
    customers = result.scalars().all()
    
    total_result = await db.execute(select(func.count()).select_from(Customer))
    total = total_result.scalar()
    
    # Преобразуем каждого клиента в словарь
    items = [customer_to_dict(customer) for customer in customers]
    
    return ApiResponse(
        success=True,
        data={
            "items": items,
            "total": total,
            "page": page,
            "per_page": per_page
        }
    )

@router.post("/customers", response_model=ApiResponse)
async def create_customer(
    customer_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Создание нового клиента"""
    customer_data["registered_at"] = datetime.now()
    customer_data["last_visit"] = datetime.now()
    
    new_customer = Customer(**customer_data)
    db.add(new_customer)
    await db.commit()
    await db.refresh(new_customer)
    
    return ApiResponse(success=True, data=customer_to_dict(new_customer), message="Клиент добавлен")

@router.post("/customers/{customer_id}/bonus", response_model=ApiResponse)
async def add_bonus_points(
    customer_id: int,
    points: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Начисление бонусных баллов клиенту"""
    result = await db.execute(select(Customer).where(Customer.id == customer_id))
    customer = result.scalar_one_or_none()
    
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    customer.bonus_points += points
    
    # Обновляем уровень лояльности
    if customer.bonus_points >= 1000:
        customer.loyalty_tier = "gold"
    elif customer.bonus_points >= 500:
        customer.loyalty_tier = "silver"
    else:
        customer.loyalty_tier = "bronze"
    
    await db.commit()
    
    return ApiResponse(success=True, data=customer_to_dict(customer), message=f"Начислено {points} бонусов")