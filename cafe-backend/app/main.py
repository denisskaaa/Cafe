from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, orders, staff, stock, crm, analytics, menu, recipes

app = FastAPI(
    title="CaféManager API",
    description="Информационная система управления кофейней",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Временно разрешаем все источники
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем все роутеры
app.include_router(auth.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(staff.router, prefix="/api")
app.include_router(stock.router, prefix="/api")
app.include_router(crm.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(menu.router, prefix="/api")
app.include_router(recipes.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "CaféManager API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/api/docs",
            "auth": "/api/auth",
            "orders": "/api/orders",
            "staff": "/api/staff",
            "stock": "/api/stock",
            "crm": "/api/crm",
            "analytics": "/api/analytics",
            "menu": "/api/menu"
        }
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )