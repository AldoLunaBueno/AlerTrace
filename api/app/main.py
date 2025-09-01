from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime
from typing import Optional
from sqlalchemy.orm import Session

# Importar nuestra configuración y modelos de base de datos
from .config import settings
from .models.database import get_db

# FASTAPI
app = FastAPI(
    title=settings.app_name,
    description="API que recolecta datos de sensores IoT para monitoreo agrícola",
    version=settings.app_version,
    debug=settings.debug
)

# ========================
# CORS
# ========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================
# MODELOS DE DATOS
# ========================
class SensorData(BaseModel):
    sensor_id: str
    temperature: float
    humidity: float
    soil_moisture: float
    timestamp: Optional[str] = None

class SensorResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None


# ========================
# ENDPOINTS
# ========================
@app.get("/")
async def index():
    return {
        "message": f"Bienvenido a {settings.app_name}",
        "version": settings.app_version,
        "environment": settings.environment.value
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.environment.value,
        "timestamp": datetime.datetime.now().isoformat()
    }


@app.post("/sensor/data", response_model=SensorResponse)
async def receive_sensor_data(data: SensorData, db: Session = Depends(get_db)):
    """
    Recibe datos de sensores IoT y los almacena en Timestream para análisis temporal.
    Los datos de configuración del sensor se mantienen en PostgreSQL.
    """
    try:
        # Agregar timestamp si no viene incluido
        if not data.timestamp:
            data.timestamp = datetime.datetime.utcnow().isoformat()

        # TODO: Implementar envío a Amazon Timestream
        # timestream_client.write_records(...)
        
        # Log para desarrollo
        print(f"Datos de sensor recibidos: {data.dict()}")
        
        return SensorResponse(
            status="success",
            message="Datos de sensor procesados correctamente",
            data=data.dict()
        )
        
    except Exception as e:
        print(f"Error procesando datos del sensor: {e}")
        return SensorResponse(
            status="error",
            message=f"Error procesando datos: {str(e)}"
        )


@app.get("/sensor/latest")
async def get_latest_sensor_data():
    """
    Obtiene los últimos datos de sensores.
    TODO: Implementar consulta a Timestream para datos recientes.
    """
    return {
        "message": "Endpoint en desarrollo - conectará con Timestream",
        "timestamp": datetime.datetime.now().isoformat()
    }
