from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import time
import logging
from typing import Optional

# Importar configuración
from .config import settings
from .auth.jwt_service import jwt_service
from .auth.dependencies import get_current_user, optional_auth
from .database.connection import get_db
from .services.user_service import UserService

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
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de datos para sensores
class SensorData(BaseModel):
    """Modelo para datos recibidos de sensores IoT"""
    sensor_id: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_moisture: Optional[float] = None
    timestamp: Optional[str] = None

class HealthCheck(BaseModel):
    """Modelo para respuesta de health check"""
    status: str
    timestamp: int
    version: str
    environment: str

# Modelos de autenticación
class LoginRequest(BaseModel):
    """Modelo para solicitud de login"""
    username: str
    password: str

class LoginResponse(BaseModel):
    """Modelo para respuesta de login exitoso"""
    access_token: str
    token_type: str
    user_id: str
    username: str

class UserInfo(BaseModel):
    """Modelo para información de usuario autenticado"""
    user_id: str
    username: str
    role: str

# Rutas básicas
@app.get("/")
async def root():
    """Endpoint raíz con información básica de la API"""
    return {
        "message": "MallkiTrace API - Sistema de Trazabilidad Agrícola",
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
    """Información detallada de la aplicación y características disponibles"""
    return {
        "app_name": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
        "debug_mode": settings.debug,
        "features": {
            "authentication": False,  # Por implementar
            "database": True,
            "sensor_integration": False,  # Por implementar
            "timestream_storage": False,  # Por implementar
            "lambda_processing": False  # Por implementar
        }
    }

# Rutas de sensores
@app.post("/api/v1/sensor/data")
async def receive_sensor_data(data: SensorData):
    """Recibe datos de sensores IoT y los procesa"""
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
# ENDPOINTS DE AUTENTICACIÓN
# ========================

@app.post("/api/v1/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Autenticación de usuario con credenciales y generación de JWT"""
    # Crear servicio de usuarios
    user_service = UserService(db)
    
    # Autenticar usuario desde la base de datos
    user = user_service.authenticate_user(request.username, request.password)
    
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="Credenciales incorrectas o usuario inactivo"
        )
    
    # Crear token JWT
    token_data = {
        "sub": str(user.id_usuario),  # ID del usuario como string
        "username": user.username,
        "role": user.rol,
        "nombre": user.nombre
    }
    
    access_token = jwt_service.create_access_token(data=token_data)
    
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=str(user.id_usuario),
        username=user.username
    )

@app.get("/api/v1/auth/me", response_model=UserInfo)
async def get_current_user_info(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obtiene información completa del usuario autenticado desde la base de datos"""
    # Obtener usuario desde la base de datos
    user_service = UserService(db)
    user = user_service.get_user_by_id(int(current_user["sub"]))
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return UserInfo(
        user_id=str(user.id_usuario),
        username=user.username,
        role=user.rol
    )

@app.get("/api/v1/protected")
async def protected_endpoint(current_user: dict = Depends(get_current_user)):
    """Endpoint de ejemplo que requiere autenticación JWT"""
    return {
        "message": f"Hola {current_user['username']}, tienes acceso!",
        "user_role": current_user["role"],
        "timestamp": int(time.time())
    }

@app.get("/api/v1/cultivos")
async def get_cultivos(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    """Obtiene los cultivos asociados al usuario autenticado"""
    from .models.database import Cultivo
    
    user_id = int(current_user["sub"])
    
    cultivos = db.query(Cultivo).filter(Cultivo.id_usuario == user_id).all()
    
    result = []
    for cultivo in cultivos:
        result.append({
            "id_cultivo": cultivo.id_cultivo,
            "tipo_cultivo": cultivo.tipo_cultivo,
            "variedad": cultivo.variedad,
            "hectareas": float(cultivo.hectareas) if cultivo.hectareas else None,
            "estado": cultivo.estado,
            "fecha_siembra": cultivo.fecha_siembra.isoformat() if cultivo.fecha_siembra else None
        })
    
    return {"cultivos": result}

# ========================
# EVENTOS DE APLICACIÓN 
# ========================

@app.on_event("startup")
async def startup_event():
    """Inicialización de la aplicación al arrancar"""
    logger.info(f"Iniciando {settings.app_name} v{settings.app_version}")
    logger.info(f"Environment: {settings.environment}")

@app.on_event("shutdown")
async def shutdown_event():
    """Limpieza al cerrar la aplicación"""
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