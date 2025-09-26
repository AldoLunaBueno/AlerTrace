"""IoT sensor management routes for Company-Worker model"""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func

from app.database.connection import get_db
from app.models.database import (
    Sensor, LecturaSensor, Alerta, ConfiguracionUmbral, 
    Empresa, Trabajador, AsignacionSensor
)
from app.models.schemas import SensorData, SensorResponse, LecturaSensorResponse
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/sensores", tags=["sensores"])

@router.post("/data", status_code=status.HTTP_201_CREATED)
async def receive_sensor_data(
    sensor_data: SensorData,
    db: Session = Depends(get_db)
):
    """Receive IoT sensor data - Public endpoint for devices"""
    sensor = db.query(Sensor).filter(
        Sensor.device_id == sensor_data.device_id
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor with device_id {sensor_data.device_id} not found"
        )
    
    nueva_lectura = LecturaSensor(
        id_sensor=sensor.id_sensor,
        temperatura=sensor_data.temperatura,
        humedad_aire=sensor_data.humedad_aire,
        ph_suelo=sensor_data.ph_suelo,
        humedad_suelo=sensor_data.humedad_suelo,
        radiacion_solar=sensor_data.radiacion_solar,
        timestamp=datetime.fromisoformat(sensor_data.timestamp.replace('Z', '+00:00')) if sensor_data.timestamp else datetime.utcnow()
    )
    
    db.add(nueva_lectura)
    sensor.ultima_lectura = nueva_lectura.timestamp
    sensor.activo = True
    db.commit()
    db.refresh(nueva_lectura)
    
    return {
        "message": "Sensor data received successfully",
        "sensor_id": sensor.id_sensor,
        "device_id": sensor.device_id,
        "timestamp": nueva_lectura.timestamp
    }

@router.get("/", response_model=List[SensorResponse])
async def obtener_sensores_trabajador(
    trabajador: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db),
    activo: Optional[bool] = None
):
    """Obtener lista de sensores asignados al trabajador"""
    query = db.query(Sensor).join(AsignacionSensor).filter(
        AsignacionSensor.id_trabajador == trabajador.id_trabajador,
        AsignacionSensor.activa == True
    )
    
    if activo is not None:
        query = query.filter(Sensor.activo == activo)
    
    sensores = query.all()
    return sensores
