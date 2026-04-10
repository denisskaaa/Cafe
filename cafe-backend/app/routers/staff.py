from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.database import get_db
from app.models.models import Employee, Shift
from app.schemas.schemas import UserResponse, ShiftCreate, ShiftResponse, ApiResponse
from app.routers.auth import get_current_user, get_password_hash

router = APIRouter(prefix="/staff", tags=["Staff"])

@router.get("/employees", response_model=ApiResponse)
async def get_employees(
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    result = await db.execute(select(Employee))
    employees = result.scalars().all()
    return ApiResponse(success=True, data=employees)

@router.get("/employees/{employee_id}", response_model=ApiResponse)
async def get_employee(
    employee_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    result = await db.execute(select(Employee).where(Employee.id == employee_id))
    employee = result.scalar_one_or_none()
    
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return ApiResponse(success=True, data=employee)

@router.get("/shifts", response_model=ApiResponse)
async def get_shifts(
    start_date: str,
    end_date: str,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    result = await db.execute(
        select(Shift).where(
            Shift.date.between(start_date, end_date)
        ).order_by(Shift.date)
    )
    shifts = result.scalars().all()
    return ApiResponse(success=True, data=shifts)

@router.post("/shifts", response_model=ApiResponse)
async def create_shift(
    shift_data: ShiftCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Employee = Depends(get_current_user)
):
    new_shift = Shift(**shift_data.dict())
    db.add(new_shift)
    await db.commit()
    await db.refresh(new_shift)
    
    return ApiResponse(success=True, data=new_shift, message="Смена создана")