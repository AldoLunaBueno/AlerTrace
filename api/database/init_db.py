#!/usr/bin/env python3
"""
Database initialization for SachaTrace IoT system.
Creates tables, migrates sensor_id → device_id, adds sample data.
"""

import os
import sys
import logging
from sqlalchemy import text, inspect

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import engine, SessionLocal, Base
from app.models.database import Usuario, Cultivo, Sensor
from app.config import settings

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def migrate_columns():
    """Migrate sensor_id → device_id if needed"""
    try:
        inspector = inspect(engine)
        
        if 'sensores' not in inspector.get_table_names():
            return True
        
        columns = [col['name'] for col in inspector.get_columns('sensores')]
        
        if 'device_id' in columns:
            return True
            
        if 'sensor_id' in columns:
            with engine.connect() as connection:
                connection.execute(text("ALTER TABLE sensores RENAME COLUMN sensor_id TO device_id;"))
                connection.commit()
                return True
        
        return True
        
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        return False

def create_sample_data():
    """Create test users, crops and sensors"""
    db = SessionLocal()
    try:
        if db.query(Usuario).count() > 0:
            return
        
        # Test users (password: secret)
        users = [
            Usuario(
                username="admin",
                nombre="Admin User", 
                email="admin@sachatrace.com",
                password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                rol="admin"
            ),
            Usuario(
                username="agricultor1",
                nombre="Juan Pérez",
                email="juan@example.com", 
                password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                rol="agricultor"
            ),
            Usuario(
                username="comprador1",
                nombre="María García",
                email="maria@example.com",
                password_hash="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                rol="comprador"
            )
        ]
        
        for user in users:
            db.add(user)
        
        db.commit()
        
        # Test crops
        crops = [
            Cultivo(
                id_usuario=2,  # agricultor1
                tipo_cultivo="Café",
                variedad="Arábica",
                hectareas=2.5,
                estado="activo",
                ubicacion_especifica="Norte - Lote A"
            ),
            Cultivo(
                id_usuario=2,  # agricultor1
                tipo_cultivo="Cacao", 
                variedad="Trinitario",
                hectareas=1.8,
                estado="activo",
                ubicacion_especifica="Sur - Lote B"
            )
        ]
        
        for crop in crops:
            db.add(crop)
            
        db.commit()
        
        # Test IoT sensors with device_id
        sensors = [
            Sensor(
                device_id="TEMP_001",
                nombre="Coffee Temperature Sensor",
                tipo="multisensor",
                id_cultivo=1,
                id_usuario=2,
                ubicacion_sensor="Lote A - Centro",
                intervalo_lectura=300
            ),
            Sensor(
                device_id="HUM_002", 
                nombre="Cacao Humidity Sensor",
                tipo="multisensor",
                id_cultivo=2,
                id_usuario=2,
                ubicacion_sensor="Lote B - Norte",
                intervalo_lectura=600
            )
        ]
        
        for sensor in sensors:
            db.add(sensor)
            
        db.commit()
        
    except Exception as e:
        logger.error(f"Sample data failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def init_db():
    """Initialize database with tables and sample data"""
    logger.info("Initializing database...")
    
    try:
        if not migrate_columns():
            logger.error("Migration failed")
            sys.exit(1)
        
        Base.metadata.create_all(bind=engine)
        create_sample_data()
        
        logger.info("Database initialized successfully")
        
    except Exception as e:
        logger.error(f"Database init failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    init_db()