import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.database import DATABASE_URL

async def init_db():
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with engine.begin() as conn:
        # Создаем пользователя с правильными значениями ENUM (в верхнем регистре)
        await conn.execute(text("""
            INSERT INTO employees (full_name, email, hashed_password, role, position, phone, department, hourly_rate, status)
            VALUES ('Иван Директоров', 'director@coffee.ru', '$2b$12$KIXQzT9sLUVXxQxHxHxHxOZVjqH5L5L5L5L5L5L5L5L5L5L5L5L5', 'DIRECTOR', 'Директор', '+7 (999) 123-45-67', 'Управление', 1000, 'active')
            ON CONFLICT (email) DO NOTHING
        """))
        print("✅ User 'director@coffee.ru' created!")
        
        # Добавим еще одного пользователя для теста
        await conn.execute(text("""
            INSERT INTO employees (full_name, email, hashed_password, role, position, phone, department, hourly_rate, status)
            VALUES ('Анна Бариста', 'barista@coffee.ru', '$2b$12$KIXQzT9sLUVXxQxHxHxHxOZVjqH5L5L5L5L5L5L5L5L5L5L5L5L5', 'BARISTA', 'Старший бариста', '+7 (999) 234-56-78', 'Производство', 500, 'active')
            ON CONFLICT (email) DO NOTHING
        """))
        print("✅ User 'barista@coffee.ru' created!")
        
        # Проверим что пользователи добавлены
        result = await conn.execute(text("SELECT email, role FROM employees"))
        rows = result.fetchall()
        print("\n📋 Users in database:")
        for row in rows:
            print(f"   - {row[0]} (role: {row[1]})")
    
    await engine.dispose()
    print("\n✅ Database initialization complete!")

if __name__ == "__main__":
    asyncio.run(init_db())
