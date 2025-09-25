"""
API Backend para SachaTrace - Sistema de Trazabilidad Agrícola
FastAPI con autenticación JWT y base de datos PostgreSQL
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time

# Importar los routers modulares
from app.routes import auth, cultivos, admin, dashboard, sensores
from .routes.cultivos import router as cultivos_router
from .routes.admin import router as admin_router
from .routes.dashboard import router as dashboard_router

app = FastAPI(
    title="SachaTrace API",
    description="Sistema de Trazabilidad Agrícola",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(cultivos.router)
app.include_router(admin.router)
app.include_router(dashboard.router)
app.include_router(sensores.router)


@app.get("/", tags=["Sistema"])
def root():
    """Endpoint raíz con información básica del API"""
    return {
        "message": "SachaTrace API - Sistema de Trazabilidad Agrícola",
        "version": "1.0.0",
        "status": "running",
        "documentation": "/docs",
        "timestamp": int(time.time())
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)