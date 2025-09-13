from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time
import logging
from typing import Optional

# Importar configuración
from .config import settings

# Configurar logging
logging.basicConfig(
    level=getattr(logging, settings.log_level, logging.INFO),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Crear la aplicación FastAPI
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="API para trazabilidad agrícola con monitoreo IoT",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos básicos
class SensorData(BaseModel):
    sensor_id: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_moisture: Optional[float] = None
    timestamp: Optional[str] = None

class HealthCheck(BaseModel):
    status: str
    timestamp: int
    version: str
    environment: str

# Rutas básicas
@app.get("/")
async def root():
    return {
        "message": "SachaTrace API - Sistema de Trazabilidad Agrícola",
        "version": settings.app_version,
        "environment": settings.environment,
        "status": "operational"
    }

@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint para monitoreo"""
    try:
        return HealthCheck(
            status="healthy",
            timestamp=int(time.time()),
            version=settings.app_version,
            environment=settings.environment
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")

@app.get("/info")
async def app_info():
    """Información de la aplicación"""
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "debug_mode": settings.debug,
        "cors_origins": settings.cors_origins,
        "features": {
            "authentication": False,  # Por implementar
            "database": True,
            "sensor_integration": False,  # Por implementar
            "timestream_storage": False,  # Por implementar
            "lambda_processing": False  # Por implementar
        }
    }

# Rutas de sensores (básicas)
@app.post("/api/v1/sensor/data")
async def receive_sensor_data(data: SensorData):
    """Recibe datos de sensores (versión básica)"""
    try:
        logger.info(f"Datos de sensor recibidos: {data.sensor_id}")
        
        # Por ahora solo loggeamos los datos
        # TODO: Implementar almacenamiento en base de datos
        
        return {
            "status": "success",
            "message": "Datos de sensor recibidos correctamente",
            "sensor_id": data.sensor_id,
            "timestamp": int(time.time())
        }
    except Exception as e:
        logger.error(f"Error procesando datos del sensor: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/sensor/{sensor_id}/status")
async def get_sensor_status(sensor_id: str):
    """Obtiene el estado de un sensor específico"""
    return {
        "sensor_id": sensor_id,
        "status": "active",
        "last_reading": int(time.time()),
        "message": "Sensor funcionando normalmente"
    }

@app.get("/api/v1/sensors")
async def list_sensors():
    """Lista todos los sensores"""
    # TODO: Implementar consulta a base de datos
    return {
        "sensors": [],
        "count": 0,
        "message": "Lista de sensores (por implementar conectividad a BD)"
    }

# ========================
# EVENTOS DE APLICACIÓN 
# ========================

@app.on_event("startup")
async def startup_event():
    logger.info(f"Iniciando {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")
    
    # TODO: Inicializar conexión a base de datos
    # TODO: Verificar conexión a AWS services

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Cerrando aplicación...")

# ========================
# PUNTO DE ENTRADA
# ========================

# ========================
# PARA DESARROLLO
# ========================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )