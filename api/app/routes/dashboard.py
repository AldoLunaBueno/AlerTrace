"""
Router de estadísticas y datos del dashboard
Contiene endpoints para métricas y datos generales
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database.connection import get_db
from app.models.database import Usuario, Cultivo, Sensor
from app.models.schemas import DashboardResponse
from app.services.sensor_service import SensorService
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard y Estadísticas"]
)


@router.get("/health")
def health_check():
    """Endpoint de health check para verificar estado del servicio"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "environment": "development"
    }


@router.get("/", response_model=DashboardResponse)
async def obtener_dashboard(
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener datos del dashboard del usuario"""
    # Obtener total de cultivos
    total_cultivos = db.query(Cultivo).filter(
        Cultivo.id_usuario == usuario.id_usuario
    ).count()
    
    # Obtener cultivos activos (con fecha de siembra reciente)
    cultivos_activos = db.query(Cultivo).filter(
        Cultivo.id_usuario == usuario.id_usuario,
        Cultivo.fecha_siembra.isnot(None)
    ).count()
    
    # Estadísticas básicas
    return DashboardResponse(
        total_cultivos=total_cultivos,
        cultivos_activos=cultivos_activos,
        alertas_pendientes=0  # Por implementar
    )


@router.get("/sensores")
async def obtener_dashboard_sensores(
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    horas: int = 24
):
    """Obtener dashboard completo de sensores IoT"""
    return SensorService.obtener_datos_dashboard(db, usuario.id_usuario, horas)


@router.get("/sensores/estadisticas")
async def obtener_estadisticas_sensores(
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas generales de sensores"""
    return SensorService.obtener_estadisticas_sensores(db, usuario.id_usuario)


@router.get("/sensores/{sensor_id}/historico")
async def obtener_historico_sensor(
    sensor_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    horas: int = 24,
    intervalo: int = 60
):
    """Obtener datos históricos de un sensor para gráficos"""
    # Verificar acceso al sensor
    sensor = db.query(Sensor).join(Cultivo).filter(
        Sensor.id_sensor == sensor_id,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor no encontrado"
        )
    
    return SensorService.obtener_historico_sensor(db, sensor_id, horas, intervalo)


@router.get("/sensores/{sensor_id}/reporte")
async def obtener_reporte_sensor(
    sensor_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    dias: int = 7
):
    """Generar reporte completo de un sensor"""
    # Verificar acceso al sensor
    sensor = db.query(Sensor).join(Cultivo).filter(
        Sensor.id_sensor == sensor_id,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor no encontrado"
        )
    
    reporte = SensorService.generar_reporte_sensor(db, sensor_id, dias)
    
    if "error" in reporte:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=reporte["error"]
        )
    
    return reporte


# Endpoints adicionales pueden ser añadidos aquí según se necesiten


@router.get("/recent-activity")
def get_recent_activity(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener actividad reciente del usuario"""
    # Obtener cultivos recientes del usuario
    recent_cultivos = db.query(Cultivo).filter(
        Cultivo.id_usuario == current_user.id_usuario
    ).order_by(Cultivo.id_cultivo.desc()).limit(5).all()
    
    return {
        "recent_cultivos": [{
            "id_cultivo": cultivo.id_cultivo,
            "tipo_cultivo": cultivo.tipo_cultivo,
            "hectareas": cultivo.hectareas,
            "estado": cultivo.estado
        } for cultivo in recent_cultivos]
    }