from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Float, Text, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from sqlalchemy import ForeignKey
from ..config import settings
import datetime

# Configuración de la base de datos
engine = create_engine(settings.postgres_url)
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