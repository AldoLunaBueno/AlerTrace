'use client'

import { useEffect, useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import type { SensorResponse, CultivoResponse } from '@/types'

export default function MapaPage() {
  const [sensores, setSensores] = useState<SensorResponse[]>([])
  const [cultivos, setCultivos] = useState<CultivoResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<'all' | 'sensores' | 'cultivos'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [sensoresData, cultivosData] = await Promise.all([
        mockApi.getSensores(),
        mockApi.getCultivos()
      ])
      setSensores(sensoresData)
      setCultivos(cultivosData)
    } catch (error) {
      console.error('Error loading map data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getMapCenter = () => {
    const allCoords = [
      ...sensores.filter(s => s.coordenadas_lat && s.coordenadas_lng).map(s => ({ lat: s.coordenadas_lat!, lng: s.coordenadas_lng! })),
      ...cultivos.filter(c => c.coordenadas_lat && c.coordenadas_lng).map(c => ({ lat: c.coordenadas_lat!, lng: c.coordenadas_lng! }))
    ]
    
    if (allCoords.length === 0) {
      return { lat: -12.0464, lng: -77.0428 } // Lima, Perú por defecto
    }
    
    const avgLat = allCoords.reduce((sum, coord) => sum + coord.lat, 0) / allCoords.length
    const avgLng = allCoords.reduce((sum, coord) => sum + coord.lng, 0) / allCoords.length
    
    return { lat: avgLat, lng: avgLng }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
      case 'active':
        return '#22c55e'
      case 'inactivo':
      case 'inactive':
        return '#ef4444'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Mapa de Ubicaciones
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Visualiza la ubicación de tus sensores y cultivos en el mapa
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Navigation className="h-5 w-5 text-gray-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="sensores">Solo Sensores</option>
              <option value="cultivos">Solo Cultivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Controles del mapa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Sensores Activos ({sensores.filter(s => s.activo).length})
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Sensores Inactivos ({sensores.filter(s => !s.activo).length})
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Cultivos Activos ({cultivos.filter(c => c.estado === 'ACTIVO').length})
            </span>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="h-96 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Mapa Interactivo
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Aquí se mostraría el mapa con Leaflet cuando esté configurado
              </p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p>Sensores con coordenadas: {sensores.filter(s => s.coordenadas_lat && s.coordenadas_lng).length}</p>
                <p>Cultivos con coordenadas: {cultivos.filter(c => c.coordenadas_lat && c.coordenadas_lng).length}</p>
                {getMapCenter() && (
                  <p>Centro del mapa: {getMapCenter().lat.toFixed(4)}, {getMapCenter().lng.toFixed(4)}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de ubicaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sensores */}
        {(selectedType === 'all' || selectedType === 'sensores') && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sensores ({sensores.length})
              </h3>
            </div>
            <div className="p-6">
              {sensores.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay sensores registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {sensores.map((sensor) => (
                    <div key={sensor.id_sensor} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{sensor.nombre}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{sensor.ubicacion_sensor || 'Ubicación no especificada'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getStatusColor(sensor.activo ? 'ACTIVO' : 'INACTIVO') }}
                        ></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {sensor.coordenadas_lat && sensor.coordenadas_lng 
                            ? `${sensor.coordenadas_lat.toFixed(4)}, ${sensor.coordenadas_lng.toFixed(4)}`
                            : 'Sin coordenadas'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cultivos */}
        {(selectedType === 'all' || selectedType === 'cultivos') && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Cultivos ({cultivos.length})
              </h3>
            </div>
            <div className="p-6">
              {cultivos.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No hay cultivos registrados
                </p>
              ) : (
                <div className="space-y-3">
                  {cultivos.map((cultivo) => (
                    <div key={cultivo.id_cultivo} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{cultivo.tipo_cultivo}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{cultivo.ubicacion_especifica || 'Ubicación no especificada'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: getStatusColor(cultivo.estado) }}
                        ></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {cultivo.coordenadas_lat && cultivo.coordenadas_lng 
                            ? `${cultivo.coordenadas_lat.toFixed(4)}, ${cultivo.coordenadas_lng.toFixed(4)}`
                            : 'Sin coordenadas'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
