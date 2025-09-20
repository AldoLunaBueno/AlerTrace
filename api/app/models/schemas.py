"""
Modelos Pydantic para validación de datos de entrada y salida
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


# Modelos básicos
class HealthCheck(BaseModel):
    """Modelo para respuesta de health check"""
    status: str
    timestamp: int
    version: str
    environment: str


class SensorData(BaseModel):
    """Modelo para datos recibidos de sensores IoT"""
    sensor_id: str
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    soil_moisture: Optional[float] = None
    timestamp: Optional[str] = None


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


# Modelos para CRUD de cultivos
class CultivoCreate(BaseModel):
    """Modelo para crear un nuevo cultivo"""
    tipo_cultivo: str
    variedad: Optional[str] = None
    hectareas: float
    fecha_siembra: Optional[str] = None
    fecha_estimada_cosecha: Optional[str] = None
    ubicacion_especifica: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None


class CultivoUpdate(BaseModel):
    """Modelo para actualizar un cultivo existente"""
    tipo_cultivo: Optional[str] = None
    variedad: Optional[str] = None
    hectareas: Optional[float] = None
    fecha_siembra: Optional[str] = None
    fecha_estimada_cosecha: Optional[str] = None
    estado: Optional[str] = None
    ubicacion_especifica: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None


class CultivoResponse(BaseModel):
    """Modelo para respuesta de cultivo"""
    model_config = ConfigDict(from_attributes=True)
    
    id_cultivo: int
    tipo_cultivo: str
    variedad: Optional[str] = None
    hectareas: float
    fecha_siembra: Optional[datetime] = None
    fecha_estimada_cosecha: Optional[datetime] = None
    estado: str
    ubicacion_especifica: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None


# Modelos para usuarios
class UserCreate(BaseModel):
    """Modelo para crear un nuevo usuario"""
    username: str
    nombre: str
    email: str
    password: str
    rol: str = "agricultor"


class UserUpdate(BaseModel):
    """Modelo para actualizar usuario"""
    nombre: Optional[str] = None
    email: Optional[str] = None
    rol: Optional[str] = None
    activo: Optional[bool] = None