"""Rutas para gestión de sensores IoT"""

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func

from app.database.connection import get_db
from app.models.database import (
    Sensor, LecturaSensor, Alerta, ConfiguracionUmbral, Cultivo
)
from app.models.schemas import (
    SensorData, SensorCreate, SensorUpdate, SensorResponse,
    LecturaSensorResponse, AlertaResponse, ConfiguracionUmbralCreate,
    ConfiguracionUmbralResponse
)
from app.auth.dependencies import get_current_user


router = APIRouter(prefix="/sensores", tags=["sensores"])


@router.post("/data", status_code=status.HTTP_201_CREATED)
async def recibir_datos_sensor(
    sensor_data: SensorData,
    db: Session = Depends(get_db)
):
    """Recibe datos de sensores IoT - Endpoint público para dispositivos"""
    # Verificar que el sensor existe
    sensor = db.query(Sensor).filter(
        Sensor.sensor_id == sensor_data.sensor_id,
        Sensor.activo == True
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sensor {sensor_data.sensor_id} no encontrado o inactivo"
        )
    
    # Crear nueva lectura con los 5 parámetros específicos
    nueva_lectura = LecturaSensor(
        id_sensor=sensor.id_sensor,
        id_cultivo=sensor.id_cultivo,
        timestamp=datetime.utcnow(),
        temperatura=sensor_data.temperatura,
        humedad_aire=sensor_data.humedad_aire,
        humedad_suelo=sensor_data.humedad_suelo,
        ph_suelo=sensor_data.ph_suelo,
        radiacion_solar=sensor_data.radiacion_solar
    )
    
    db.add(nueva_lectura)
    
    # Actualizar información del sensor
    sensor.ultima_lectura = datetime.utcnow()
    db.commit()
    
    # Verificar umbrales y generar alertas
    await _verificar_umbrales(db, sensor, nueva_lectura)
    
    return {"message": "Datos recibidos correctamente", "sensor": sensor_data.sensor_id}


