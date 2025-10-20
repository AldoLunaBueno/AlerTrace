from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, Text, DECIMAL, ForeignKey, UniqueConstraint, BIGINT, Date, UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from api.config import settings
import datetime
import uuid

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Empresa(Base):
    """Entidad que gestiona trabajadores y sensores"""
    __tablename__ = "empresas"
    
    id_empresa = Column(Integer, primary_key=True, index=True)
    ruc = Column(String(11), unique=True, nullable=False, index=True)
    razon_social = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    telefono = Column(String(20), nullable=True)
    direccion = Column(Text, nullable=True)
    estado = Column(String(20), default="activo", index=True)
    smart_account_address = Column(String(42), nullable=True, index=True)
    signer_address = Column(String(42), nullable=True)
    blockchain_active = Column(Boolean, default=False)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    trabajadores = relationship("Trabajador", back_populates="empresa", cascade="all, delete-orphan")
    sensores = relationship("Sensor", back_populates="empresa", cascade="all, delete-orphan")
    farms = relationship("Farm", back_populates="empresa", cascade="all, delete-orphan")
    lots = relationship("Lot", back_populates="empresa")


class Trabajador(Base):
    """Entidad que accede a sensores asignados"""
    __tablename__ = "trabajadores"
    
    id_trabajador = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False)
    apellido = Column(String(255), nullable=False)
    dni = Column(String(8), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    telefono = Column(String(20), nullable=True)
    rol = Column(String(50), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=True, index=True)  # UUID de Supabase Auth
    smart_account_address = Column(String(42), unique=True, nullable=True, index=True)
    blockchain_role = Column(String(20), nullable=True)
    activo = Column(Boolean, default=True, index=True)
    fecha_contratacion = Column(Date, default=func.current_date())
    
    # Relaciones
    empresa = relationship("Empresa", back_populates="trabajadores")
    asignaciones = relationship("AsignacionSensor", back_populates="trabajador", cascade="all, delete-orphan")


class Sensor(Base):
    """Modelo de sensores: pertenece a cada empresa"""
    __tablename__ = "sensores"
    
    id_sensor = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    device_id = Column(String(50), unique=True, nullable=False, index=True)  # ID físico del dispositivo
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)  # multisensor, temperature, humidity, etc.
    activo = Column(Boolean, default=True)
    intervalo_lectura = Column(Integer, default=300)  # Segundos entre lecturas
    ultima_lectura = Column(DateTime)
    bateria_nivel = Column(Integer)  # Porcentaje de batería
    ubicacion_sensor = Column(String(200))
    coordenadas_lat = Column(DECIMAL(10, 8))
    coordenadas_lng = Column(DECIMAL(11, 8))
    fecha_instalacion = Column(DateTime, default=func.now())
    fecha_mantenimiento = Column(DateTime)
    
    # Relaciones
    empresa = relationship("Empresa", back_populates="sensores")
    asignaciones = relationship("AsignacionSensor", back_populates="sensor", cascade="all, delete-orphan")
    lecturas = relationship("LecturaSensor", back_populates="sensor", cascade="all, delete-orphan")
    alertas = relationship("Alerta", back_populates="sensor", cascade="all, delete-orphan")


class AsignacionSensor(Base):
    """Vincula trabajadores a sensores específicos"""
    __tablename__ = "asignaciones_sensores"
    
    id_asignacion = Column(Integer, primary_key=True, index=True)
    id_trabajador = Column(Integer, ForeignKey("trabajadores.id_trabajador", ondelete="CASCADE"), nullable=False)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor", ondelete="CASCADE"), nullable=False)
    fecha_asignacion = Column(DateTime(timezone=True), server_default=func.now())
    activa = Column(Boolean, default=True, index=True)
    
    # Relaciones
    trabajador = relationship("Trabajador", back_populates="asignaciones")
    sensor = relationship("Sensor", back_populates="asignaciones")
    
    # Restricciones
    __table_args__ = (
        UniqueConstraint('id_trabajador', 'id_sensor', name='unique_worker_sensor_assignment'),
    )


class LecturaSensor(Base):
    """Modelo de lectura de sensores"""
    __tablename__ = "lecturas_sensores"
    
    id_lectura = Column(Integer, primary_key=True, index=True)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=func.now(), index=True)
    
    # Mediciones requeridas del sensor
    temperatura = Column(DECIMAL(5, 2))  # °C - Temperatura del aire
    humedad_aire = Column(DECIMAL(5, 2))  # % - Humedad del aire
    humedad_suelo = Column(DECIMAL(5, 2))  # % - Humedad del suelo
    ph_suelo = Column(DECIMAL(4, 2))  # pH - Nivel de pH del suelo
    radiacion_solar = Column(DECIMAL(8, 2))  # W/m² - Radiación solar
    
    # Relaciones
    sensor = relationship("Sensor", back_populates="lecturas")


