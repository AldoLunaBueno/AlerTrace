"""
Pydantic models for IoT sensor data validation
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class HealthCheck(BaseModel):
    """Health check response"""
    status: str
    timestamp: int
    version: str
    environment: str


class SensorData(BaseModel):
    """IoT sensor data input"""
    device_id: str  # Physical device identifier
    temperatura: Optional[float] = None  # Air temperature (°C)
    humedad_aire: Optional[float] = None  # Air humidity (%)
    humedad_suelo: Optional[float] = None  # Soil moisture (%)
    ph_suelo: Optional[float] = None  # Soil pH level
    radiacion_solar: Optional[float] = None  # Solar radiation (W/m²)
    timestamp: Optional[str] = None


class SensorCreate(BaseModel):
    """New sensor registration"""
    device_id: str  # Identificador físico del dispositivo IoT
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
    device_id: str
    nombre: str
    tipo: str
    id_empresa: int
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
    nombre: Optional[str] = None
    email: Optional[str] = None
    telefono: Optional[str] = None
    user_type: str = "trabajador"  # "trabajador" o "empresa"
    
    # Campos específicos para trabajadores
    dni: Optional[str] = None
    
    # Campos específicos para empresas
    ruc: Optional[str] = None
    tipo_empresa: Optional[str] = None
    
    # Campos comunes
    fecha_registro: Optional[str] = None


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


# Modelos para alertas
class AlertaCreate(BaseModel):
    """Modelo para crear una nueva alerta"""
    id_sensor: int
    tipo: str  # temperatura, humedad, ph, etc.
    mensaje: str
    severidad: str  # baja, media, alta, critica
    valor_medido: Optional[float] = None
    umbral_configurado: Optional[float] = None


class AlertaUpdate(BaseModel):
    """Modelo para actualizar una alerta"""
    estado: Optional[str] = None
    fecha_resolucion: Optional[datetime] = None


class AlertaResponse(BaseModel):
    """Modelo de respuesta para alertas"""
    id_alerta: int
    id_sensor: int
    tipo: str
    mensaje: str
    severidad: str
    valor_medido: Optional[float]
    umbral_configurado: Optional[float]
    estado: str
    fecha_creacion: datetime
    fecha_resolucion: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)


# Modelos para dashboard
class DashboardKPIs(BaseModel):
    """KPIs del dashboard"""
    sensores_activos: int
    cultivos_monitoreados: int
    alertas_pendientes: int
    ultima_actualizacion: str
    temperaturas_promedio: Optional[float] = None
    humedad_promedio: Optional[float] = None
    areas_bajo_monitoreo: Optional[float] = None
    produccion_estimada: Optional[float] = None