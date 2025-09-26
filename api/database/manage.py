#!/usr/bin/env python3
import os
import sys
import bcrypt

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.database import Base, Empresa, Trabajador, Sensor, AsignacionSensor, LecturaSensor

class DatabaseManager:
    def __init__(self):
        self.engine = create_engine(settings.database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
    
    def create_password_hash(self, password: str) -> str:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    def drop_all_tables(self):
        Base.metadata.drop_all(bind=self.engine)
    
    def create_all_tables(self):
        Base.metadata.create_all(bind=self.engine)
    
    def verify_tables(self):
        inspector = inspect(self.engine)
        existing_tables = inspector.get_table_names()
        expected_tables = ['empresas', 'trabajadores', 'sensores', 'asignaciones_sensores', 'lecturas_sensores']
        return all(table in existing_tables for table in expected_tables)
    
    def seed_sample_data(self):
        db = self.SessionLocal()
        try:
            if db.query(Empresa).count() > 0:
                return
            
            password_hash = self.create_password_hash('secret123')
            
            empresa = Empresa(ruc="20123456789", nombre_empresa="AgroTech Solutions SAC", 
                            email="admin@agrotech.com", telefono="01-234-5678", 
                            password_hash=password_hash, estado="activa", sensores_disponibles=50)
            db.add(empresa)
            db.commit()
            
            # Admin user
            admin = Trabajador(id_empresa=1, dni="12345678", 
                             nombre_completo="Juan Pérez", password_hash=password_hash, 
                             rol="admin", activo=True)
            db.add(admin)
            
            # Regular worker
            worker = Trabajador(id_empresa=1, dni="87654321", 
                              nombre_completo="María García", password_hash=password_hash, 
                              rol="worker", activo=True)
            db.add(worker)
            db.commit()
            
            sensor = Sensor(id_empresa=1, device_id="AGRO_TEMP_001", nombre="Temperature Sensor", 
                          tipo="multisensor", ubicacion_sensor="Field A", intervalo_lectura=300)
            db.add(sensor)
            db.commit()
            
            # Assignments for both users
            asignacion_admin = AsignacionSensor(id_trabajador=1, id_sensor=1, activa=True)
            asignacion_worker = AsignacionSensor(id_trabajador=2, id_sensor=1, activa=True)
            db.add(asignacion_admin)
            db.add(asignacion_worker)
            db.commit()
        except:
            db.rollback()
        finally:
            db.close()
    
    def show_data_summary(self):
        db = self.SessionLocal()
        try:
            companies = db.query(Empresa).count()
            workers = db.query(Trabajador).count()
            sensors = db.query(Sensor).count()
            assignments = db.query(AsignacionSensor).filter(AsignacionSensor.activa == True).count()
            readings = db.query(LecturaSensor).count()
            
            print(f"Companies: {companies}, Workers: {workers}, Sensors: {sensors}, Assignments: {assignments}, Readings: {readings}")
        finally:
            db.close()
    
    def reset_database(self):
        self.drop_all_tables()
        self.create_all_tables()
        self.seed_sample_data()
        self.show_data_summary()
    
    def setup_database(self):
        self.create_all_tables()
        self.seed_sample_data()
        self.show_data_summary()

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Database Management')
    parser.add_argument('command', choices=['setup', 'reset', 'verify', 'summary'])
    args = parser.parse_args()
    
    db = DatabaseManager()
    
    if args.command == 'setup':
        db.setup_database()
    elif args.command == 'reset':
        db.reset_database()
    elif args.command == 'verify':
        if db.verify_tables():
            print("All tables exist")
            db.show_data_summary()
        else:
            print("Some tables missing")
    elif args.command == 'summary':
        db.show_data_summary()

if __name__ == "__main__":
    main()