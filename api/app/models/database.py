from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, Text, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from ..config import settings
import datetime

engine = create_engine(settings.database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Usuario(Base):
    """Modelo de usuario del sistema con autenticación y roles"""
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    nombre = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(20), nullable=False, index=True)  # admin, agricultor, comprador
    activo = Column(Boolean, default=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    
    cultivos = relationship("Cultivo", back_populates="usuario")

class Cultivo(Base):
    """Modelo de cultivo asociado a un usuario específico"""
    __tablename__ = "cultivos"
    
    id_cultivo = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    tipo_cultivo = Column(String(50), nullable=False, index=True)
    variedad = Column(String(100))
    hectareas = Column(DECIMAL(8, 2), nullable=False)
    fecha_siembra = Column(DateTime)
    fecha_estimada_cosecha = Column(DateTime)
    estado = Column(String(20), default="activo")
    ubicacion_especifica = Column(Text)
    coordenadas_lat = Column(DECIMAL(10, 8))
    coordenadas_lng = Column(DECIMAL(11, 8))
    
    usuario = relationship("Usuario", back_populates="cultivos")
    sensores = relationship("Sensor", back_populates="cultivo")
    lecturas_sensores = relationship("LecturaSensor", back_populates="cultivo")


class Sensor(Base):
    """Modelo de sensor IoT asociado a un cultivo"""
    __tablename__ = "sensores"
    
    id_sensor = Column(Integer, primary_key=True, index=True)  # Database PK
    device_id = Column(String(50), unique=True, nullable=False, index=True)  # Physical IoT device ID
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)  # temperature, humidity, soil_moisture, ph, light
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    activo = Column(Boolean, default=True)
    intervalo_lectura = Column(Integer, default=300)  # seconds between readings
    ultima_lectura = Column(DateTime)
    bateria_nivel = Column(Integer)  # battery percentage
    ubicacion_sensor = Column(String(200))
    coordenadas_lat = Column(DECIMAL(10, 8))
    coordenadas_lng = Column(DECIMAL(11, 8))
    fecha_instalacion = Column(DateTime, default=func.now())
    fecha_mantenimiento = Column(DateTime)
    
    cultivo = relationship("Cultivo", back_populates="sensores")
    usuario = relationship("Usuario")
    lecturas = relationship("LecturaSensor", back_populates="sensor")
    alertas = relationship("Alerta", back_populates="sensor")


class LecturaSensor(Base):
    """Modelo de lecturas de sensores IoT"""
    __tablename__ = "lecturas_sensores"
    
    id_lectura = Column(Integer, primary_key=True, index=True)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor"), nullable=False)
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"), nullable=False)
    timestamp = Column(DateTime, default=func.now(), index=True)
    
    # Required sensor measurements
    temperatura = Column(DECIMAL(5, 2))  # °C - Air temperature
    humedad_aire = Column(DECIMAL(5, 2))  # % - Air humidity
    humedad_suelo = Column(DECIMAL(5, 2))  # % - Soil moisture
    ph_suelo = Column(DECIMAL(4, 2))  # pH - Soil pH level
    radiacion_solar = Column(DECIMAL(8, 2))  # W/m² - Solar radiation
    
    sensor = relationship("Sensor", back_populates="lecturas")
    cultivo = relationship("Cultivo", back_populates="lecturas_sensores")


class Alerta(Base):
    """Modelo de alertas generadas por sensores"""
    __tablename__ = "alertas"
    
    id_alerta = Column(Integer, primary_key=True, index=True)
    id_sensor = Column(Integer, ForeignKey("sensores.id_sensor"), nullable=False)
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    
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
    
    sensor = relationship("Sensor", back_populates="alertas")
    usuario = relationship("Usuario")


class ConfiguracionUmbral(Base):
    """Threshold configuration model per crop and sensor"""
    __tablename__ = "configuracion_umbrales"
    
    id_configuracion = Column(Integer, primary_key=True, index=True)
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    
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
    
    usuario = relationship("Usuario")

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