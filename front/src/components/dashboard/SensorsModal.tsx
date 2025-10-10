'use client'

import { useEffect } from 'react'
import { Thermometer, Droplets, X } from 'lucide-react'
import { useSensorReadings } from '@/lib/hooks/useSensorReadings'

interface SensorsModalProps {
  areaId: string
  areaName: string
  isOpen: boolean
  onClose: () => void
}

export function SensorsModal({ areaId, areaName, isOpen, onClose }: SensorsModalProps) {
  const { readings, loading, error } = useSensorReadings(areaId)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Sensores del Área: {areaName}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Mostrando datos en tiempo real. Actualización cada 10 segundos.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Cargando sensores...</p>
            </div>
          )}
          
          {error && (
            <div className="p-4 text-red-500 text-center">
              Error al cargar los sensores: {error.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readings.map((sensor) => (
              <div 
                key={sensor.id_sensor}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 shadow"
              >
                <h3 className="font-semibold mb-3">{sensor.nombre}</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Temperatura:
                    </span>
                    <span className="font-medium">
                      {sensor.temperatura.toFixed(1)}°C
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Humedad:
                    </span>
                    <span className="font-medium">
                      {sensor.humedad_aire.toFixed(1)}%
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mt-2">
                    Última actualización: {new Date(sensor.timestamp_lectura).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {!loading && readings.length === 0 && (
              <div className="col-span-2 text-center text-gray-500 p-4">
                No hay sensores registrados en esta área
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}