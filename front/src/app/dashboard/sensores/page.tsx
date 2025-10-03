'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { api } from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import type { SensorResponse } from '@/types'

export default function SensoresPage() {
  const [sensores, setSensores] = useState<SensorResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    loadSensores()
  }, [])

  const loadSensores = async () => {
    try {
      setIsLoading(true)
      const data = await api.sensors.getSensors()
      setSensores(data)
    } catch (error) {
      console.error('Error loading sensores:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredSensores = sensores.filter(sensor => {
    const matchesSearch = sensor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.device_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && sensor.activo) ||
                         (filterStatus === 'inactive' && !sensor.activo)
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Gestión de Sensores
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Administra y monitorea todos tus sensores IoT
            </p>
          </div>
          <button className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Agregar Sensor
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar sensores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de sensores */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredSensores.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {searchTerm || filterStatus !== 'all' ? 'No se encontraron sensores' : 'No hay sensores registrados'}
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors">
              <Plus className="h-5 w-5 mr-2" />
              Agregar Primer Sensor
            </button>
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
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Última Lectura
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSensores.map((sensor) => (
                  <tr key={sensor.id_sensor} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sensor.nombre}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {sensor.device_id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {sensor.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {sensor.ubicacion_sensor || 'No especificada'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sensor.activo ? 'ACTIVO' : 'INACTIVO')}`}>
                        {sensor.activo ? 'ACTIVO' : 'INACTIVO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {sensor.ultima_lectura ? formatDateTime(sensor.ultima_lectura) : 'Sin datos'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-sacha-600 dark:text-sacha-400 hover:text-sacha-700 dark:hover:text-sacha-300">
                          Ver
                        </button>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          Editar
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                          Eliminar
                        </button>
                      </div>
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
