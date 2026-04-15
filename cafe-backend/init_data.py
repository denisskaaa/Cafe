import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.models import Base, MenuItem, Ingredient, Recipe
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
        
        await session.flush()  # Чтобы получить ID
        
        # Добавляем тестовые ингредиенты
        ingredients = [
            Ingredient(name="Зерна кофе", category="Кофе", unit="кг", stock_quantity=5.2, min_stock_level=3, unit_cost=1200),
            Ingredient(name="Молоко", category="Молочные", unit="л", stock_quantity=8.5, min_stock_level=5, unit_cost=85),
            Ingredient(name="Сахар", category="Бакалея", unit="кг", stock_quantity=2.1, min_stock_level=1, unit_cost=60),
            Ingredient(name="Мука", category="Бакалея", unit="кг", stock_quantity=1.5, min_stock_level=2, unit_cost=50),
            Ingredient(name="Масло сливочное", category="Молочные", unit="кг", stock_quantity=0.8, min_stock_level=1, unit_cost=400),
            Ingredient(name="Яйца", category="Бакалея", unit="шт", stock_quantity=30, min_stock_level=20, unit_cost=10),
            Ingredient(name="Сироп карамельный", category="Сиропы", unit="л", stock_quantity=1.2, min_stock_level=0.5, unit_cost=350),
        ]
        
        for ingredient in ingredients:
            session.add(ingredient)
        
        await session.flush()
        
        # Получаем ID блюд и ингредиентов
        menu_map = {item.name: item.id for item in menu_items}
        ing_map = {ing.name: ing.id for ing in ingredients}
        
        # Добавляем рецепты
        recipes = [
            # Латте
            Recipe(menu_item_id=menu_map["Латте"], ingredient_id=ing_map["Зерна кофе"], quantity=0.02),
            Recipe(menu_item_id=menu_map["Латте"], ingredient_id=ing_map["Молоко"], quantity=0.2),
            Recipe(menu_item_id=menu_map["Латте"], ingredient_id=ing_map["Сахар"], quantity=0.01),
            # Капучино
            Recipe(menu_item_id=menu_map["Капучино"], ingredient_id=ing_map["Зерна кофе"], quantity=0.02),
            Recipe(menu_item_id=menu_map["Капучино"], ingredient_id=ing_map["Молоко"], quantity=0.15),
            Recipe(menu_item_id=menu_map["Капучино"], ingredient_id=ing_map["Сахар"], quantity=0.01),
            # Круассан
            Recipe(menu_item_id=menu_map["Круассан"], ingredient_id=ing_map["Мука"], quantity=0.05),
            Recipe(menu_item_id=menu_map["Круассан"], ingredient_id=ing_map["Масло сливочное"], quantity=0.02),
            Recipe(menu_item_id=menu_map["Круассан"], ingredient_id=ing_map["Яйца"], quantity=0.5),
        ]
        
        for recipe in recipes:
            session.add(recipe)
        
        await session.commit()
    
    print("✅ Test data initialized successfully!")
    print("📋 Menu items, ingredients and recipes added")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_data())