class Alerta(Base):
    """Alertas para cada empresa"""
    __tablename__ = "alertas"
    
    id_alerta = Column(Integer, primary_key=True, index=True)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor", ondelete="CASCADE"), nullable=False)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    
    tipo_alerta = Column(String(50), nullable=False)  # temperature, humidity, battery, offline
    severidad = Column(String(20), default="medium")  # low, medium, high, critical
    titulo = Column(String(200), nullable=False)
    mensaje = Column(Text, nullable=False)
    valor_actual = Column(DECIMAL(10, 2))
    valor_umbral = Column(DECIMAL(10, 2))
    
    resuelta = Column(Boolean, default=False)
    fecha_creacion = Column(DateTime, default=func.now(), index=True)
    fecha_resolucion = Column(DateTime)
    notas_resolucion = Column(Text)
    
    # Relaciones
    sensor = relationship("Sensor", back_populates="alertas")
    empresa = relationship("Empresa")


class ConfiguracionUmbral(Base):
    """Modelo de configuración de umbrales"""
    __tablename__ = "configuracion_umbrales"
    
    id_configuracion = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    
    temp_min = Column(DECIMAL(5, 2), default=10.0)
    temp_max = Column(DECIMAL(5, 2), default=35.0)
    humedad_aire_min = Column(DECIMAL(5, 2), default=40.0)
    humedad_aire_max = Column(DECIMAL(5, 2), default=90.0)
    humedad_suelo_min = Column(DECIMAL(5, 2), default=30.0)
    humedad_suelo_max = Column(DECIMAL(5, 2), default=80.0)
    ph_min = Column(DECIMAL(4, 2), default=6.0)
    ph_max = Column(DECIMAL(4, 2), default=7.5)
    radiacion_min = Column(DECIMAL(8, 2), default=200.0)
    radiacion_max = Column(DECIMAL(8, 2), default=1000.0)
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, default=func.now())
    
    empresa = relationship("Empresa")


class Farm(Base):
    """Modelo de fincas con datos geoespaciales"""
    __tablename__ = "farms"
    
    id = Column(BIGINT, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False, index=True)
    farm_name = Column(String(200), nullable=False)
    farm_code = Column(String(50), unique=True, nullable=True, index=True)
    location_address = Column(Text, nullable=True)
    location_geohash = Column(String(12), nullable=True, index=True)
    latitude = Column(DECIMAL(10, 8), nullable=True)
    longitude = Column(DECIMAL(11, 8), nullable=True)
    area_hectares = Column(DECIMAL(10, 2), nullable=True)
    altitude_meters = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    empresa = relationship("Empresa", back_populates="farms")
    certifications = relationship("FarmCertification", back_populates="farm", cascade="all, delete-orphan")
    lots = relationship("Lot", back_populates="farm")


class FarmCertification(Base):
    """Certificaciones de fincas"""
    __tablename__ = "farm_certifications"
    
    id = Column(BIGINT, primary_key=True, index=True)
    id_farm = Column(BIGINT, ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True)
    certification_type = Column(String(50), nullable=False, index=True)
    certifier_name = Column(String(200), nullable=False)
    certification_number = Column(String(100), nullable=True)
    issue_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True, index=True)
    document_url = Column(Text, nullable=True)
    document_hash = Column(String(66), nullable=True)
    active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    farm = relationship("Farm", back_populates="certifications")


