from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base

class UserRole(str, enum.Enum):
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

class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    PREPARING = "preparing"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class OrderType(str, enum.Enum):
    DINE_IN = "dine_in"
    TAKEAWAY = "takeaway"
    DELIVERY = "delivery"

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    position = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=False)
    department = Column(String(100), nullable=False)
    hourly_rate = Column(Float, nullable=False)
    hired_date = Column(DateTime, default=datetime.utcnow, nullable=True)
    status = Column(String(20), default="active")
    
    shifts = relationship("Shift", back_populates="employee")
    orders = relationship("Order", back_populates="employee")

class Shift(Base):
    __tablename__ = "shifts"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    date = Column(DateTime, nullable=False)
    time_start = Column(String(10), nullable=False)
    time_end = Column(String(10), nullable=False)
    actual_start = Column(DateTime, nullable=True)
    actual_end = Column(DateTime, nullable=True)
    status = Column(String(20), default="scheduled")
    
    employee = relationship("Employee", back_populates="shifts")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True)
    type = Column(Enum(OrderType), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_amount = Column(Float, nullable=False)
    items = Column(JSON, default=list)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="orders")
    customer = relationship("Customer", back_populates="orders")

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    phone = Column(String(20), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    bonus_points = Column(Integer, default=0)
    loyalty_tier = Column(String(20), default="bronze")
    total_spent = Column(Float, default=0)
    total_orders = Column(Integer, default=0)
    registered_at = Column(DateTime, default=datetime.utcnow)
    last_visit = Column(DateTime, default=datetime.utcnow)
    
    orders = relationship("Order", back_populates="customer")

class Ingredient(Base):
    __tablename__ = "ingredients"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    unit = Column(String(20), nullable=False)
    stock_quantity = Column(Float, default=0)
    min_stock_level = Column(Float, default=0)
    unit_cost = Column(Float, nullable=False)

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    category_id = Column(Integer)
    price = Column(Float, nullable=False)
    is_available = Column(Boolean, default=True)
    description = Column(String(500), nullable=True)
    preparation_time = Column(Integer, default=5)
