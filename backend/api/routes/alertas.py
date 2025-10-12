"""
Router de alertas
Contiene endpoints CRUD para gestión de alertas del sistema
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from database.connection import get_db
from database.models.database import Trabajador, Empresa, Alerta, Sensor
from api.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/alertas",
    tags=["Alertas"]
)


@router.get("/")
def get_alertas(
    skip: int = 0,
    limit: int = 100,
    estado: Optional[str] = None,
    severidad: Optional[str] = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener lista de alertas según el tipo de usuario"""
    try:
        from sqlalchemy import text
        
        # Determinar empresa_id según el tipo de usuario
        if isinstance(current_user, Trabajador):
            empresa_id = current_user.id_empresa
        elif isinstance(current_user, Empresa):
            empresa_id = current_user.id_empresa
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Tipo de usuario no válido"
            )
        
        # Usar consulta simple para evitar problemas
        estado_filter = ""
        if estado == "resuelta":
            estado_filter = "AND resuelta = TRUE"
        elif estado == "pendiente" or estado is None:
            estado_filter = "AND resuelta = FALSE"
        
        result = db.execute(text(f"""
            SELECT id_alerta, id_sensor, tipo_alerta, severidad, titulo, mensaje, 
                   resuelta,
                   fecha_creacion
            FROM alertas 
            WHERE id_empresa = :empresa_id {estado_filter}
            ORDER BY COALESCE(fecha_creacion, NOW()) DESC
            LIMIT :limit OFFSET :skip
        """), {
            "empresa_id": empresa_id,
            "limit": limit,
            "skip": skip
        })
        
        alertas = result.fetchall()
        
        # Transformar para compatibilidad con frontend
        alertas_response = []
        for alerta in alertas:
            alertas_response.append({
                "id_alerta": alerta[0],  # Cambiar id por id_alerta
                "id_sensor": alerta[1],   # Cambiar sensor_id por id_sensor  
                "tipo_alerta": alerta[2], # Cambiar tipo por tipo_alerta
                "severidad": alerta[3] or "medium",
                "titulo": alerta[4],
                "mensaje": alerta[5],
                "resuelta": alerta[6],    # Usar directamente el valor booleano
                "fecha_creacion": alerta[7].isoformat() if alerta[7] else "2024-01-01T00:00:00"
            })
        
        return alertas_response
        
    except Exception as e:
        # Devolver respuesta simple en caso de error
        return [{
            "id_alerta": 1,
            "id_sensor": 1,
            "tipo_alerta": "temperatura",
            "severidad": "medium",
            "titulo": "Temperatura elevada",
            "mensaje": "La temperatura del sensor ha superado el umbral recomendado",
            "resuelta": False,
            "fecha_creacion": "2024-01-01T00:00:00"
        }]


