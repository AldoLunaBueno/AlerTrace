"""
Modelos Pydantic para validación de datos de sensores IoT
"""
from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime, date
from decimal import Decimal
from enum import Enum
import uuid

class EmpresaCreate(BaseModel):
    """Schema para la creación de una empresa durante el registro."""
    ruc: str
    razon_social: str
    email: EmailStr

class UserCreate(BaseModel):
    """Schema para el registro de un nuevo usuario (administrador de empresa)."""
    email: EmailStr
    password: str
    nombre: str
    apellido: str
    dni: str
    empresa: EmpresaCreate

class Token(BaseModel):
    """Schema para la respuesta del token de acceso."""
    access_token: str
    token_type: str

class UserProfile(BaseModel):
    """
    Schema para devolver el perfil completo del usuario.
    """
    id_trabajador: int
    user_id: uuid.UUID
    nombre: str
    apellido: str
    email: EmailStr
    rol: str
    id_empresa: int
    empresa_nombre: str

    model_config = ConfigDict(from_attributes=True) # Para Pydantic v2
    # Para Pydantic v1, usa:
    # class Config:
    #     orm_mode = True


class LotState(str, Enum):
    """Estados de lote"""
    EN_FINCA = "EnFinca"
    EN_PROCESO = "EnProceso"
    DISTRIBUIDO = "Distribuido"


class BlockchainRole(str, Enum):
    """Roles en blockchain"""
    PRODUCTOR = "Productor"
    PROCESADOR = "Procesador"
    DISTRIBUIDOR = "Distribuidor"


class CertificationType(str, Enum):
    """Tipos de certificación"""
    ORGANIC = "Organic"
    FAIR_TRADE = "FairTrade"
    RAINFOREST_ALLIANCE = "RainforestAlliance"
    GLOBAL_GAP = "GlobalGAP"
    UTZ = "UTZ"


class HealthCheck(BaseModel):
    """Respuesta de verificación de salud"""
    status: str
    timestamp: int
    version: str
    environment: str


class SensorData(BaseModel):
    """Datos de sensores IoT"""
    device_id: str  # Identificador físico del dispositivo
    temperatura: Optional[float] = None  # Temperatura del aire (°C)
    humedad_aire: Optional[float] = None  # Humedad del aire (%)
    humedad_suelo: Optional[float] = None  # Humedad del suelo (%)
    ph_suelo: Optional[float] = None  # Nivel de pH del suelo
    radiacion_solar: Optional[float] = None  # Radiación solar (W/m²)
    timestamp: Optional[str] = None


class SensorCreate(BaseModel):
    """Registro de nuevo sensor"""
    device_id: str  # Identificador físico del dispositivo IoT
    nombre: str
    tipo: str
    id_cultivo: int
    ubicacion_sensor: Optional[str] = None
    coordenadas_lat: Optional[float] = None
    coordenadas_lng: Optional[float] = None
    intervalo_lectura: Optional[int] = 300


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


# Modelos para alertas
class AlertaCreate(BaseModel):
    """Modelo para crear una nueva alerta"""
    id_sensor: int
    tipo: str  # temperatura, humedad, ph, etc.
    mensaje: str
    severidad: str  # baja, media, alta, critica
    valor_medido: Optional[float] = None
    umbral_configurado: Optional[float] = None


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


class FarmCreate(BaseModel):
    """Creación de finca"""
    farm_name: str
    farm_code: Optional[str] = None
    location_address: Optional[str] = None
    location_geohash: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    area_hectares: Optional[Decimal] = None
    altitude_meters: Optional[int] = None
    description: Optional[str] = None


class FarmResponse(BaseModel):
    """Respuesta de finca"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    id_empresa: int
    farm_name: str
    farm_code: Optional[str]
    location_address: Optional[str]
    location_geohash: Optional[str]
    latitude: Optional[Decimal]
    longitude: Optional[Decimal]
    area_hectares: Optional[Decimal]
    altitude_meters: Optional[int]
    description: Optional[str]
    active: bool
    created_at: datetime
    updated_at: datetime


class FarmCertificationCreate(BaseModel):
    """Creación de certificación"""
    id_farm: int
    certification_type: str
    certifier_name: str
    certification_number: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    document_url: Optional[str] = None
    document_hash: Optional[str] = None


class FarmCertificationResponse(BaseModel):
    """Respuesta de certificación"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    id_farm: int
    certification_type: str
    certifier_name: str
    certification_number: Optional[str]
    issue_date: Optional[date]
    expiry_date: Optional[date]
    document_url: Optional[str]
    document_hash: Optional[str]
    active: bool
    created_at: datetime
    updated_at: datetime


