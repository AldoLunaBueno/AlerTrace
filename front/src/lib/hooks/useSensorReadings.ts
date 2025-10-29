import { useState, useEffect } from 'react'
import { SensorReading, sensorsApi } from '../api/sensors'

export function useSensorReadings(areaId?: string) {
  const [readings, setReadings] = useState<SensorReading[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        const data = await sensorsApi.getLatestReadings() as any
        // Si hay areaId, filtramos los sensores de esa área
        const filteredData = areaId 
          ? data.filter((sensor: any) => sensor.ubicacion_sensor === areaId)
          : data
        setReadings(filteredData)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchReadings()
    const interval = setInterval(fetchReadings, 10000) // Actualizar cada 10 segundos
    
    return () => clearInterval(interval)
  }, [areaId])

  return { readings, loading, error }
}