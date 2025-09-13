"""
Servicio para manejar datos de sensores en Amazon Timestream
"""

import boto3
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json
import logging
from ..config import settings

logger = logging.getLogger(__name__)

class TimestreamService:
    def __init__(self):
        self.write_client = boto3.client(
            'timestream-write', 
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )
        self.query_client = boto3.client(
            'timestream-query',
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key
        )
        self.database = settings.timestream_database
        self.table = settings.timestream_table
    
    def write_sensor_data(self, sensor_data: Dict) -> bool:
        """
        Escribir datos de sensores a Timestream
        
        sensor_data = {
            'sensor_id': 'SENSOR_001',
            'timestamp': '2025-09-01T10:00:00Z',
            'measurements': {
                'temperatura': 25.5,
                'humedad': 65.2,
                'ph_suelo': 6.8,
                'luminosidad': 850.0
            },
            'location': {
                'lat': -6.4775,
                'lng': -76.3625
            }
        }
        """
        try:
            records = []
            
            # Preparar dimensiones comunes
            common_dimensions = [
                {
                    'Name': 'SensorId',
                    'Value': sensor_data['sensor_id']
                }
            ]
            
            # Agregar ubicación si está disponible
            if 'location' in sensor_data:
                common_dimensions.extend([
                    {
                        'Name': 'Latitude',
                        'Value': str(sensor_data['location']['lat'])
                    },
                    {
                        'Name': 'Longitude', 
                        'Value': str(sensor_data['location']['lng'])
                    }
                ])
            
            # Crear un record para cada medición
            for measurement_type, value in sensor_data['measurements'].items():
                record = {
                    'Time': sensor_data.get('timestamp', str(int(datetime.now().timestamp() * 1000))),
                    'TimeUnit': 'MILLISECONDS',
                    'Dimensions': common_dimensions + [
                        {
                            'Name': 'MeasurementType',
                            'Value': measurement_type
                        }
                    ],
                    'MeasureName': 'sensor_reading',
                    'MeasureValue': str(value),
                    'MeasureValueType': 'DOUBLE'
                }
                records.append(record)
            
            # Escribir a Timestream
            response = self.write_client.write_records(
                DatabaseName=self.database,
                TableName=self.table,
                Records=records
            )
            
            return True
            
        except Exception as e:
            logger.error(f"Error escribiendo a Timestream: {str(e)}")
            return False
    
    def get_sensor_data(self, sensor_id: str, hours_back: int = 24) -> List[Dict]:
        """
        Obtener datos históricos de un sensor
        """
        try:
            end_time = datetime.now()
            start_time = end_time - timedelta(hours=hours_back)
            
            query = f"""
            SELECT 
                time,
                measure_value::double as value,
                SensorId,
                MeasurementType,
                Latitude,
                Longitude
            FROM "{self.database}"."{self.table}"
            WHERE SensorId = '{sensor_id}'
            AND time BETWEEN '{start_time.isoformat()}' AND '{end_time.isoformat()}'
            ORDER BY time DESC
            LIMIT 1000
            """
            
            response = self.query_client.query(QueryString=query)
            return self._parse_timestream_response(response)
            
        except Exception as e:
            logger.error(f"Error consultando Timestream: {str(e)}")
            return []
    
    def get_latest_sensor_data(self, sensor_id: str) -> Optional[Dict]:
        """
        Obtener la última lectura de un sensor
        """
        try:
            query = f"""
            SELECT 
                time,
                measure_value::double as value,
                SensorId,
                MeasurementType
            FROM "{self.database}"."{self.table}"
            WHERE SensorId = '{sensor_id}'
            ORDER BY time DESC
            LIMIT 10
            """
            
            response = self.query_client.query(QueryString=query)
            data = self._parse_timestream_response(response)
            
            if not data:
                return None
            
            # Agrupar por timestamp para obtener todas las mediciones del último momento
            latest_time = data[0]['time']
            latest_readings = {}
            
            for record in data:
                if record['time'] == latest_time:
                    latest_readings[record['MeasurementType']] = record['value']
            
            return {
                'sensor_id': sensor_id,
                'timestamp': latest_time,
                'measurements': latest_readings
            }
            
        except Exception as e:
            logger.error(f"Error obteniendo última lectura: {str(e)}")
            return None
    
    def get_all_sensors_summary(self) -> List[Dict]:
        """
        Obtener resumen de todos los sensores activos
        """
        try:
            query = f"""
            SELECT 
                SensorId,
                max(time) as last_reading,
                count(*) as total_readings
            FROM "{self.database}"."{self.table}"
            WHERE time > ago(7d)
            GROUP BY SensorId
            ORDER BY last_reading DESC
            """
            
            response = self.query_client.query(QueryString=query)
            return self._parse_timestream_response(response)
            
        except Exception as e:
            logger.error(f"Error obteniendo resumen de sensores: {str(e)}")
            return []
    
    def _parse_timestream_response(self, response) -> List[Dict]:
        """
        Convertir respuesta de Timestream a formato JSON
        """
        records = []
        for row in response['Rows']:
            record = {}
            for i, col in enumerate(response['ColumnInfo']):
                record[col['Name']] = row['Data'][i].get('ScalarValue', '')
            records.append(record)
        return records
