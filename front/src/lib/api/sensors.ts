import { api } from '../api'

export interface SensorReading {
  id_sensor: number
  device_id: string
  nombre: string
  tipo: string
  temperatura: number
  humedad_aire: number
  timestamp_lectura: string
  ubicacion_sensor: string
}

export const sensorsApi = {
  getLatestReadings: () => api.sensors.getLatestReadings()
}