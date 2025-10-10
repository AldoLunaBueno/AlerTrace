from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import os
from .worker import init_worker

# Importar los routers modulares
from app.routes import auth, health
from .routes.sensores import router as sensores_router
from .routes.cultivos import router as cultivos_router
from .routes.dashboard import router as dashboard_router
from .routes.alertas import router as alertas_router

app = FastAPI(
    title="SachaTrace API",
    description="Agricultural IoT monitoring system",
    version="1.1.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",  # Development
    "https://sachatrace.vercel.app",  # Production
]
if origins_env := os.getenv("ALLOWED_ORIGINS"):
    origins.extend(origins_env.split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers
app.include_router(auth.router)
app.include_router(sensores_router)
app.include_router(cultivos_router)
app.include_router(dashboard_router)
app.include_router(alertas_router)
app.include_router(health.router, tags=["Health"])


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

# Iniciar el worker cuando se inicia la aplicación
@app.on_event("startup")
def startup_event():
    """Evento que se ejecuta al iniciar la aplicación"""
    init_worker()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)