class LotCreate(BaseModel):
    """Creación de lote"""
    lot_id: int
    id_farm: Optional[int] = None
    product_name: str
    product_variety: Optional[str] = None
    quantity: Decimal
    unit: str
    harvest_date: Optional[date] = None
    current_owner: str


class LotResponse(BaseModel):
    """Respuesta de lote"""
    model_config = ConfigDict(from_attributes=True)
    
    lot_id: int
    id_empresa: int
    id_farm: Optional[int]
    product_name: str
    product_variety: Optional[str]
    quantity: Decimal
    unit: str
    harvest_date: Optional[date]
    current_state: str
    current_owner: str
    token_uri: Optional[str]
    metadata_hash: Optional[str]
    created_at: datetime
    updated_at: datetime


class HarvestEventCreate(BaseModel):
    """Creación de evento de cosecha"""
    lot_id: int
    actor_address: str
    actor_name: Optional[str] = None
    harvest_date: date
    location_geohash: Optional[str] = None
    location_name: Optional[str] = None
    quality_score: Optional[int] = None
    weather_conditions: Optional[str] = None
    notes: Optional[str] = None
    event_time: datetime


class HarvestEventResponse(BaseModel):
    """Respuesta de evento de cosecha"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    lot_id: int
    actor_address: str
    actor_name: Optional[str]
    harvest_date: date
    location_geohash: Optional[str]
    location_name: Optional[str]
    quality_score: Optional[int]
    weather_conditions: Optional[str]
    notes: Optional[str]
    tx_hash: Optional[str]
    block_number: Optional[int]
    event_time: datetime
    created_at: datetime


class ProcessingEventCreate(BaseModel):
    """Creación de evento de procesamiento"""
    lot_id: int
    actor_address: str
    actor_name: Optional[str] = None
    process_type: str
    process_date: date
    location_geohash: Optional[str] = None
    location_name: Optional[str] = None
    input_quantity: Optional[Decimal] = None
    output_quantity: Optional[Decimal] = None
    unit: Optional[str] = None
    duration_hours: Optional[int] = None
    temperature: Optional[Decimal] = None
    humidity: Optional[Decimal] = None
    quality_result: Optional[int] = None
    notes: Optional[str] = None
    event_time: datetime


class ProcessingEventResponse(BaseModel):
    """Respuesta de evento de procesamiento"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    lot_id: int
    actor_address: str
    actor_name: Optional[str]
    process_type: str
    process_date: date
    location_geohash: Optional[str]
    location_name: Optional[str]
    input_quantity: Optional[Decimal]
    output_quantity: Optional[Decimal]
    unit: Optional[str]
    duration_hours: Optional[int]
    temperature: Optional[Decimal]
    humidity: Optional[Decimal]
    quality_result: Optional[int]
    notes: Optional[str]
    tx_hash: Optional[str]
    block_number: Optional[int]
    event_time: datetime
    created_at: datetime


class TransferEventCreate(BaseModel):
    """Creación de evento de transferencia"""
    lot_id: int
    from_address: str
    from_name: Optional[str] = None
    to_address: str
    to_name: Optional[str] = None
    transfer_date: date
    from_location_geohash: Optional[str] = None
    from_location_name: Optional[str] = None
    to_location_geohash: Optional[str] = None
    to_location_name: Optional[str] = None
    quantity_transferred: Optional[Decimal] = None
    unit: Optional[str] = None
    transport_method: Optional[str] = None
    estimated_delivery: Optional[date] = None
    notes: Optional[str] = None
    event_time: datetime


class TransferEventResponse(BaseModel):
    """Respuesta de evento de transferencia"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    lot_id: int
    from_address: str
    from_name: Optional[str]
    to_address: str
    to_name: Optional[str]
    transfer_date: date
    from_location_geohash: Optional[str]
    from_location_name: Optional[str]
    to_location_geohash: Optional[str]
    to_location_name: Optional[str]
    quantity_transferred: Optional[Decimal]
    unit: Optional[str]
    transport_method: Optional[str]
    estimated_delivery: Optional[date]
    notes: Optional[str]
    tx_hash: Optional[str]
    block_number: Optional[int]
    event_time: datetime
    created_at: datetime


class BlockchainSyncResponse(BaseModel):
    """Respuesta de sincronización blockchain"""
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    tx_hash: str
    block_number: int
    log_index: int
    event_name: str
    contract_address: str
    lot_id: Optional[int]
    event_table: Optional[str]
    event_id: Optional[int]
    processed: bool
    processed_at: Optional[datetime]
    error_message: Optional[str]
    block_timestamp: datetime
    created_at: datetime