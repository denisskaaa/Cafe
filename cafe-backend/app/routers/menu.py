from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.models import MenuItem, Employee
from app.schemas.schemas import ApiResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("/items", response_model=ApiResponse)
async def get_menu_items(
    category: str = None,
    available_only: bool = False,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение списка позиций меню"""
    query = select(MenuItem)
    
    if category:
        query = query.where(MenuItem.category == category)
    
    if available_only:
        query = query.where(MenuItem.is_available == True)
    
    result = await db.execute(query.order_by(MenuItem.category, MenuItem.name))
    items = result.scalars().all()
    
    return ApiResponse(success=True, data=items)

@router.get("/items/{item_id}", response_model=ApiResponse)
async def get_menu_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Получение позиции меню по ID"""
    result = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    return ApiResponse(success=True, data=item)

@router.post("/items", response_model=ApiResponse)
async def create_menu_item(
    item_data: dict,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Создание новой позиции меню (только для технолога/директора)"""
    if current_user.role not in ["director", "technologist"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    new_item = MenuItem(**item_data)
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    
    return ApiResponse(success=True, data=new_item, message="Позиция добавлена")

@router.patch("/items/{item_id}/availability", response_model=ApiResponse)
async def toggle_item_availability(
    item_id: int,
    is_available: bool,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    """Изменение доступности позиции"""
    result = await db.execute(select(MenuItem).where(MenuItem.id == item_id))
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    item.is_available = is_available
    await db.commit()
    
    status_text = "доступна" if is_available else "недоступна"
    return ApiResponse(success=True, data=item, message=f"Позиция {status_text}")
