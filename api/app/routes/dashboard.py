"""
Router de estadísticas y datos del dashboard
Contiene endpoints para métricas y datos generales
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database.connection import get_db
from ..models.database import Usuario, Cultivo
from ..models.schemas import SensorData, HealthCheck
from ..auth.dependencies import get_current_user
import time

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard y Estadísticas"]
)


@router.get("/health", response_model=HealthCheck)
def health_check():
    """Endpoint de health check para verificar estado del servicio"""
    return HealthCheck(
        status="healthy",
        timestamp=int(time.time()),
        version="1.0.0",
        environment="development"
    )


@router.get("/stats")
def get_dashboard_stats(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener estadísticas para el dashboard"""
    if current_user.rol == "admin":
        # Stats generales para admin
        total_users = db.query(Usuario).count()
        total_cultivos = db.query(Cultivo).count()
        
        # Cultivos por tipo
        cultivos_por_tipo = db.query(
            Cultivo.tipo_cultivo, 
            func.count(Cultivo.id_cultivo)
        ).group_by(Cultivo.tipo_cultivo).all()
        
        # Usuarios por rol
        usuarios_por_rol = db.query(
            Usuario.rol,
            func.count(Usuario.id_usuario)
        ).group_by(Usuario.rol).all()
        
        return {
            "total_usuarios": total_users,
            "total_cultivos": total_cultivos,
            "cultivos_por_tipo": [{"tipo": tipo, "cantidad": count} for tipo, count in cultivos_por_tipo],
            "usuarios_por_rol": [{"rol": rol, "cantidad": count} for rol, count in usuarios_por_rol]
        }
    else:
        # Stats específicas del usuario
        mis_cultivos = db.query(Cultivo).filter(
            Cultivo.id_usuario == current_user.id_usuario
        ).count()
        
        # Mis cultivos por estado
        cultivos_por_estado = db.query(
            Cultivo.estado,
            func.count(Cultivo.id_cultivo)
        ).filter(
            Cultivo.id_usuario == current_user.id_usuario
        ).group_by(Cultivo.estado).all()
        
        # Hectáreas totales
        hectareas_totales = db.query(
            func.sum(Cultivo.hectareas)
        ).filter(
            Cultivo.id_usuario == current_user.id_usuario
        ).scalar() or 0
        
        return {
            "mis_cultivos": mis_cultivos,
            "hectareas_totales": float(hectareas_totales),
            "cultivos_por_estado": [{"estado": estado, "cantidad": count} for estado, count in cultivos_por_estado]
        }


@router.post("/sensor-data")
def receive_sensor_data(
    sensor_data: SensorData,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Recibir datos de sensores IoT (simulado)"""
    # En una implementación real, aquí guardarías los datos en una tabla de sensores
    # Por ahora solo retornamos confirmación
    
    return {
        "message": "Datos de sensor recibidos",
        "sensor_id": sensor_data.sensor_id,
        "timestamp": sensor_data.timestamp,
        "processed_by": current_user.username
    }


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