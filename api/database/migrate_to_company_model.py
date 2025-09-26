#!/usr/bin/env python3
import os
import sys
import logging
from sqlalchemy import text, inspect

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import engine, SessionLocal, Base, drop_all_tables, create_tables
from app.models.database import Empresa, Trabajador, Sensor, AsignacionSensor
from app.config import settings

logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def backup_sensor_data():
    """Backup existing sensor data before migration"""
    try:
        db = SessionLocal()
        
        # Check if old tables exist
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        backup_data = {}
        
        if 'sensores' in existing_tables:
            # Backup sensor device_ids and basic info
            result = db.execute(text("""
                SELECT device_id, nombre, tipo, ubicacion_sensor, 
                       intervalo_lectura, fecha_instalacion
                FROM sensores 
                WHERE activo = true
            """))
            backup_data['sensores'] = [dict(row) for row in result]
            logger.info(f"Backed up {len(backup_data['sensores'])} sensors")
        
        if 'lecturas_sensores' in existing_tables:
            # Backup recent sensor readings (last 30 days)
            result = db.execute(text("""
                SELECT s.device_id, l.timestamp, l.temperatura, l.humedad_aire,
                       l.humedad_suelo, l.ph_suelo, l.radiacion_solar
                FROM lecturas_sensores l
                JOIN sensores s ON l.id_sensor = s.id_sensor
                WHERE l.timestamp >= NOW() - INTERVAL '30 DAYS'
                ORDER BY l.timestamp DESC
                LIMIT 10000
            """))
            backup_data['lecturas'] = [dict(row) for row in result]
            logger.info(f"Backed up {len(backup_data['lecturas'])} recent readings")
        
        db.close()
        return backup_data
        
    except Exception as e:
        logger.warning(f"Backup failed (expected if tables don't exist): {e}")
        return {}

def drop_old_structure():
    """Drop all existing tables from old structure"""
    try:
        drop_all_tables()
        return True
    except Exception as e:
        logger.error(f"Failed to drop old structure: {e}")
        return False

def create_new_structure():
    """Create new company-worker database structure"""
    try:
        create_tables()
        return True
    except Exception as e:
        logger.error(f"Failed to create new structure: {e}")
        return False

def create_sample_data():
    """Create sample companies, workers and sensors for testing"""
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(Empresa).count() > 0:
            return
        
        # Hash for password "secret123"
        password_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW"
        
        # Create sample companies
        empresas = [
            Empresa(
                ruc="20123456789",
                nombre_empresa="AgroTech Solutions SAC",
                email="admin@agrotech.com",
                telefono="01-234-5678",
                password_hash=password_hash,
                estado="activa",
                sensores_disponibles=50
            ),
            Empresa(
                ruc="20987654321",
                nombre_empresa="Smart Farm Corp",
                email="info@smartfarm.com",
                telefono="01-987-6543",
                password_hash=password_hash,
                estado="activa",
                sensores_disponibles=25
            )
        ]
        
        for empresa in empresas:
            db.add(empresa)
        
        db.commit()
        
        # Create sample workers
        trabajadores = [
            Trabajador(
                id_empresa=1,  # AgroTech
                dni="12345678",
                nombre_completo="Juan Carlos Pérez García",
                password_hash=password_hash,
                activo=True
            ),
            Trabajador(
                id_empresa=1,  # AgroTech
                dni="87654321",
                nombre_completo="María Elena Rodríguez López",
                password_hash=password_hash,
                activo=True
            ),
            Trabajador(
                id_empresa=2,  # Smart Farm
                dni="11223344",
                nombre_completo="Carlos Alberto Mendoza Silva",
                password_hash=password_hash,
                activo=True
            )
        ]
        
        for trabajador in trabajadores:
            db.add(trabajador)
            
        db.commit()
        
        # Create sample sensors
        sensores = [
            Sensor(
                id_empresa=1,
                device_id="AGRO_TEMP_001",
                nombre="Temperature Sensor - Field A",
                tipo="multisensor",
                ubicacion_sensor="North Field - Section A1",
                intervalo_lectura=300
            ),
            Sensor(
                id_empresa=1,
                device_id="AGRO_HUM_002",
                nombre="Humidity Sensor - Field B",
                tipo="multisensor",
                ubicacion_sensor="South Field - Section B2",
                intervalo_lectura=600
            ),
            Sensor(
                id_empresa=2,
                device_id="SMART_MULTI_001",
                nombre="Multi Sensor - Greenhouse 1",
                tipo="multisensor",
                ubicacion_sensor="Greenhouse 1 - Center",
                intervalo_lectura=300
            )
        ]
        
        for sensor in sensores:
            db.add(sensor)
            
        db.commit()
        
        # Create sample sensor assignments
        asignaciones = [
            AsignacionSensor(id_trabajador=1, id_sensor=1, activa=True),  # Juan -> AGRO_TEMP_001
            AsignacionSensor(id_trabajador=2, id_sensor=2, activa=True),  # María -> AGRO_HUM_002
            AsignacionSensor(id_trabajador=3, id_sensor=3, activa=True),  # Carlos -> SMART_MULTI_001
        ]
        
        for asignacion in asignaciones:
            db.add(asignacion)
            
        db.commit()
        
    except Exception as e:
        logger.error(f"Sample data creation failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def migrate_database():
    """Execute database migration"""
    
    try:
        # Backup existing data
        backup_data = backup_sensor_data()
        
        # Drop old structure
        if not drop_old_structure():
            sys.exit(1)
        
        # Create new structure
        if not create_new_structure():
            sys.exit(1)
        
        # Create sample data
        create_sample_data()
        
    except Exception as e:
        logger.error(f"Database migration failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    migrate_database()