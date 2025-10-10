'use client'

import { useEffect, useState } from 'react'
import { Leaf, Calendar, MapPin, TrendingUp } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDate, calculateProgress } from '@/lib/utils'
import type { CultivoResponse } from '@/types'

export function CultivosActivos() {
  const [cultivos, setCultivos] = useState<CultivoResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCultivos()
  }, [])

  const loadCultivos = async () => {
    try {
      setIsLoading(true)
      const data = await mockApi.getCultivos()
      // Mostrar solo cultivos activos
      setCultivos(data.filter(cultivo => cultivo.estado === 'ACTIVO'))
    } catch (error) {
      console.error('Error loading cultivos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
      case 'inactivo':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20'
      case 'cosechado':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20'
      default:
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-sacha-100 dark:bg-sacha-900/20 p-2 rounded-lg">
            <Leaf className="h-5 w-5 text-sacha-600 dark:text-sacha-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cultivos Activos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {cultivos.length} cultivos en desarrollo
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
        ) : cultivos.length === 0 ? (
          <div className="text-center py-8">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay cultivos activos</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cultivos.map((cultivo) => {
              const progreso = cultivo.fecha_siembra && cultivo.fecha_estimada_cosecha
                ? calculateProgress(cultivo.fecha_siembra, cultivo.fecha_estimada_cosecha)
                : 0

              return (
                <div
                  key={cultivo.id_cultivo}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {cultivo.tipo_cultivo}
                      </h4>
                      {cultivo.variedad && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {cultivo.variedad}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(cultivo.estado)}`}>
                      {cultivo.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(cultivo.fecha_siembra || new Date())}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{cultivo.hectareas} ha</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Progreso
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {progreso}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-sacha-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(progreso, 100)}%` }}
                      />
                    </div>
                  </div>

                  {cultivo.ubicacion_especifica && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{cultivo.ubicacion_especifica}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
