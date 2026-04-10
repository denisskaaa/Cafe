import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.models import Base, Employee, UserRole
from app.routers.auth import get_password_hash
from app.database import DATABASE_URL

async def init_db():
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    from sqlalchemy import insert
    from app.database import AsyncSessionLocal
    
    async with AsyncSessionLocal() as session:
        # Создаем тестовых пользователей
        users = [
            {
                "full_name": "Иван Директоров",
                "email": "director@coffee.ru",
                "hashed_password": get_password_hash("123456"),
                "role": UserRole.DIRECTOR,
                "position": "Директор",
                "phone": "+7 (999) 123-45-67",
                "department": "Управление",
                "hourly_rate": 1000,
                "status": "active"
            },
            {
                "full_name": "Анна Бариста",
                "email": "barista@coffee.ru",
                "hashed_password": get_password_hash("123456"),
                "role": UserRole.BARISTA,
                "position": "Старший бариста",
                "phone": "+7 (999) 234-56-78",
                "department": "Производство",
                "hourly_rate": 500,
                "status": "active"
            }
        ]
        
        for user_data in users:
            result = await session.execute(
                insert(Employee).values(**user_data).returning(Employee)
            )
            await session.commit()
    
    print("Database initialized successfully!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_db())
