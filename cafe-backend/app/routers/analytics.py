from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta

from app.database import get_db
from app.models.models import Order, Employee, Ingredient, OrderStatus
from app.schemas.schemas import DashboardStats, ApiResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение статистики для дашборда"""
    today = datetime.now().date()
    today_start = datetime.combine(today, datetime.min.time())
    today_end = datetime.combine(today, datetime.max.time())
    
    # Выручка сегодня
    revenue_result = await db.execute(
        select(func.sum(Order.total_amount)).where(
            and_(
                Order.created_at >= today_start,
                Order.created_at <= today_end,
                Order.status == OrderStatus.COMPLETED
            )
        )
    )
    today_revenue = revenue_result.scalar() or 0
    
    # Количество заказов сегодня
    orders_result = await db.execute(
        select(func.count()).where(
            and_(
                Order.created_at >= today_start,
                Order.created_at <= today_end
            )
        )
    )
    today_orders = orders_result.scalar() or 0
    
    # Средний чек
    avg_check = today_revenue / today_orders if today_orders > 0 else 0
    
    # Активные сотрудники
    staff_result = await db.execute(
        select(func.count()).where(Employee.status == "active")
    )
    active_staff = staff_result.scalar() or 0
    
    # Ингредиенты с низким запасом
    stock_result = await db.execute(
        select(func.count()).where(
            Ingredient.stock_quantity <= Ingredient.min_stock_level
        )
    )
    low_stock_items = stock_result.scalar() or 0
    
    # Топ-5 позиций
    top_items = []
    
    return DashboardStats(
        today_revenue=float(today_revenue),
        today_orders=today_orders,
        average_check=round(avg_check, 2),
        active_staff=active_staff,
        low_stock_items=low_stock_items,
        top_items=top_items
    )

@router.get("/revenue", response_model=ApiResponse)
async def get_revenue_stats(
    days: int = 7,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение статистики по выручке за период"""
    start_date = datetime.now() - timedelta(days=days)
    
    result = await db.execute(
        select(
            func.date(Order.created_at).label("date"),
            func.sum(Order.total_amount).label("revenue"),
            func.count().label("orders")
        ).where(
            Order.created_at >= start_date,
            Order.status == OrderStatus.COMPLETED
        ).group_by(func.date(Order.created_at))
    )
    
    data = [{"date": str(row.date), "revenue": float(row.revenue or 0), "orders": row.orders} for row in result]
    
    return ApiResponse(success=True, data=data)