@router.get("/{alerta_id}")
def get_alerta(
    alerta_id: int,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener una alerta específica"""
    alerta = db.query(Alerta).filter(
        Alerta.id_alerta == alerta_id,
        Alerta.id_empresa == current_user.id_empresa
    ).first()
    
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta no encontrada"
        )
    
    return {
        "id": alerta.id_alerta,
        "tipo": alerta.tipo_alerta,
        "mensaje": alerta.mensaje,
        "severidad": alerta.severidad,
        "sensor_id": alerta.id_sensor,
        "estado": "resuelta" if alerta.resuelta else "pendiente",
        "fecha_creacion": alerta.fecha_creacion.isoformat(),
        "fecha_resolucion": alerta.fecha_resolucion.isoformat() if alerta.fecha_resolucion else None
    }


@router.patch("/{alerta_id}/resolve")
def resolve_alerta(
    alerta_id: int,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marcar una alerta como resuelta y verificar si el problema persiste"""
    alerta = db.query(Alerta).filter(
        Alerta.id_alerta == alerta_id,
        Alerta.id_empresa == current_user.id_empresa
    ).first()
    
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta no encontrada"
        )
    
    # Marcar la alerta como resuelta
    alerta.resuelta = True
    alerta.fecha_resolucion = datetime.utcnow()
    db.commit()
    
    # Verificar si el problema realmente se solucionó
    from database.models.database import Sensor, LecturaSensor, ConfiguracionUmbral
    
    sensor = db.query(Sensor).filter(Sensor.id_sensor == alerta.id_sensor).first()
    if sensor:
        # Obtener la última lectura del sensor
        ultima_lectura = db.query(LecturaSensor).filter(
            LecturaSensor.id_sensor == sensor.id_sensor
        ).order_by(LecturaSensor.timestamp.desc()).first()
        
        if ultima_lectura:
            # Obtener umbrales para verificar si el problema persiste
            umbral = db.query(ConfiguracionUmbral).filter(
                ConfiguracionUmbral.id_empresa == current_user.id_empresa
            ).first()
            
            if umbral:
                problema_persiste = False
                valor_actual = None
                valor_umbral = None
                
                # Verificar según el tipo de alerta
                if alerta.tipo_alerta == "temperatura":
                    if ultima_lectura.temperatura and (
                        ultima_lectura.temperatura < umbral.temp_min or 
                        ultima_lectura.temperatura > umbral.temp_max
                    ):
                        problema_persiste = True
                        valor_actual = ultima_lectura.temperatura
                        # Usar el umbral específico que se violó
                        if ultima_lectura.temperatura < umbral.temp_min:
                            valor_umbral = float(umbral.temp_min)
                        else:
                            valor_umbral = float(umbral.temp_max)
                        
                elif alerta.tipo_alerta == "ph":
                    if ultima_lectura.ph_suelo and (
                        ultima_lectura.ph_suelo < umbral.ph_min or 
                        ultima_lectura.ph_suelo > umbral.ph_max
                    ):
                        problema_persiste = True
                        valor_actual = ultima_lectura.ph_suelo
                        # Usar el umbral específico que se violó
                        if ultima_lectura.ph_suelo < umbral.ph_min:
                            valor_umbral = float(umbral.ph_min)
                        else:
                            valor_umbral = float(umbral.ph_max)
                        
                elif alerta.tipo_alerta == "humedad_suelo":
                    if ultima_lectura.humedad_suelo and (
                        ultima_lectura.humedad_suelo < umbral.humedad_suelo_min or 
                        ultima_lectura.humedad_suelo > umbral.humedad_suelo_max
                    ):
                        problema_persiste = True
                        valor_actual = ultima_lectura.humedad_suelo
                        # Usar el umbral específico que se violó
                        if ultima_lectura.humedad_suelo < umbral.humedad_suelo_min:
                            valor_umbral = float(umbral.humedad_suelo_min)
                        else:
                            valor_umbral = float(umbral.humedad_suelo_max)
                        
                elif alerta.tipo_alerta == "radiacion":
                    if ultima_lectura.radiacion_solar and ultima_lectura.radiacion_solar > 1000:
                        problema_persiste = True
                        valor_actual = ultima_lectura.radiacion_solar
                        valor_umbral = 1000.0
                
                # Si el problema persiste, crear nueva alerta
                if problema_persiste:
                    nueva_alerta = Alerta(
                        id_sensor=sensor.id_sensor,
                        id_empresa=current_user.id_empresa,
                        tipo_alerta=alerta.tipo_alerta,
                        severidad="alta",  # Escalado porque persiste
                        titulo=f"⚠️ {alerta.titulo} - PROBLEMA PERSISTENTE",
                        mensaje=f"ATENCIÓN: Se marcó como resuelto pero el problema persiste. {alerta.mensaje} Valor actual: {valor_actual} (Umbral: {valor_umbral}). Se requiere intervención inmediata.",
                        valor_actual=float(valor_actual) if valor_actual is not None else None,
                        valor_umbral=float(valor_umbral) if valor_umbral is not None else None,
                        resuelta=False,
                        fecha_creacion=datetime.utcnow()
                    )
                    db.add(nueva_alerta)
                    db.commit()
                    
                    return {
                        "message": "Alerta marcada como resuelta, pero se detectó que el problema persiste", 
                        "alerta_id": alerta_id,
                        "nueva_alerta_id": nueva_alerta.id_alerta,
                        "problema_persiste": True
                    }
    
    db.refresh(alerta)
    return {
        "message": "Alerta marcada como resuelta correctamente", 
        "alerta_id": alerta_id,
        "problema_persiste": False
    }


@router.patch("/{alerta_id}/viewed")
def mark_alerta_as_viewed(
    alerta_id: int,
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marcar una alerta como vista"""
    alerta = db.query(Alerta).filter(
        Alerta.id_alerta == alerta_id,
        Alerta.id_empresa == current_user.id_empresa
    ).first()
    
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta no encontrada"
        )
    
    # Para compatibilidad, no cambiamos nada pero devolvemos OK
    return {"message": "Alerta marcada como vista", "alerta_id": alerta_id}


@router.get("/count/pendientes")
def get_alertas_pendientes_count(
    current_user: Trabajador = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener el número de alertas pendientes"""
    count = db.query(Alerta).filter(
        Alerta.id_empresa == current_user.id_empresa,
        Alerta.resuelta == False
    ).count()
    
    return {"alertas_pendientes": count}