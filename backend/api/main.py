from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import time
import os
from api.worker import init_worker

# Importar los routers modulares
from api.routes import auth, health
from api.routes.sensores import router as sensores_router
from api.routes.cultivos import router as cultivos_router
from api.routes.dashboard import router as dashboard_router
from api.routes.alertas import router as alertas_router
from api.routes.farms import router as farms_router
from api.routes.lots import router as lots_router
from api.routes.blockchain import router as blockchain_router

app = FastAPI(
    title="Alertrace API",
    description="Sistema de monitoreo IoT agrícola",
    version="1.1.0"
)

# Configuración CORS
origins = [
    "http://localhost:3000",  # Desarrollo
    "https://alertrace.vercel.app",  # Producción
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
app.include_router(farms_router)
app.include_router(lots_router)
app.include_router(blockchain_router)
app.include_router(health.router, tags=["Health"])


@app.get("/", tags=["Sistema"])
def root():
    """Endpoint raíz con información básica del API"""
    return {
        "message": "Alertrace API - Sistema de Trazabilidad Agrícola",
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