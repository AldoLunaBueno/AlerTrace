"""
Router de estadísticas y datos del dashboard
Contiene endpoints para métricas y datos generales
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.connection import get_db
from database.models.database import Trabajador, Sensor, Alerta
from api.auth.dependencies import get_current_user

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


@router.get("/")
async def obtener_dashboard(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener datos del dashboard del usuario"""
    from sqlalchemy import text
    
    # Obtener ID de empresa del usuario actual
    id_empresa = current_user.id_empresa
    
    # Usar consultas SQL directas para evitar problemas de ORM
    result = db.execute(text("SELECT COUNT(*) FROM sensores WHERE id_empresa = :empresa_id"), 
                        {"empresa_id": id_empresa})
    total_sensores = result.scalar()
    
    result = db.execute(text("SELECT COUNT(*) FROM sensores WHERE id_empresa = :empresa_id AND activo = true"), 
                        {"empresa_id": id_empresa})
    sensores_activos = result.scalar()
    
    result = db.execute(text("SELECT COUNT(*) FROM alertas WHERE id_empresa = :empresa_id AND resuelta = false"), 
                        {"empresa_id": id_empresa})
    alertas_pendientes = result.scalar()
    
    return {
        "total_cultivos": total_sensores,
        "cultivos_activos": sensores_activos,
        "alertas_pendientes": alertas_pendientes
    }


@router.get("/sensores")
async def obtener_dashboard_sensores(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db),
    horas: int = 24
):
    """Obtener dashboard completo de sensores IoT"""
    return {"message": "Dashboard de sensores no implementado aún"}


@router.get("/sensores/estadisticas")
async def obtener_estadisticas_sensores(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas generales de sensores"""
    return {"message": "Estadísticas de sensores no implementadas aún"}


@router.get("/kpis")
async def get_dashboard_kpis(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener KPIs principales del dashboard"""
    from api.models.schemas import DashboardKPIs
    
    # Contar sensores activos de la empresa
    sensores_activos = db.query(Sensor).filter(
        Sensor.id_empresa == current_user.id_empresa,
        Sensor.activo == True
    ).count()
    
    # Contar sensores totales como "cultivos monitoreados"
    cultivos_monitoreados = db.query(Sensor).filter(
        Sensor.id_empresa == current_user.id_empresa
    ).count()
    
    # Contar alertas pendientes
    alertas_pendientes = db.query(Alerta).filter(
        Alerta.id_empresa == current_user.id_empresa,
        Alerta.resuelta == False
    ).count()
    
    return DashboardKPIs(
        sensores_activos=sensores_activos,
        cultivos_monitoreados=cultivos_monitoreados,
        alertas_pendientes=alertas_pendientes,
        ultima_actualizacion=datetime.utcnow().isoformat()
    )


@router.get("/sensor-data/{sensor_id}")
async def get_sensor_data(
    sensor_id: int,
    days: int = 7,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener datos históricos de un sensor"""
    # Verificar que el sensor pertenece a la empresa
    sensor = db.query(Sensor).filter(
        Sensor.id_sensor == sensor_id,
        Sensor.id_empresa == current_user.id_empresa
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor no encontrado"
        )
    
    # Retornar datos mock por ahora
    return {
        "sensor_id": sensor_id,
        "data": [],
        "message": "Datos históricos no implementados aún"
    }


@router.get("/trabajadores")
async def get_trabajadores(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener lista de trabajadores de la empresa del usuario actual"""
    # Obtener todos los trabajadores de la misma empresa
    trabajadores = db.query(Trabajador).filter(
        Trabajador.id_empresa == current_user.id_empresa
    ).all()
    
    # Formatear datos
    trabajadores_data = []
    for trabajador in trabajadores:
        trabajadores_data.append({
            "id": str(trabajador.id_trabajador),
            "name": trabajador.nombre_completo,
            "dni": trabajador.dni,
            "email": trabajador.email,
            "phone": "N/A",  # No tenemos teléfono en el modelo actual
            "role": trabajador.rol,
            "department": "Producción" if trabajador.rol == "worker" else "Administración",
            "assignedSensors": [],  # TODO: Implementar asignaciones reales
            "status": "active" if trabajador.activo else "inactive",
            "lastActive": trabajador.fecha_creacion.strftime("%Y-%m-%d") if trabajador.fecha_creacion else "N/A"
        })
    
    return trabajadores_data

@router.get("/produccion")
async def get_produccion_data(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener datos de producción"""
    sensores = db.query(Sensor).filter(
        Sensor.id_empresa == current_user.id_empresa
    ).all()
    
    return {
        "total_hectareas": len(sensores) * 10,  # Mock: 10 hectáreas por sensor
        "cultivos_por_tipo": {"maiz": 2, "soja": 1, "trigo": 1},  # Mock data
        "produccion_estimada": len(sensores) * 1000,  # Mock: 1000 kg por sensor
        "rendimiento_promedio": 85.5  # Mock percentage
    }