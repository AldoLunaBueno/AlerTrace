'use client'

import { useEffect, useState } from 'react'
import { Activity, MapPin, Battery, Clock } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import type { SensorResponse } from '@/types'

export function SensoresStatus() {
  const [sensores, setSensores] = useState<SensorResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadSensores()
  }, [])

  const loadSensores = async () => {
    try {
      setIsLoading(true)
      const data = await mockApi.getSensores()
      setSensores(data)
    } catch (error) {
      console.error('Error loading sensores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getBatteryColor = (nivel: number) => {
    if (nivel > 75) return 'text-green-600 dark:text-green-400'
    if (nivel > 50) return 'text-yellow-600 dark:text-yellow-400'
    if (nivel > 25) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getBatteryIcon = (nivel: number) => {
    if (nivel > 75) return '🔋'
    if (nivel > 50) return '🔋'
    if (nivel > 25) return '🪫'
    return '🪫'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Estado de Sensores
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {sensores.length} sensores registrados
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : sensores.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay sensores registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Sensor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Batería
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Última Lectura
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {sensores.map((sensor) => (
                  <tr key={sensor.id_sensor} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sensor.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {sensor.device_id} • {sensor.tipo}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-1" />
                        {sensor.ubicacion_sensor || 'No especificada'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.activo ? 'ACTIVO' : 'INACTIVO')}`}>
                        {sensor.activo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sensor.bateria_nivel ? (
                        <div className="flex items-center text-sm">
                          <span className="mr-2">{getBatteryIcon(sensor.bateria_nivel)}</span>
                          <span className={getBatteryColor(sensor.bateria_nivel)}>
                            {sensor.bateria_nivel}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {sensor.ultima_lectura ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDateTime(sensor.ultima_lectura)}
                        </div>
                      ) : (
                        <span className="text-gray-400">Sin datos</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
