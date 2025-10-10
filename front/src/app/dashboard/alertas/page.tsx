'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Clock, Filter } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDateTime, getSeverityColor } from '@/lib/utils'
import type { AlertaResponse } from '@/types'

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<AlertaResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'baja' | 'media' | 'alta' | 'critica'>('all')
  const [filterResolved, setFilterResolved] = useState<'all' | 'resolved' | 'unresolved'>('all')

  useEffect(() => {
    loadAlertas()
  }, [])

  const loadAlertas = async () => {
    try {
      setIsLoading(true)
      const data = await mockApi.getAlertas()
      setAlertas(data)
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
      setAlertas(alertas.map(alerta => 
        alerta.id_alerta === alertaId 
          ? { ...alerta, resuelta: true }
          : alerta
      ))
    } catch (error) {
      console.error('Error resolving alerta:', error)
    }
  }

  const filteredAlertas = alertas.filter(alerta => {
    const matchesSeverity = filterSeverity === 'all' || alerta.severidad.toLowerCase() === filterSeverity
    const matchesResolved = filterResolved === 'all' || 
                           (filterResolved === 'resolved' && alerta.resuelta) ||
                           (filterResolved === 'unresolved' && !alerta.resuelta)
    
    return matchesSeverity && matchesResolved
  })

  const getSeverityIcon = (severidad: string) => {
    switch (severidad.toLowerCase()) {
      case 'alta':
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case 'media':
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'baja':
      case 'low':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Centro de Alertas
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Gestiona y resuelve todas las alertas del sistema
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {alertas.filter(a => !a.resuelta).length} alertas pendientes
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas las severidades</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterResolved}
              onChange={(e) => setFilterResolved(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todas las alertas</option>
              <option value="unresolved">Pendientes</option>
              <option value="resolved">Resueltas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredAlertas.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-4">
              {filterSeverity !== 'all' || filterResolved !== 'all' 
                ? 'No se encontraron alertas con los filtros aplicados' 
                : 'No hay alertas en el sistema'
              }
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAlertas.map((alerta) => (
              <div key={alerta.id_alerta} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 mt-1">
                      {getSeverityIcon(alerta.severidad)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {alerta.titulo}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alerta.severidad)}`}>
                          {alerta.severidad.toUpperCase()}
                        </span>
                        {alerta.resuelta && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            RESUELTA
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {alerta.mensaje}
                      </p>
                      {alerta.valor_actual && alerta.valor_umbral && (
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Valor Actual:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {alerta.valor_actual}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Umbral:</span>
                              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                                {alerta.valor_umbral}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDateTime(alerta.fecha_creacion)}
                      </div>
                    </div>
                  </div>
                  {!alerta.resuelta && (
                    <button
                      onClick={() => handleResolveAlerta(alerta.id_alerta)}
                      className="flex-shrink-0 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Resolver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
