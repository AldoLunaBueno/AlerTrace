'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, X } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDateTime, getSeverityColor } from '@/lib/utils'
import type { AlertaResponse } from '@/types'

export function AlertasResumen() {
  const [alertas, setAlertas] = useState<AlertaResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadAlertas()
  }, [])

  const loadAlertas = async () => {
    try {
      setIsLoading(true)
      const data = await mockApi.getAlertas()
      // Mostrar solo las alertas no resueltas
      setAlertas(data.filter(alerta => !alerta.resuelta))
    } catch (error) {
      console.error('Error loading alertas:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResolveAlerta = async (alertaId: number) => {
    try {
      await mockApi.resolveAlerta(alertaId)
      // Actualizar la lista local
      setAlertas(alertas.filter(alerta => alerta.id_alerta !== alertaId))
    } catch (error) {
      console.error('Error resolving alerta:', error)
    }
  }

  const getSeverityIcon = (severidad: string) => {
    switch (severidad.toLowerCase()) {
      case 'alta':
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'media':
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'baja':
      case 'low':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Alertas Activas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {alertas.length} alertas pendientes
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
        ) : alertas.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No hay alertas activas</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Todo está funcionando correctamente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alertas.slice(0, 5).map((alerta) => (
              <div
                key={alerta.id_alerta}
                className={`p-4 rounded-lg border ${getSeverityColor(alerta.severidad)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(alerta.severidad)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                        {alerta.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {alerta.mensaje}
                      </p>
                      {alerta.valor_actual && alerta.valor_umbral && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Valor: {alerta.valor_actual} | Umbral: {alerta.valor_umbral}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatDateTime(alerta.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleResolveAlerta(alerta.id_alerta)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    title="Resolver alerta"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {alertas.length > 5 && (
              <div className="text-center pt-4">
                <button className="text-sm text-sacha-600 dark:text-sacha-400 hover:text-sacha-700 dark:hover:text-sacha-300 font-medium">
                  Ver todas las alertas ({alertas.length - 5} más)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
