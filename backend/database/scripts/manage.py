#!/usr/bin/env python3
import os
import sys

# Agregar el directorio backend al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from api.config import settings
from database.models.database import (
    Base, Empresa, Trabajador, Sensor, AsignacionSensor, LecturaSensor,
    Farm, FarmCertification, Lot, HarvestEvent, ProcessingEvent, TransferEvent, BlockchainSync
)

class DatabaseManager:
    def __init__(self):
        self.engine = create_engine(settings.database_url)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
    
    def verify_tables(self):
        inspector = inspect(self.engine)
        existing_tables = inspector.get_table_names()
        expected_tables = [
            'empresas', 'trabajadores', 'sensores', 'asignaciones_sensores', 'lecturas_sensores',
            'alertas', 'configuracion_umbrales', 'farms', 'farm_certifications', 'lots',
            'harvest_events', 'processing_events', 'transfer_events', 'blockchain_sync'
        ]
        return all(table in existing_tables for table in expected_tables)
    
    def show_data_summary(self):
        db = self.SessionLocal()
        try:
            companies = db.query(Empresa).count()
            workers = db.query(Trabajador).count()
            sensors = db.query(Sensor).count()
            assignments = db.query(AsignacionSensor).filter(AsignacionSensor.activa == True).count()
            readings = db.query(LecturaSensor).count()
            farms = db.query(Farm).count()
            certifications = db.query(FarmCertification).count()
            lots = db.query(Lot).count()
            harvest_events = db.query(HarvestEvent).count()
            processing_events = db.query(ProcessingEvent).count()
            transfer_events = db.query(TransferEvent).count()
            blockchain_syncs = db.query(BlockchainSync).count()
            
            print(f"Companies: {companies}, Workers: {workers}, Sensors: {sensors}")
            print(f"Assignments: {assignments}, Readings: {readings}")
            print(f"Farms: {farms}, Certifications: {certifications}, Lots: {lots}")
            print(f"Harvest Events: {harvest_events}, Processing Events: {processing_events}")
            print(f"Transfer Events: {transfer_events}, Blockchain Syncs: {blockchain_syncs}")
        finally:
            db.close()

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Gestión de Base de Datos')
    parser.add_argument('command', choices=['verify', 'summary'])
    args = parser.parse_args()
    
    db = DatabaseManager()
    
    if args.command == 'verify':
        if db.verify_tables():
            print("Todas las tablas existen")
            db.show_data_summary()
        else:
            print("Faltan tablas")
    elif args.command == 'summary':
        db.show_data_summary()

if __name__ == "__main__":
    main()