@router.post("/", response_model=SensorResponse)
async def crear_sensor(
    sensor_data: SensorCreate,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Registrar un nuevo sensor"""
    # Verificar que el cultivo existe y pertenece al usuario
    cultivo = db.query(Cultivo).filter(
        Cultivo.id_cultivo == sensor_data.id_cultivo,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    # Verificar que el sensor_id no existe
    sensor_existente = db.query(Sensor).filter(
        Sensor.sensor_id == sensor_data.sensor_id
    ).first()
    
    if sensor_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El ID de sensor ya existe"
        )
    
    # Crear nuevo sensor
    nuevo_sensor = Sensor(
        sensor_id=sensor_data.sensor_id,
        nombre=sensor_data.nombre,
        tipo=sensor_data.tipo,
        id_cultivo=sensor_data.id_cultivo,
        ubicacion_sensor=sensor_data.ubicacion_sensor,
        coordenadas_lat=sensor_data.coordenadas_lat,
        coordenadas_lng=sensor_data.coordenadas_lng,
        intervalo_lectura=sensor_data.intervalo_lectura,
        fecha_instalacion=datetime.utcnow()
    )
    
    db.add(nuevo_sensor)
    db.commit()
    db.refresh(nuevo_sensor)
    
    return nuevo_sensor


@router.get("/", response_model=List[SensorResponse])
async def obtener_sensores(
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    id_cultivo: Optional[int] = None,
    activo: Optional[bool] = None
):
    """Obtener lista de sensores del usuario"""
    query = db.query(Sensor).join(Cultivo).filter(
        Cultivo.id_usuario == usuario.id_usuario
    )
    
    if id_cultivo:
        query = query.filter(Sensor.id_cultivo == id_cultivo)
    
    if activo is not None:
        query = query.filter(Sensor.activo == activo)
    
    sensores = query.all()
    return sensores


@router.get("/{sensor_id}", response_model=SensorResponse)
async def obtener_sensor(
    sensor_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener detalles de un sensor específico"""
    sensor = db.query(Sensor).join(Cultivo).filter(
        Sensor.id_sensor == sensor_id,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor no encontrado"
        )
    
    return sensor


@router.put("/{sensor_id}", response_model=SensorResponse)
async def actualizar_sensor(
    sensor_id: int,
    sensor_data: SensorUpdate,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Actualizar configuración de sensor"""
    sensor = db.query(Sensor).join(Cultivo).filter(
        Sensor.id_sensor == sensor_id,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor no encontrado"
        )
    
    # Actualizar campos
    for field, value in sensor_data.model_dump(exclude_unset=True).items():
        setattr(sensor, field, value)
    
    db.commit()
    db.refresh(sensor)
    return sensor


@router.delete("/{sensor_id}")
async def eliminar_sensor(
    sensor_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Eliminar sensor (soft delete - marcar como inactivo)"""
    sensor = db.query(Sensor).join(Cultivo).filter(
        Sensor.id_sensor == sensor_id,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not sensor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sensor no encontrado"
        )
    
    sensor.activo = False
    db.commit()
    
    return {"message": "Sensor desactivado correctamente"}


@router.get("/{sensor_id}/lecturas", response_model=List[LecturaSensorResponse])
async def obtener_lecturas_sensor(
    sensor_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    horas: int = Query(24, description="Horas hacia atrás desde ahora"),
    limit: int = Query(100, le=1000, description="Límite de registros")
):
    """Obtener lecturas de un sensor"""
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
    
    # Obtener lecturas
    fecha_desde = datetime.utcnow() - timedelta(hours=horas)
    
    lecturas = db.query(LecturaSensor).filter(
        LecturaSensor.id_sensor == sensor_id,
        LecturaSensor.timestamp >= fecha_desde
    ).order_by(desc(LecturaSensor.timestamp)).limit(limit).all()
    
    return lecturas


@router.get("/{sensor_id}/alertas", response_model=List[AlertaResponse])
async def obtener_alertas_sensor(
    sensor_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
    resuelta: Optional[bool] = None,
    dias: int = Query(7, description="Días hacia atrás desde ahora")
):
    """Obtener alertas de un sensor"""
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
    
    # Obtener alertas
    fecha_desde = datetime.utcnow() - timedelta(days=dias)
    
    query = db.query(Alerta).filter(
        Alerta.id_sensor == sensor_id,
        Alerta.fecha_creacion >= fecha_desde
    )
    
    if resuelta is not None:
        query = query.filter(Alerta.resuelta == resuelta)
    
    alertas = query.order_by(desc(Alerta.fecha_creacion)).all()
    return alertas


@router.put("/alertas/{alerta_id}/resolver")
async def resolver_alerta(
    alerta_id: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marcar alerta como resuelta"""
    alerta = db.query(Alerta).join(Sensor).join(Cultivo).filter(
        Alerta.id_alerta == alerta_id,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not alerta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alerta no encontrada"
        )
    
    alerta.resuelta = True
    db.commit()
    
    return {"message": "Alerta marcada como resuelta"}


@router.post("/configuracion-umbrales", response_model=ConfiguracionUmbralResponse)
async def crear_configuracion_umbrales(
    config_data: ConfiguracionUmbralCreate,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Crear configuración de umbrales para un cultivo"""
    # Verificar acceso al cultivo
    cultivo = db.query(Cultivo).filter(
        Cultivo.id_cultivo == config_data.id_cultivo,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    # Verificar si ya existe configuración
    config_existente = db.query(ConfiguracionUmbral).filter(
        ConfiguracionUmbral.id_cultivo == config_data.id_cultivo,
        ConfiguracionUmbral.activo == True
    ).first()
    
    if config_existente:
        # Desactivar la anterior
        config_existente.activo = False
    
    # Crear nueva configuración
    nueva_config = ConfiguracionUmbral(**config_data.model_dump())
    
    db.add(nueva_config)
    db.commit()
    db.refresh(nueva_config)
    
    return nueva_config


@router.get("/configuracion-umbrales/{id_cultivo}", response_model=ConfiguracionUmbralResponse)
async def obtener_configuracion_umbrales(
    id_cultivo: int,
    usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Obtener configuración de umbrales de un cultivo"""
    # Verificar acceso al cultivo
    cultivo = db.query(Cultivo).filter(
        Cultivo.id_cultivo == id_cultivo,
        Cultivo.id_usuario == usuario.id_usuario
    ).first()
    
    if not cultivo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cultivo no encontrado"
        )
    
    config = db.query(ConfiguracionUmbral).filter(
        ConfiguracionUmbral.id_cultivo == id_cultivo,
        ConfiguracionUmbral.activo == True
    ).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Configuración de umbrales no encontrada"
        )
    
    return config


async def _verificar_umbrales(db: Session, sensor: Sensor, lectura: LecturaSensor):
    """Verificar umbrales y generar alertas automáticamente"""
    # Obtener configuración de umbrales del cultivo
    config = db.query(ConfiguracionUmbral).filter(
        ConfiguracionUmbral.id_cultivo == sensor.id_cultivo,
        ConfiguracionUmbral.activo == True
    ).first()
    
    if not config:
        return
    
    alertas_a_crear = []
    
    # Verificar temperatura
    if lectura.temperatura is not None:
        if lectura.temperatura < config.temp_min:
            alertas_a_crear.append({
                "tipo": "temperatura_baja",
                "severidad": "media",
                "titulo": "Temperatura Baja",
                "mensaje": f"Temperatura {lectura.temperatura}°C por debajo del mínimo ({config.temp_min}°C)",
                "valor_actual": lectura.temperatura,
                "valor_umbral": config.temp_min
            })
        elif lectura.temperatura > config.temp_max:
            alertas_a_crear.append({
                "tipo": "temperatura_alta",
                "severidad": "media",
                "titulo": "Temperatura Alta",
                "mensaje": f"Temperatura {lectura.temperatura}°C por encima del máximo ({config.temp_max}°C)",
                "valor_actual": lectura.temperatura,
                "valor_umbral": config.temp_max
            })
    
    # Verificar humedad del aire
    if lectura.humedad_aire is not None:
        if lectura.humedad_aire < config.humedad_aire_min:
            alertas_a_crear.append({
                "tipo": "humedad_aire_baja",
                "severidad": "media",
                "titulo": "Humedad del Aire Baja",
                "mensaje": f"Humedad del aire {lectura.humedad_aire}% por debajo del mínimo ({config.humedad_aire_min}%)",
                "valor_actual": lectura.humedad_aire,
                "valor_umbral": config.humedad_aire_min
            })
    
    # Verificar humedad del suelo
    if lectura.humedad_suelo is not None:
        if lectura.humedad_suelo < config.humedad_suelo_min:
            alertas_a_crear.append({
                "tipo": "humedad_suelo_baja",
                "severidad": "alta",
                "titulo": "Humedad del Suelo Baja",
                "mensaje": f"Humedad del suelo {lectura.humedad_suelo}% por debajo del mínimo ({config.humedad_suelo_min}%)",
                "valor_actual": lectura.humedad_suelo,
                "valor_umbral": config.humedad_suelo_min
            })
    
    # Verificar pH
    if lectura.ph_suelo is not None:
        if lectura.ph_suelo < config.ph_min or lectura.ph_suelo > config.ph_max:
            alertas_a_crear.append({
                "tipo": "ph_fuera_rango",
                "severidad": "media",
                "titulo": "pH Fuera de Rango",
                "mensaje": f"pH del suelo {lectura.ph_suelo} fuera del rango óptimo ({config.ph_min}-{config.ph_max})",
                "valor_actual": lectura.ph_suelo,
                "valor_umbral": config.ph_min if lectura.ph_suelo < config.ph_min else config.ph_max
            })
    
    # Verificar radiación solar
    if lectura.radiacion_solar is not None:
        if lectura.radiacion_solar < config.radiacion_min:
            alertas_a_crear.append({
                "tipo": "radiacion_baja",
                "severidad": "media",
                "titulo": "Radiación Solar Baja",
                "mensaje": f"Radiación solar {lectura.radiacion_solar} W/m² por debajo del mínimo ({config.radiacion_min} W/m²)",
                "valor_actual": lectura.radiacion_solar,
                "valor_umbral": config.radiacion_min
            })
        elif lectura.radiacion_solar > config.radiacion_max:
            alertas_a_crear.append({
                "tipo": "radiacion_alta",
                "severidad": "media",
                "titulo": "Radiación Solar Alta",
                "mensaje": f"Radiación solar {lectura.radiacion_solar} W/m² por encima del máximo ({config.radiacion_max} W/m²)",
                "valor_actual": lectura.radiacion_solar,
                "valor_umbral": config.radiacion_max
            })
    
    # Crear alertas
    for alerta_data in alertas_a_crear:
        nueva_alerta = Alerta(
            id_sensor=sensor.id_sensor,
            tipo_alerta=alerta_data["tipo"],
            severidad=alerta_data["severidad"],
            titulo=alerta_data["titulo"],
            mensaje=alerta_data["mensaje"],
            valor_actual=alerta_data.get("valor_actual"),
            valor_umbral=alerta_data.get("valor_umbral")
        )
        db.add(nueva_alerta)
    
    if alertas_a_crear:
        db.commit()