from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum

class UserRole(str, Enum):
    DIRECTOR = "director"
    HR_MANAGER = "hr_manager"
    MARKETER = "marketer"
    ANALYST = "analyst"
    LOGISTICS_MANAGER = "logistics_manager"
    TECHNOLOGIST = "technologist"
    SHIFT_ADMIN = "shift_admin"
    BARISTA = "barista"
    TECH_STAFF = "tech_staff"
    SYS_ADMIN = "sys_admin"

class OrderStatus(str, Enum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: UserRole
    position: str
    phone: str
    department: str
    hourly_rate: float

class UserResponse(UserBase):
    id: int
    hired_date: Optional[datetime] = None
    status: str
    
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    type: str
    items: List[Dict[str, Any]]
    customer_id: Optional[int] = None

class OrderResponse(BaseModel):
    id: int
    order_number: str
    type: str
    status: OrderStatus
    total_amount: float
    items: List[Dict[str, Any]]
    customer_id: Optional[int]
    employee_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ShiftCreate(BaseModel):
    employee_id: int
    date: datetime
    time_start: str
    time_end: str

class ShiftResponse(BaseModel):
    id: int
    employee_id: int
    employee_name: str
    date: datetime
    time_start: str
    time_end: str
    status: str
    
    class Config:
        from_attributes = True

class ApiResponse(BaseModel):
    success: bool
    data: Optional[Any] = None
    message: Optional[str] = None
    error: Optional[str] = None

class DashboardStats(BaseModel):
    today_revenue: float
    today_orders: int
    average_check: float
    active_staff: int
    low_stock_items: int
    top_items: List[Dict[str, Any]]