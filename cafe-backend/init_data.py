import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.models import Base, MenuItem, Ingredient
from app.database import DATABASE_URL, AsyncSessionLocal

async def init_data():
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    async with AsyncSessionLocal() as session:
        # Добавляем тестовые позиции меню
        menu_items = [
            MenuItem(name="Латте", category="Кофе", category_id=1, price=350, is_available=True, description="Классический латте", preparation_time=3),
            MenuItem(name="Капучино", category="Кофе", category_id=1, price=280, is_available=True, description="Эспрессо с пенкой", preparation_time=2),
            MenuItem(name="Раф", category="Кофе", category_id=1, price=350, is_available=True, description="Кофе со сливками", preparation_time=3),
            MenuItem(name="Круассан", category="Выпечка", category_id=2, price=250, is_available=True, description="Французский круассан", preparation_time=1),
            MenuItem(name="Чизкейк", category="Десерты", category_id=3, price=300, is_available=True, description="Нью-Йорк чизкейк", preparation_time=1),
        ]
        
        for item in menu_items:
            session.add(item)
        
        # Добавляем тестовые ингредиенты
        ingredients = [
            Ingredient(name="Зерна кофе", category="Кофе", unit="кг", stock_quantity=5.2, min_stock_level=3, unit_cost=1200),
            Ingredient(name="Молоко", category="Молочные", unit="л", stock_quantity=8.5, min_stock_level=5, unit_cost=85),
            Ingredient(name="Сахар", category="Бакалея", unit="кг", stock_quantity=2.1, min_stock_level=1, unit_cost=60),
            Ingredient(name="Мука", category="Бакалея", unit="кг", stock_quantity=1.5, min_stock_level=2, unit_cost=50),
        ]
        
        for ingredient in ingredients:
            session.add(ingredient)
        
        await session.commit()
    
    print("Test data initialized successfully!")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_data())
