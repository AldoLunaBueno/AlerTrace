"""Servicio de gestión de sensores IoT"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import and_, desc, func, or_
from tuya_connector import TuyaOpenAPI
import os
from decimal import Decimal
import asyncio

from database.models.database import (
    Sensor, LecturaSensor, Alerta, ConfiguracionUmbral, Trabajador, Empresa
)


class SensorService:
    """Operaciones y análisis de sensores IoT"""
    
    def __init__(self):
        self.api_endpoint = os.getenv("TUYA_API_ENDPOINT", "https://openapi.tuyaus.com")
        self.access_id = os.getenv("TUYA_ACCESS_ID")
        self.access_key = os.getenv("TUYA_ACCESS_KEY")
        self.openapi = TuyaOpenAPI(self.api_endpoint, self.access_id, self.access_key)
        self.openapi.connect()
    
    async def poll_sensor(self, db: Session, sensor: Sensor) -> Optional[LecturaSensor]:
        """Consultar un sensor individual y almacenar su lectura en la base de datos"""
        try:
            response = self.openapi.get(f"/v1.0/devices/{sensor.device_id}/status")
            if response.get("success"):
                data = {item["code"]: item["value"] for item in response["result"]}
                
                # Crear nueva lectura de sensor
                lectura = LecturaSensor(
                    id_sensor=sensor.id_sensor,
                    temperatura=Decimal(str(data.get('temp_current', 0) / 10)),  # Convertir a Celsius
                    humedad_aire=Decimal(str(data.get('humidity_value', 0))),  # Porcentaje directo
                    humedad_suelo=Decimal('0'),  # No disponible en sensor actual
                    ph_suelo=Decimal('0'),  # No disponible en sensor actual
                    radiacion_solar=Decimal('0')  # No disponible en sensor actual
                )
                
                # Actualizar timestamp de última lectura del sensor
                sensor.ultima_lectura = datetime.utcnow()
                
                db.add(lectura)
                db.commit()
                return lectura
            else:
                print(f"Error consultando sensor {sensor.device_id}: {response}")
                return None
        except Exception as e:
            print(f"Excepción consultando sensor {sensor.device_id}: {str(e)}")
            return None

    async def poll_all_sensors(self, db: Session) -> None:
        """Consultar todos los sensores activos en la base de datos"""
        try:
            sensores = db.query(Sensor).filter(Sensor.activo == True).all()
            for sensor in sensores:
                await self.poll_sensor(db, sensor)
        except Exception as e:
            print(f"Error polling sensors: {str(e)}")
    
    
    @staticmethod
    def get_stats(db: Session, user_id: int) -> Dict[str, Any]:
        """Obtener estadísticas de sensores del usuario"""
        total_sensors = db.query(Sensor).join(Cultivo).filter(
            Cultivo.id_usuario == user_id
        ).count()
        
        active_sensors = db.query(Sensor).join(Cultivo).filter(
            Cultivo.id_usuario == user_id,
            Sensor.activo == True
        ).count()
        
        # Sensores desconectados (sin lectura en las últimas 2 horas)
        two_hours_ago = datetime.utcnow() - timedelta(hours=2)
        offline_sensors = db.query(Sensor).join(Cultivo).filter(
            Cultivo.id_usuario == user_id,
            Sensor.activo == True,
            or_(
                Sensor.ultima_lectura < two_hours_ago,
                Sensor.ultima_lectura.is_(None)
            )
        ).count()
        
        active_alerts = db.query(Alerta).join(Sensor).join(Cultivo).filter(
            Cultivo.id_usuario == user_id,
            Alerta.resuelta == False
        ).count()
        
        today = datetime.utcnow().date()
        today_readings = db.query(LecturaSensor).join(Sensor).join(Cultivo).filter(
            Cultivo.id_usuario == user_id,
            func.date(LecturaSensor.timestamp) == today
        ).count()
        
        return {
            "total_sensores": total_sensors,
            "sensores_activos": active_sensors,
            "sensores_inactivos": total_sensors - active_sensors,
            "sensores_offline": offline_sensors,
            "alertas_activas": active_alerts,
            "lecturas_hoy": today_readings
        }
    
    @staticmethod
    def get_dashboard_data(
        db: Session, 
        user_id: int, 
        hours: int = 24
    ) -> Dict[str, Any]:
        """Obtener datos del dashboard de sensores"""
        fecha_desde = datetime.utcnow() - timedelta(hours=hours)
        
        sensores = db.query(Sensor).join(Cultivo).filter(
            Cultivo.id_usuario == user_id,
            Sensor.activo == True
        ).all()
        
        datos_sensores = []
        
        for sensor in sensores:
            # Última lectura
            ultima_lectura = db.query(LecturaSensor).filter(
                LecturaSensor.id_sensor == sensor.id_sensor
            ).order_by(desc(LecturaSensor.timestamp)).first()
            
            # Promedio de las últimas horas
            promedios = db.query(
                func.avg(LecturaSensor.temperatura).label("temp_promedio"),
                func.avg(LecturaSensor.humedad_aire).label("humedad_aire_promedio"),
                func.avg(LecturaSensor.humedad_suelo).label("humedad_suelo_promedio"),
                func.avg(LecturaSensor.ph_suelo).label("ph_promedio"),
                func.avg(LecturaSensor.radiacion_solar).label("radiacion_promedio")
            ).filter(
                LecturaSensor.id_sensor == sensor.id_sensor,
                LecturaSensor.timestamp >= fecha_desde
            ).first()
            
            # Alertas pendientes
            alertas_pendientes = db.query(Alerta).filter(
                Alerta.id_sensor == sensor.id_sensor,
                Alerta.resuelta == False
            ).count()
            
            # Estado del sensor
            estado = "offline"
            if sensor.ultima_lectura:
                hace_1_hora = datetime.utcnow() - timedelta(hours=1)
                if sensor.ultima_lectura > hace_1_hora:
                    estado = "online"
                elif sensor.ultima_lectura > datetime.utcnow() - timedelta(hours=6):
                    estado = "intermitente"
            
            datos_sensores.append({
                "sensor": {
                    "id_sensor": sensor.id_sensor,
                    "device_id": sensor.device_id,
                    "nombre": sensor.nombre,
                    "tipo": sensor.tipo,
                    "ubicacion": sensor.ubicacion_sensor,
                    "estado": estado
                },
                "ultima_lectura": {
                    "timestamp": ultima_lectura.timestamp if ultima_lectura else None,
                    "temperatura": ultima_lectura.temperatura if ultima_lectura else None,
                    "humedad_aire": ultima_lectura.humedad_aire if ultima_lectura else None,
                    "humedad_suelo": ultima_lectura.humedad_suelo if ultima_lectura else None,
                    "ph_suelo": ultima_lectura.ph_suelo if ultima_lectura else None,
                    "radiacion_solar": ultima_lectura.radiacion_solar if ultima_lectura else None
                },
                "promedios_periodo": {
                    "temperatura": float(promedios.temp_promedio) if promedios.temp_promedio else None,
                    "humedad_aire": float(promedios.humedad_aire_promedio) if promedios.humedad_aire_promedio else None,
                    "humedad_suelo": float(promedios.humedad_suelo_promedio) if promedios.humedad_suelo_promedio else None,
                    "ph_suelo": float(promedios.ph_promedio) if promedios.ph_promedio else None,
                    "radiacion_solar": float(promedios.radiacion_promedio) if promedios.radiacion_promedio else None
                },
                "alertas_pendientes": alertas_pendientes
            })
        
        return {
            "sensores": datos_sensores,
            "resumen": SensorService.get_stats(db, user_id)
        }
    
    @staticmethod
    def obtener_historico_sensor(
        db: Session,
        id_sensor: int,
        horas: int = 24,
        intervalo_minutos: int = 60
    ) -> Dict[str, Any]:
        """Obtener datos históricos de un sensor con agregación por intervalos"""
        fecha_desde = datetime.utcnow() - timedelta(hours=horas)
        
        # Obtener lecturas agrupadas por intervalos
        intervalo_segundos = intervalo_minutos * 60
        
        # Query para agrupar por intervalos de tiempo
        lecturas = db.query(
            func.date_trunc('hour', LecturaSensor.timestamp).label('periodo'),
            func.avg(LecturaSensor.temperatura).label('temp_promedio'),
            func.min(LecturaSensor.temperatura).label('temp_minima'),
            func.max(LecturaSensor.temperatura).label('temp_maxima'),
            func.avg(LecturaSensor.humedad_aire).label('humedad_aire_promedio'),
            func.avg(LecturaSensor.humedad_suelo).label('humedad_suelo_promedio'),
            func.avg(LecturaSensor.ph_suelo).label('ph_promedio'),
            func.avg(LecturaSensor.radiacion_solar).label('radiacion_solar_promedio'),
            func.count(LecturaSensor.id_lectura).label('total_lecturas')
        ).filter(
            LecturaSensor.id_sensor == id_sensor,
            LecturaSensor.timestamp >= fecha_desde
        ).group_by(
            func.date_trunc('hour', LecturaSensor.timestamp)
        ).order_by('periodo').all()
        
        # Formatear datos para gráficos
        datos_formateados = []
        for lectura in lecturas:
            datos_formateados.append({
                "timestamp": lectura.periodo.isoformat(),
                "temperatura": {
                    "promedio": float(lectura.temp_promedio) if lectura.temp_promedio else None,
                    "minima": float(lectura.temp_minima) if lectura.temp_minima else None,
                    "maxima": float(lectura.temp_maxima) if lectura.temp_maxima else None
                },
                "humedad_aire": float(lectura.humedad_aire_promedio) if lectura.humedad_aire_promedio else None,
                "humedad_suelo": float(lectura.humedad_suelo_promedio) if lectura.humedad_suelo_promedio else None,
                "ph_suelo": float(lectura.ph_promedio) if lectura.ph_promedio else None,
                "radiacion_solar": float(lectura.radiacion_solar_promedio) if lectura.radiacion_solar_promedio else None,
                "total_lecturas": lectura.total_lecturas
            })
        
        return {
            "id_sensor": id_sensor,
            "periodo": f"Últimas {horas} horas",
            "intervalo": f"{intervalo_minutos} minutos",
            "datos": datos_formateados,
            "total_puntos": len(datos_formateados)
        }
    
    @staticmethod
    def generar_reporte_sensor(
        db: Session,
        id_sensor: int,
        dias: int = 7
    ) -> Dict[str, Any]:
        """Generar reporte completo de un sensor"""
        fecha_desde = datetime.utcnow() - timedelta(days=dias)
        
        # Información del sensor
        sensor = db.query(Sensor).filter(Sensor.id_sensor == id_sensor).first()
        if not sensor:
            return {"error": "Sensor no encontrado"}
        
        # Estadísticas del período
        estadisticas = db.query(
            func.count(LecturaSensor.id_lectura).label('total_lecturas'),
            func.avg(LecturaSensor.temperatura).label('temp_promedio'),
            func.min(LecturaSensor.temperatura).label('temp_minima'),
            func.max(LecturaSensor.temperatura).label('temp_maxima'),
            func.avg(LecturaSensor.humedad_aire).label('humedad_aire_promedio'),
            func.avg(LecturaSensor.humedad_suelo).label('humedad_suelo_promedio'),
            func.avg(LecturaSensor.ph_suelo).label('ph_promedio'),
            func.avg(LecturaSensor.calidad_senal).label('calidad_senal_promedio')
        ).filter(
            LecturaSensor.id_sensor == id_sensor,
            LecturaSensor.timestamp >= fecha_desde
        ).first()
        
        # Alertas del período
        alertas = db.query(Alerta).filter(
            Alerta.id_sensor == id_sensor,
            Alerta.fecha_creacion >= fecha_desde
        ).order_by(desc(Alerta.fecha_creacion)).all()
        
        # Disponibilidad del sensor (% de tiempo online)
        intervalos_esperados = (dias * 24 * 60) // sensor.intervalo_lectura * 60  # Lecturas esperadas
        disponibilidad = (estadisticas.total_lecturas / intervalos_esperados * 100) if intervalos_esperados > 0 else 0
        
        return {
            "sensor": {
                "id_sensor": sensor.id_sensor,
                "device_id": sensor.device_id,
                "nombre": sensor.nombre,
                "tipo": sensor.tipo,
                "ubicacion": sensor.ubicacion_sensor,
                "fecha_instalacion": sensor.fecha_instalacion.isoformat(),
                "intervalo_lectura": sensor.intervalo_lectura
            },
            "periodo": {
                "inicio": fecha_desde.isoformat(),
                "fin": datetime.utcnow().isoformat(),
                "dias": dias
            },
            "estadisticas": {
                "total_lecturas": estadisticas.total_lecturas,
                "disponibilidad_porcentaje": round(disponibilidad, 2),
                "temperatura": {
                    "promedio": float(estadisticas.temp_promedio) if estadisticas.temp_promedio else None,
                    "minima": float(estadisticas.temp_minima) if estadisticas.temp_minima else None,
                    "maxima": float(estadisticas.temp_maxima) if estadisticas.temp_maxima else None
                },
                "humedad_aire_promedio": float(estadisticas.humedad_aire_promedio) if estadisticas.humedad_aire_promedio else None,
                "humedad_suelo_promedio": float(estadisticas.humedad_suelo_promedio) if estadisticas.humedad_suelo_promedio else None,
                "ph_promedio": float(estadisticas.ph_promedio) if estadisticas.ph_promedio else None,
                "calidad_senal_promedio": float(estadisticas.calidad_senal_promedio) if estadisticas.calidad_senal_promedio else None
            },
            "alertas": {
                "total": len(alertas),
                "resueltas": len([a for a in alertas if a.resuelta]),
                "pendientes": len([a for a in alertas if not a.resuelta]),
                "por_severidad": {
                    "alta": len([a for a in alertas if a.severidad == "alta"]),
                    "media": len([a for a in alertas if a.severidad == "media"]),
                    "baja": len([a for a in alertas if a.severidad == "baja"])
                },
                "detalle": [
                    {
                        "id_alerta": alerta.id_alerta,
                        "tipo": alerta.tipo_alerta,
                        "severidad": alerta.severidad,
                        "titulo": alerta.titulo,
                        "mensaje": alerta.mensaje,
                        "resuelta": alerta.resuelta,
                        "fecha": alerta.fecha_creacion.isoformat()
                    } for alerta in alertas[:10]  # Últimas 10 alertas
                ]
            }
        }
    
    @staticmethod
    def validar_conectividad_sensor(db: Session, device_id: str) -> Dict[str, Any]:
        """Validar estado de conectividad de un sensor"""
        sensor = db.query(Sensor).filter(
            Sensor.device_id == device_id,
            Sensor.activo == True
        ).first()
        
        if not sensor:
            return {
                "device_id": device_id,
                "estado": "no_encontrado",
                "mensaje": "Sensor no encontrado o inactivo"
            }
        
        # Última lectura
        ultima_lectura = db.query(LecturaSensor).filter(
            LecturaSensor.id_sensor == sensor.id_sensor
        ).order_by(desc(LecturaSensor.timestamp)).first()
        
        if not ultima_lectura:
            return {
                "device_id": device_id,
                "estado": "sin_datos",
                "mensaje": "Sensor sin lecturas registradas",
                "sensor": {
                    "nombre": sensor.nombre,
                    "fecha_instalacion": sensor.fecha_instalacion.isoformat()
                }
            }
        
        # Calcular estado basado en última lectura
        ahora = datetime.utcnow()
        tiempo_sin_datos = ahora - ultima_lectura.timestamp
        intervalo_esperado = timedelta(seconds=sensor.intervalo_lectura)
        
        if tiempo_sin_datos <= intervalo_esperado * 2:
            estado = "online"
            mensaje = "Sensor operando normalmente"
        elif tiempo_sin_datos <= timedelta(hours=1):
            estado = "intermitente"
            mensaje = f"Última lectura hace {tiempo_sin_datos.seconds // 60} minutos"
        else:
            estado = "offline"
            horas_offline = tiempo_sin_datos.total_seconds() // 3600
            mensaje = f"Offline desde hace {int(horas_offline)} horas"
        
        return {
            "device_id": device_id,
            "estado": estado,
            "mensaje": mensaje,
            "sensor": {
                "nombre": sensor.nombre,
                "tipo": sensor.tipo,
                "ubicacion": sensor.ubicacion_sensor,
                "bateria_nivel": sensor.bateria_nivel,
                "calidad_senal": ultima_lectura.calidad_senal
            },
            "ultima_lectura": {
                "timestamp": ultima_lectura.timestamp.isoformat(),
                "hace_minutos": int(tiempo_sin_datos.total_seconds() // 60)
            }
        }