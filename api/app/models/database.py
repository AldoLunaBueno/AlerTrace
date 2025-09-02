from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Decimal, Text, ARRAY, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from ..config import settings

# Configuración de la base de datos
engine = create_engine(settings.postgres_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# ======================
# MODELOS DE SQLALCHEMY - Solo usuarios y configuración
# Los datos de sensores van a Timestream
# ======================

class Organizacion(Base):
    __tablename__ = "organizaciones"
    
    id_organizacion = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(50), nullable=False)
    direccion = Column(Text)
    telefono = Column(String(20))
    email = Column(String(100), unique=True)
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    activo = Column(Boolean, default=True)
    
    # Relaciones
    usuarios = relationship("Usuario", back_populates="organizacion")
    agricultores = relationship("Agricultor", back_populates="organizacion")

class Usuario(Base):
    __tablename__ = "usuarios"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    rol = Column(String(20), nullable=False, index=True)
    telefono = Column(String(20))
    fecha_registro = Column(DateTime(timezone=True), server_default=func.now())
    ultimo_acceso = Column(DateTime(timezone=True))
    activo = Column(Boolean, default=True)
    id_organizacion = Column(Integer, ForeignKey("organizaciones.id_organizacion"))
    
    # Relaciones
    organizacion = relationship("Organizacion", back_populates="usuarios")
    agricultor = relationship("Agricultor", back_populates="usuario", uselist=False)
    comprador = relationship("Comprador", back_populates="usuario", uselist=False)

class Agricultor(Base):
    __tablename__ = "agricultores"
    
    id_agricultor = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    cedula = Column(String(20), unique=True)
    ubicacion_finca = Column(Text)
    coordenadas_lat = Column(Decimal(10, 8))
    coordenadas_lng = Column(Decimal(11, 8))
    hectareas_totales = Column(Decimal(8, 2))
    experiencia_anos = Column(Integer)
    id_organizacion = Column(Integer, ForeignKey("organizaciones.id_organizacion"))
    fecha_vinculacion = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="agricultor")
    organizacion = relationship("Organizacion", back_populates="agricultores")
    cultivos = relationship("Cultivo", back_populates="agricultor")

class Cultivo(Base):
    __tablename__ = "cultivos"
    
    id_cultivo = Column(Integer, primary_key=True, index=True)
    id_agricultor = Column(Integer, ForeignKey("agricultores.id_agricultor"), nullable=False)
    tipo_cultivo = Column(String(50), nullable=False, index=True)
    variedad = Column(String(100))
    hectareas = Column(Decimal(8, 2), nullable=False)
    fecha_siembra = Column(DateTime)
    fecha_estimada_cosecha = Column(DateTime)
    estado = Column(String(20), default="activo")
    ubicacion_especifica = Column(Text)
    coordenadas_lat = Column(Decimal(10, 8))
    coordenadas_lng = Column(Decimal(11, 8))
    
    # Relaciones
    agricultor = relationship("Agricultor", back_populates="cultivos")
    sensores = relationship("Sensor", back_populates="cultivo")

class Sensor(Base):
    __tablename__ = "sensores"
    
    id_sensor = Column(Integer, primary_key=True, index=True)
    codigo_sensor = Column(String(50), unique=True, nullable=False)
    nombre_sensor = Column(String(100))
    tipo_sensor = Column(String(50), nullable=False, index=True)
    marca = Column(String(50))
    modelo = Column(String(50))
    fecha_instalacion = Column(DateTime(timezone=True), server_default=func.now())
    fecha_ultima_comunicacion = Column(DateTime(timezone=True))
    estado = Column(String(20), default="activo", index=True)
    id_cultivo = Column(Integer, ForeignKey("cultivos.id_cultivo"))
    coordenadas_lat = Column(Decimal(10, 8))
    coordenadas_lng = Column(Decimal(11, 8))
    configuracion = Column(JSON)
    timestream_device_id = Column(String(100))  # ID para relacionar con Timestream
    certificado_iot = Column(Text)  # Certificado AWS IoT Core
    intervalo_lectura = Column(Integer, default=3600)  # segundos entre lecturas
    
    # Relaciones
    cultivo = relationship("Cultivo", back_populates="sensores")

class Comprador(Base):
    __tablename__ = "compradores"
    
    id_comprador = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    empresa = Column(String(100))
    tipo_comprador = Column(String(50))
    certificaciones = Column(ARRAY(Text))
    volumen_demanda_mensual = Column(Decimal(10, 2))
    precio_maximo_kg = Column(Decimal(8, 2))
    
    # Relaciones
    usuario = relationship("Usuario", back_populates="comprador")

# ======================
# FUNCIONES DE UTILIDAD
# ======================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)