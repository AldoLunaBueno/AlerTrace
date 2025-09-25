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
    temperatura: Optional[float] = None  # Temperatura del ambiente (°C)
    humedad_aire: Optional[float] = None  # Humedad del ambiente (%)
    humedad_suelo: Optional[float] = None  # Humedad del suelo (%)
    ph_suelo: Optional[float] = None  # pH del suelo
    radiacion_solar: Optional[float] = None  # Radiación solar (W/m²)
    timestamp: Optional[str] = None


class SensorCreate(BaseModel):
    """Modelo para registrar un nuevo sensor"""
    sensor_id: str
    nombre: str
    tipo: str
    id_cultivo: int
    ubicacion_sensor: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None
    intervalo_lectura: Optional[int] = 300


class SensorUpdate(BaseModel):
    """Modelo para actualizar configuración de sensor"""
    nombre: Optional[str] = None
    activo: Optional[bool] = None
    intervalo_lectura: Optional[int] = None
    ubicacion_sensor: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None


class SensorResponse(BaseModel):
    """Modelo para respuesta de sensor"""
    model_config = ConfigDict(from_attributes=True)
    
    id_sensor: int
    sensor_id: str
    nombre: str
    tipo: str
    id_cultivo: int
    activo: bool
    intervalo_lectura: int
    ultima_lectura: Optional[datetime] = None
    bateria_nivel: Optional[int] = None
    ubicacion_sensor: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None
    fecha_instalacion: datetime


class LecturaSensorResponse(BaseModel):
    """Modelo para respuesta de lectura de sensor"""
    model_config = ConfigDict(from_attributes=True)
    
    id_lectura: int
    id_sensor: int
    timestamp: datetime
    temperatura: Optional[float] = None  # Temperatura del ambiente (°C)
    humedad_aire: Optional[float] = None  # Humedad del ambiente (%)
    humedad_suelo: Optional[float] = None  # Humedad del suelo (%)
    ph_suelo: Optional[float] = None  # pH del suelo
    radiacion_solar: Optional[float] = None  # Radiación solar (W/m²)


class AlertaResponse(BaseModel):
    """Modelo para respuesta de alerta"""
    model_config = ConfigDict(from_attributes=True)
    
    id_alerta: int
    id_sensor: int
    tipo_alerta: str
    severidad: str
    titulo: str
    mensaje: str
    valor_actual: Optional[float] = None
    valor_umbral: Optional[float] = None
    resuelta: bool
    fecha_creacion: datetime


class ConfiguracionUmbralCreate(BaseModel):
    """Modelo para crear configuración de umbrales"""
    id_cultivo: int
    temp_min: Optional[float] = 10.0  # °C
    temp_max: Optional[float] = 35.0  # °C
    humedad_aire_min: Optional[float] = 40.0  # %
    humedad_aire_max: Optional[float] = 90.0  # %
    humedad_suelo_min: Optional[float] = 30.0  # %
    humedad_suelo_max: Optional[float] = 80.0  # %
    ph_min: Optional[float] = 6.0
    ph_max: Optional[float] = 7.5
    radiacion_min: Optional[float] = 200.0  # W/m²
    radiacion_max: Optional[float] = 1000.0  # W/m²


class ConfiguracionUmbralResponse(BaseModel):
    """Modelo para respuesta de configuración de umbrales"""
    model_config = ConfigDict(from_attributes=True)
    
    id_configuracion: int
    id_cultivo: int
    temp_min: float  # °C
    temp_max: float  # °C
    humedad_aire_min: float  # %
    humedad_aire_max: float  # %
    humedad_suelo_min: float  # %
    humedad_suelo_max: float  # %
    ph_min: float
    ph_max: float
    radiacion_min: float  # W/m²
    radiacion_max: float  # W/m²
    activo: bool
    fecha_creacion: datetime


class DashboardResponse(BaseModel):
    """Modelo para respuesta del dashboard"""
    total_cultivos: int
    cultivos_activos: int
    alertas_pendientes: int


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