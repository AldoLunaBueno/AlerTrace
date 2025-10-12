"""
Router de cultivos
Contiene endpoints CRUD para gestión de cultivos
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from database.models.database import Trabajador, Sensor
from api.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/cultivos",
    tags=["Cultivos"]
)


@router.get("/")
def get_cultivos(
    skip: int = 0, 
    limit: int = 100, 
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener lista de cultivos reales de la base de datos"""
    from database.models.database import Cultivo
    
    # Obtener cultivos del usuario actual
    cultivos = db.query(Cultivo).filter(
        Cultivo.id_usuario == current_user.id_trabajador
    ).offset(skip).limit(limit).all()
    
    # Transformar datos de cultivos para compatibilidad con frontend
    cultivos_response = []
    for cultivo in cultivos:
        cultivos_response.append({
            "id": cultivo.id_cultivo,
            "nombre": f"{cultivo.tipo_cultivo} {cultivo.variedad or ''}".strip(),
            "tipo": cultivo.tipo_cultivo,
            "variedad": cultivo.variedad,
            "fecha_siembra": cultivo.fecha_siembra.isoformat() if cultivo.fecha_siembra else None,
            "area": float(cultivo.hectareas),
            "estado": cultivo.estado,
            "agricultor_id": cultivo.id_usuario,
            "created_at": cultivo.fecha_siembra.isoformat() if cultivo.fecha_siembra else "2024-01-01T00:00:00",
            "ubicacion": cultivo.ubicacion_especifica,
            "coordenadas": {
                "lat": float(cultivo.coordenadas_lat) if cultivo.coordenadas_lat else None,
                "lng": float(cultivo.coordenadas_lng) if cultivo.coordenadas_lng else None
            } if cultivo.coordenadas_lat and cultivo.coordenadas_lng else None
        })
    
    return cultivos_response


@router.post("/")
def create_cultivo(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear un nuevo cultivo (endpoint simulado)"""
    return {
        "message": "Funcionalidad de cultivos no implementada aún",
        "id": 1,
        "nombre": "Cultivo simulado",
        "tipo": "test",
        "fecha_siembra": "2024-01-01",
        "area": 100.0,
        "estado": "crecimiento",
        "agricultor_id": current_user.id_trabajador
    }


@router.get("/{cultivo_id}")
def get_cultivo(
    cultivo_id: int,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener un cultivo específico (simulado basado en sensor)"""
    sensor = db.query(Sensor).filter(
        Sensor.id_sensor == cultivo_id,
        Sensor.id_empresa == current_user.id_empresa
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    return {
        "id": sensor.id_sensor,
        "nombre": f"Cultivo {sensor.nombre}",
        "tipo": sensor.tipo,
        "fecha_siembra": "2024-01-01",
        "area": 100.0,
        "estado": "crecimiento" if sensor.activo else "inactivo",
        "agricultor_id": current_user.id_trabajador,
        "created_at": sensor.fecha_instalacion.isoformat() if sensor.fecha_instalacion else "2024-01-01T00:00:00"
    }


@router.put("/{cultivo_id}")
def update_cultivo(
    cultivo_id: int,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar un cultivo (endpoint simulado)"""
    return {
        "message": "Cultivo actualizado",
        "id": cultivo_id,
        "agricultor_id": current_user.id_trabajador
    }


@router.delete("/{cultivo_id}")
def delete_cultivo(
    cultivo_id: int,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar un cultivo (endpoint simulado)"""
    return {"message": "Cultivo eliminado exitosamente"}