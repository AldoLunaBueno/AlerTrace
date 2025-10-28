'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, Filter, X } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { formatDateTime, getStatusColor } from '@/lib/utils'
import type { SensorResponse } from '@/types'

export default function SensoresPage() {
  const [sensores, setSensores] = useState<SensorResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  // modal estado
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDeviceId, setNewDeviceId] = useState('')
  const [newType, setNewType] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)

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

  const filteredSensores = sensores.filter((sensor: any) => {
    const matchesSearch = sensor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sensor.device_id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && sensor.activo) ||
                         (filterStatus === 'inactive' && !sensor.activo)
    
    return matchesSearch && matchesFilter
  })

  const openAdd = () => {
    setNewName('')
    setNewDeviceId('')
    setNewType('')
    setSaveMsg(null)
    setShowAdd(true)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newDeviceId || !newType) {
      setSaveMsg('Completa todos los campos.')
      return
    }
    setSaving(true)
    // MOCK: simular alta y actualización en memoria
    setTimeout(() => {
      const nuevo: SensorResponse = {
        id_sensor: Math.max(0, ...sensores.map((s: any) => s.id_sensor)) + 1,
        nombre: newName,
        device_id: newDeviceId,
        tipo: newType,
        ubicacion_sensor: 'No especificada',
        activo: true,
        ultima_lectura: null as any
      }
      setSensores([nuevo, ...sensores])
      setSaving(false)
      setShowAdd(false)
    }, 800)
  }

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
          <button onClick={openAdd} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors">
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
            <button onClick={openAdd} className="inline-flex items-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors">
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

      {/* Modal Agregar Sensor (mock) */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Agregar Sensor (demo)</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sacha-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Device ID</label>
                <input value={newDeviceId} onChange={(e) => setNewDeviceId(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sacha-500" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                <input value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sacha-500" />
              </div>
              {saveMsg && <div className="text-sm text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-md p-2">{saveMsg}</div>}
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#4E9082] text-white font-semibold hover:bg-[#4E9082]/90 disabled:opacity-60">{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
