from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, Text, DECIMAL, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from ..config import settings
import datetime

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Empresa(Base):
    """Business company model - Main entity that manages workers and sensors"""
    __tablename__ = "empresas"
    
    id_empresa = Column(Integer, primary_key=True, index=True)
    ruc = Column(String(11), unique=True, nullable=False, index=True)  # RUC (unique business ID)
    nombre_empresa = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    telefono = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    estado = Column(String(20), default="activa", index=True)  # activa, suspendida, inactiva
    sensores_disponibles = Column(Integer, default=0)  # Available sensor limit
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    trabajadores = relationship("Trabajador", back_populates="empresa", cascade="all, delete-orphan")
    sensores = relationship("Sensor", back_populates="empresa", cascade="all, delete-orphan")


class Trabajador(Base):
    """Worker model - Employees that can access assigned sensors"""
    __tablename__ = "trabajadores"
    
    id_trabajador = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    dni = Column(String(8), unique=True, nullable=False, index=True)  # National ID
    nombre_completo = Column(String(200), nullable=False)
    password_hash = Column(String(255), nullable=False)
    activo = Column(Boolean, default=True, index=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    empresa = relationship("Empresa", back_populates="trabajadores")
    asignaciones = relationship("AsignacionSensor", back_populates="trabajador", cascade="all, delete-orphan")


class Sensor(Base):
    """IoT sensor model - Now belongs to company instead of user"""
    __tablename__ = "sensores"
    
    id_sensor = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    device_id = Column(String(50), unique=True, nullable=False, index=True)  # Physical device ID
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)  # multisensor, temperature, humidity, etc.
    activo = Column(Boolean, default=True)
    intervalo_lectura = Column(Integer, default=300)  # Seconds between readings
    ultima_lectura = Column(DateTime)
    bateria_nivel = Column(Integer)  # Battery percentage
    ubicacion_sensor = Column(String(200))
    coordenadas_lat = Column(DECIMAL(10, 8))
    coordenadas_lng = Column(DECIMAL(11, 8))
    fecha_instalacion = Column(DateTime, default=func.now())
    fecha_mantenimiento = Column(DateTime)
    
    # Relationships
    empresa = relationship("Empresa", back_populates="sensores")
    asignaciones = relationship("AsignacionSensor", back_populates="sensor", cascade="all, delete-orphan")
    lecturas = relationship("LecturaSensor", back_populates="sensor", cascade="all, delete-orphan")
    alertas = relationship("Alerta", back_populates="sensor", cascade="all, delete-orphan")


class AsignacionSensor(Base):
    """Sensor assignment model - Links workers to specific sensors"""
    __tablename__ = "asignaciones_sensores"
    
    id_asignacion = Column(Integer, primary_key=True, index=True)
    id_trabajador = Column(Integer, ForeignKey("trabajadores.id_trabajador", ondelete="CASCADE"), nullable=False)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor", ondelete="CASCADE"), nullable=False)
    fecha_asignacion = Column(DateTime(timezone=True), server_default=func.now())
    activa = Column(Boolean, default=True, index=True)
    
    # Relationships
    trabajador = relationship("Trabajador", back_populates="asignaciones")
    sensor = relationship("Sensor", back_populates="asignaciones")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('id_trabajador', 'id_sensor', name='unique_worker_sensor_assignment'),
    )


class LecturaSensor(Base):
    """IoT sensor readings model - Updated to work with new structure"""
    __tablename__ = "lecturas_sensores"
    
    id_lectura = Column(Integer, primary_key=True, index=True)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime, default=func.now(), index=True)
    
    # Required sensor measurements
    temperatura = Column(DECIMAL(5, 2))  # °C - Air temperature
    humedad_aire = Column(DECIMAL(5, 2))  # % - Air humidity
    humedad_suelo = Column(DECIMAL(5, 2))  # % - Soil moisture
    ph_suelo = Column(DECIMAL(4, 2))  # pH - Soil pH level
    radiacion_solar = Column(DECIMAL(8, 2))  # W/m² - Solar radiation
    
    # Relationships
    sensor = relationship("Sensor", back_populates="lecturas")


class Alerta(Base):
    """Alert model - Updated to work with company structure"""
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
    
    # Relationships
    sensor = relationship("Sensor", back_populates="alertas")
    empresa = relationship("Empresa")


class ConfiguracionUmbral(Base):
    """Threshold configuration model - Now per company instead of user"""
    __tablename__ = "configuracion_umbrales"
    
    id_configuracion = Column(Integer, primary_key=True, index=True)
    id_empresa = Column(Integer, ForeignKey("empresas.id_empresa", ondelete="CASCADE"), nullable=False)
    
    # Air temperature thresholds
    temp_min = Column(DECIMAL(5, 2), default=10.0)  # °C
    temp_max = Column(DECIMAL(5, 2), default=35.0)  # °C
    
    # Air humidity thresholds
    humedad_aire_min = Column(DECIMAL(5, 2), default=40.0)  # %
    humedad_aire_max = Column(DECIMAL(5, 2), default=90.0)  # %
    
    # Soil humidity thresholds
    humedad_suelo_min = Column(DECIMAL(5, 2), default=30.0)  # %
    humedad_suelo_max = Column(DECIMAL(5, 2), default=80.0)  # %
    
    # Soil pH thresholds
    ph_min = Column(DECIMAL(4, 2), default=6.0)
    ph_max = Column(DECIMAL(4, 2), default=7.5)
    
    # Solar radiation thresholds
    radiacion_min = Column(DECIMAL(8, 2), default=200.0)  # W/m²
    radiacion_max = Column(DECIMAL(8, 2), default=1000.0)  # W/m²
    
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, default=func.now())
    
    # Relationships
    empresa = relationship("Empresa")

# Utility functions
def get_db():
    """Generator for database sessions with automatic cleanup handling"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Creates all tables defined in models"""
    Base.metadata.create_all(bind=engine)


def drop_all_tables():
    """Drops all existing tables - USE WITH CAUTION"""
    Base.metadata.drop_all(bind=engine)