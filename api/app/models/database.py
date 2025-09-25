from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, Text, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from ..config import settings
import datetime

# Configuración de la base de datos
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
    
    # Relaciones
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
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="cultivos")
    sensores = relationship("Sensor", back_populates="cultivo")
    lecturas_sensores = relationship("LecturaSensor", back_populates="cultivo")


class Sensor(Base):
    """Modelo de sensor IoT asociado a un cultivo"""
    __tablename__ = "sensores"
    
    id_sensor = Column(Integer, primary_key=True, index=True)
    sensor_id = Column(String(50), unique=True, nullable=False, index=True)  # ID físico del sensor
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)  # temperature, humidity, soil_moisture, ph, light
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    activo = Column(Boolean, default=True)
    intervalo_lectura = Column(Integer, default=300)  # segundos entre lecturas
    ultima_lectura = Column(DateTime)
    bateria_nivel = Column(Integer)  # porcentaje de batería
    ubicacion_sensor = Column(String(200))
    coordenadas_lat = Column(DECIMAL(10, 8))
    coordenadas_lng = Column(DECIMAL(11, 8))
    fecha_instalacion = Column(DateTime, default=func.now())
    fecha_mantenimiento = Column(DateTime)
    
    # Relaciones
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
    
    # Sensores específicos requeridos
    temperatura = Column(DECIMAL(5, 2))  # °C - Temperatura del ambiente
    humedad_aire = Column(DECIMAL(5, 2))  # % - Humedad del ambiente
    humedad_suelo = Column(DECIMAL(5, 2))  # % - Humedad del suelo
    ph_suelo = Column(DECIMAL(4, 2))  # pH - pH del suelo
    radiacion_solar = Column(DECIMAL(8, 2))  # W/m² - Radiación solar
    
    # Relaciones
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
    
    # Relaciones
    sensor = relationship("Sensor", back_populates="alertas")
    usuario = relationship("Usuario")


class ConfiguracionUmbral(Base):
    """Modelo de configuración de umbrales por cultivo y sensor"""
    __tablename__ = "configuracion_umbrales"
    
    id_configuracion = Column(Integer, primary_key=True, index=True)
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    
    # Umbrales de temperatura del ambiente
    temp_min = Column(DECIMAL(5, 2), default=10.0)  # °C
    temp_max = Column(DECIMAL(5, 2), default=35.0)  # °C
    
    # Umbrales de humedad del ambiente
    humedad_aire_min = Column(DECIMAL(5, 2), default=40.0)  # %
    humedad_aire_max = Column(DECIMAL(5, 2), default=90.0)  # %
    
    # Umbrales de humedad del suelo
    humedad_suelo_min = Column(DECIMAL(5, 2), default=30.0)  # %
    humedad_suelo_max = Column(DECIMAL(5, 2), default=80.0)  # %
    
    # Umbrales de pH del suelo
    ph_min = Column(DECIMAL(4, 2), default=6.0)
    ph_max = Column(DECIMAL(4, 2), default=7.5)
    
    # Umbrales de radiación solar
    radiacion_min = Column(DECIMAL(8, 2), default=200.0)  # W/m²
    radiacion_max = Column(DECIMAL(8, 2), default=1000.0)  # W/m²
    
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, default=func.now())
    
    # Relaciones
    usuario = relationship("Usuario")

# Funciones de utilidad
def get_db():
    """Generator para obtener sesiones de base de datos con manejo automático de cleanup"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Crea todas las tablas definidas en los modelos"""
    Base.metadata.create_all(bind=engine)