class Lot(Base):
    """Lotes de productos con trazabilidad blockchain"""
    __tablename__ = "lots"
    
    lot_id = Column(BIGINT, primary_key=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False, index=True)
    id_farm = Column(BIGINT, ForeignKey("farms.id", ondelete="SET NULL"), nullable=True, index=True)
    product_name = Column(String(100), nullable=False)
    product_variety = Column(String(100), nullable=True)
    quantity = Column(DECIMAL(12, 2), nullable=False)
    unit = Column(String(20), nullable=False)
    harvest_date = Column(Date, nullable=True, index=True)
    current_state = Column(String(20), nullable=False, default="EnFinca", index=True)
    current_owner = Column(String(42), nullable=False, index=True)
    token_uri = Column(String(500), nullable=True)
    metadata_hash = Column(String(66), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    empresa = relationship("Empresa", back_populates="lots")
    farm = relationship("Farm", back_populates="lots")
    harvest_events = relationship("HarvestEvent", back_populates="lot", cascade="all, delete-orphan")
    processing_events = relationship("ProcessingEvent", back_populates="lot", cascade="all, delete-orphan")
    transfer_events = relationship("TransferEvent", back_populates="lot", cascade="all, delete-orphan")


class HarvestEvent(Base):
    """Eventos de cosecha registrados en blockchain"""
    __tablename__ = "harvest_events"
    
    id = Column(BIGINT, primary_key=True, index=True)
    lot_id = Column(BIGINT, ForeignKey("lots.lot_id", ondelete="CASCADE"), nullable=False, index=True)
    actor_address = Column(String(42), nullable=False, index=True)
    actor_name = Column(String(200), nullable=True)
    harvest_date = Column(Date, nullable=False, index=True)
    location_geohash = Column(String(12), nullable=True)
    location_name = Column(String(200), nullable=True)
    quality_score = Column(Integer, nullable=True)
    weather_conditions = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    tx_hash = Column(String(66), unique=True, nullable=True, index=True)
    block_number = Column(BIGINT, nullable=True)
    event_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    lot = relationship("Lot", back_populates="harvest_events")


class ProcessingEvent(Base):
    """Eventos de procesamiento de productos"""
    __tablename__ = "processing_events"
    
    id = Column(BIGINT, primary_key=True, index=True)
    lot_id = Column(BIGINT, ForeignKey("lots.lot_id", ondelete="CASCADE"), nullable=False, index=True)
    actor_address = Column(String(42), nullable=False, index=True)
    actor_name = Column(String(200), nullable=True)
    process_type = Column(String(100), nullable=False, index=True)
    process_date = Column(Date, nullable=False, index=True)
    location_geohash = Column(String(12), nullable=True)
    location_name = Column(String(200), nullable=True)
    input_quantity = Column(DECIMAL(12, 2), nullable=True)
    output_quantity = Column(DECIMAL(12, 2), nullable=True)
    unit = Column(String(20), nullable=True)
    duration_hours = Column(Integer, nullable=True)
    temperature = Column(DECIMAL(5, 2), nullable=True)
    humidity = Column(DECIMAL(5, 2), nullable=True)
    quality_result = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    tx_hash = Column(String(66), unique=True, nullable=True, index=True)
    block_number = Column(BIGINT, nullable=True)
    event_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    lot = relationship("Lot", back_populates="processing_events")


class TransferEvent(Base):
    """Eventos de transferencia de productos"""
    __tablename__ = "transfer_events"
    
    id = Column(BIGINT, primary_key=True, index=True)
    lot_id = Column(BIGINT, ForeignKey("lots.lot_id", ondelete="CASCADE"), nullable=False, index=True)
    from_address = Column(String(42), nullable=False, index=True)
    from_name = Column(String(200), nullable=True)
    to_address = Column(String(42), nullable=False, index=True)
    to_name = Column(String(200), nullable=True)
    transfer_date = Column(Date, nullable=False, index=True)
    from_location_geohash = Column(String(12), nullable=True)
    from_location_name = Column(String(200), nullable=True)
    to_location_geohash = Column(String(12), nullable=True)
    to_location_name = Column(String(200), nullable=True)
    quantity_transferred = Column(DECIMAL(12, 2), nullable=True)
    unit = Column(String(20), nullable=True)
    transport_method = Column(String(100), nullable=True)
    estimated_delivery = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    tx_hash = Column(String(66), unique=True, nullable=True, index=True)
    block_number = Column(BIGINT, nullable=True)
    event_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    lot = relationship("Lot", back_populates="transfer_events")


class BlockchainSync(Base):
    """Sincronización de eventos blockchain"""
    __tablename__ = "blockchain_sync"
    
    id = Column(BIGINT, primary_key=True, index=True)
    tx_hash = Column(String(66), unique=True, nullable=False, index=True)
    block_number = Column(BIGINT, nullable=False, index=True)
    log_index = Column(Integer, nullable=False)
    event_name = Column(String(50), nullable=False, index=True)
    contract_address = Column(String(42), nullable=False)
    lot_id = Column(BIGINT, nullable=True, index=True)
    event_table = Column(String(50), nullable=True)
    event_id = Column(BIGINT, nullable=True)
    processed = Column(Boolean, default=False, index=True)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    error_message = Column(Text, nullable=True)
    block_timestamp = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# Funciones de utilidad
def get_db():
    """Generador para sesiones de base de datos con manejo de limpieza automática"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Crea todas las tablas definidas en los modelos"""
    Base.metadata.create_all(bind=engine)


def drop_all_tables():
    """Elimina todas las tablas existentes - USAR CON PRECAUCIÓN"""
    Base.metadata.drop_all(bind=engine)