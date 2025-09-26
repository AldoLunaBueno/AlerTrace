#!/usr/bin/env python3
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import inspect, text
from app.models.database import engine, SessionLocal
from app.models.database import Empresa, Trabajador, Sensor, AsignacionSensor

def verify_table_structure():
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    expected_tables = [
        'empresas', 'trabajadores', 'sensores', 'asignaciones_sensores',
        'lecturas_sensores', 'alertas', 'configuracion_umbrales'
    ]
    
    for table in expected_tables:
        if table in tables:
            print(f"{table} - EXISTS")
            
            # Show columns for key tables
            if table in ['empresas', 'trabajadores', 'asignaciones_sensores']:
                columns = inspector.get_columns(table)
                print(f"   Columns: {', '.join([col['name'] for col in columns])}")
        else:
            print(f"{table} - MISSING")
    
    print()

def verify_relationships():
    db = SessionLocal()
    
    try:
        # Test empresa -> trabajadores relationship
        empresa = db.query(Empresa).first()
        if empresa:
            trabajadores_count = len(empresa.trabajadores)
            print(f"Empresa '{empresa.nombre_empresa}' has {trabajadores_count} workers")
        
        # Test trabajador -> empresa relationship  
        trabajador = db.query(Trabajador).first()
        if trabajador:
            print(f"Worker '{trabajador.nombre_completo}' belongs to '{trabajador.empresa.nombre_empresa}'")
        
        # Test sensor assignments
        asignacion = db.query(AsignacionSensor).first()
        if asignacion:
            print(f"Assignment: {asignacion.trabajador.nombre_completo} -> {asignacion.sensor.nombre}")
            
    except Exception as e:
        print(f"Relationship error: {e}")
    
    finally:
        db.close()
    
    print()

def verify_constraints():
    db = SessionLocal()
    
    try:
        # Check unique constraints
        empresas_ruc = db.execute(text("SELECT COUNT(DISTINCT ruc) as unique_ruc, COUNT(*) as total FROM empresas")).fetchone()
        if empresas_ruc.unique_ruc == empresas_ruc.total:
            print("RUC uniqueness constraint working")
        else:
            print("RUC uniqueness constraint failed")
            
        trabajadores_dni = db.execute(text("SELECT COUNT(DISTINCT dni) as unique_dni, COUNT(*) as total FROM trabajadores")).fetchone()
        if trabajadores_dni.unique_dni == trabajadores_dni.total:
            print("DNI uniqueness constraint working")
        else:
            print("DNI uniqueness constraint failed")
            
        # Check foreign key constraints
        orphaned_sensors = db.execute(text("""
            SELECT COUNT(*) as count 
            FROM sensores s 
            LEFT JOIN empresas e ON s.id_empresa = e.id_empresa 
            WHERE e.id_empresa IS NULL
        """)).fetchone()
        
        if orphaned_sensors.count == 0:
            print("Sensor-Company foreign key constraint working")
        else:
            print(f"Found {orphaned_sensors.count} orphaned sensors")
            
    except Exception as e:
        print(f"Constraint verification error: {e}")
    
    finally:
        db.close()
    
    print()

def show_sample_data():
    db = SessionLocal()
    
    try:
        empresas = db.query(Empresa).all()
        print(f"Companies ({len(empresas)}):")
        for empresa in empresas:
            print(f"  - {empresa.nombre_empresa} (RUC: {empresa.ruc}) - {empresa.sensores_disponibles} sensors available")
        
        print()
        
        trabajadores = db.query(Trabajador).all()
        print(f"Workers ({len(trabajadores)}):")
        for trabajador in trabajadores:
            print(f"  - {trabajador.nombre_completo} (DNI: {trabajador.dni}) - Company: {trabajador.empresa.nombre_empresa}")
        
        print()
        
        sensores = db.query(Sensor).all()
        print(f"Sensors ({len(sensores)}):")
        for sensor in sensores:
            print(f"  - {sensor.nombre} (ID: {sensor.device_id}) - Company: {sensor.empresa.nombre_empresa}")
        
        print()
        
        asignaciones = db.query(AsignacionSensor).filter(AsignacionSensor.activa == True).all()
        print(f"Active Assignments ({len(asignaciones)}):")
        for asignacion in asignaciones:
            print(f"  - {asignacion.trabajador.nombre_completo} -> {asignacion.sensor.nombre}")
        
    except Exception as e:
        print(f"Sample data error: {e}")
    
    finally:
        db.close()

def main():
    verify_table_structure()
    verify_relationships()
    verify_constraints()
    show_sample_data()
if __name__ == "__main__":
    main()