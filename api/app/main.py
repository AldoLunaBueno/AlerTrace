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
    Recibe datos de sensores IoT y los almacena en Timestream.
    También actualiza el estado del sensor en PostgreSQL.
    """
    try:
        # Agregar timestamp si no viene incluido
        if not data.timestamp:
            data.timestamp = str(int(datetime.datetime.utcnow().timestamp() * 1000))

        # Preparar datos para Timestream
        timestream_data = {
            'sensor_id': data.sensor_id,
            'timestamp': data.timestamp,
            'measurements': {
                'temperatura': data.temperature,
                'humedad': data.humidity,
                'humedad_suelo': data.soil_moisture
            }
        }
        
        # TODO: Enviar a Timestream cuando tengas credenciales AWS
        # from .services.timestream import TimestreamService
        # timestream_service = TimestreamService()
        # success = timestream_service.write_sensor_data(timestream_data)
        
        # Actualizar última comunicación del sensor en PostgreSQL
        from .models.database import Sensor
        sensor = db.query(Sensor).filter(
            Sensor.codigo_sensor == data.sensor_id
        ).first()
        
        if sensor:
            sensor.fecha_ultima_comunicacion = datetime.datetime.utcnow()
            db.commit()
        
        # Log para desarrollo
        print(f"📊 Datos de sensor recibidos: {timestream_data}")
        
        return SensorResponse(
            status="success",
            message="Datos de sensor procesados correctamente",
            data=timestream_data
        )
        
    except Exception as e:
        print(f"❌ Error procesando datos del sensor: {e}")
        return SensorResponse(
            status="error",
            message=f"Error procesando datos: {str(e)}"
        )


@app.get("/sensor/{sensor_id}/latest")
async def get_latest_sensor_data(sensor_id: str):
    """
    Obtiene la última lectura de un sensor específico desde Timestream.
    """
    try:
        # TODO: Implementar consulta a Timestream
        # timestream_service = TimestreamService()
        # data = timestream_service.get_latest_sensor_data(sensor_id)
        
        return {
            "sensor_id": sensor_id,
            "message": "Endpoint en desarrollo - conectará con Timestream",
            "timestamp": datetime.datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "error": f"Error obteniendo datos: {str(e)}"
        }


@app.get("/sensors/summary")
async def get_sensors_summary(db: Session = Depends(get_db)):
    """
    Obtiene resumen de todos los sensores: configuración desde PostgreSQL 
    y últimas lecturas desde Timestream.
    """
    try:
        from .models.database import Sensor
        
        # Obtener configuración de sensores desde PostgreSQL
        sensors_config = db.query(Sensor).filter(Sensor.estado == "activo").all()
        
        # TODO: Combinar con datos de Timestream
        # timestream_service = TimestreamService()
        # timestream_summary = timestream_service.get_all_sensors_summary()
        
        sensors_data = []
        for sensor in sensors_config:
            sensors_data.append({
                "id": sensor.id_sensor,
                "codigo": sensor.codigo_sensor,
                "nombre": sensor.nombre_sensor,
                "tipo": sensor.tipo_sensor,
                "estado": sensor.estado,
                "ultima_comunicacion": sensor.fecha_ultima_comunicacion.isoformat() if sensor.fecha_ultima_comunicacion else None,
                "cultivo_id": sensor.id_cultivo
            })
        
        return {
            "total_sensores": len(sensors_data),
            "sensores": sensors_data
        }
        
    except Exception as e:
        return {
            "error": f"Error obteniendo resumen: {str(e)}"
        }


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
