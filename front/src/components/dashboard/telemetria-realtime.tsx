'use client'

import { useEffect, useState } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import type { TelemetriaData } from '@/types'

export function TelemetriaRealtime() {
  const [telemetria, setTelemetria] = useState<TelemetriaData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const loadTelemetria = async () => {
    try {
      setIsLoading(true)
      const data = await mockApi.getTelemetria()
      setTelemetria(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error loading telemetria:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTelemetria()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadTelemetria, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getVariableIcon = (variable: string) => {
    switch (variable.toLowerCase()) {
      case 'temperatura':
        return '🌡️'
      case 'humedad_aire':
        return '💨'
      case 'humedad_suelo':
        return '💧'
      case 'ph_suelo':
        return '🧪'
      case 'radiacion_solar':
        return '☀️'
      default:
        return '📊'
    }
  }

  const getVariableColor = (variable: string) => {
    switch (variable.toLowerCase()) {
      case 'temperatura':
        return 'text-red-600 dark:text-red-400'
      case 'humedad_aire':
        return 'text-blue-600 dark:text-blue-400'
      case 'humedad_suelo':
        return 'text-cyan-600 dark:text-cyan-400'
      case 'ph_suelo':
        return 'text-green-600 dark:text-green-400'
      case 'radiacion_solar':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-sacha-100 dark:bg-sacha-900/20 p-2 rounded-lg">
              <Activity className="h-5 w-5 text-sacha-600 dark:text-sacha-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Telemetría en Tiempo Real
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Última actualización: {lastUpdate.toLocaleTimeString('es-ES')}
              </p>
            </div>
          </div>
          <button
            onClick={loadTelemetria}
            disabled={isLoading}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : telemetria.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay datos de telemetría disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {telemetria.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">
                      {getVariableIcon(item.variable)}
                    </span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {item.variable.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Sensor #{item.sensorId}
                  </span>
                </div>
                
                <div className="flex items-baseline">
                  <span className={`text-2xl font-bold ${getVariableColor(item.variable)}`}>
                    {item.valor}
                  </span>
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.unidad}
                  </span>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {new Date(item.timestamp).toLocaleString('es-ES')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
