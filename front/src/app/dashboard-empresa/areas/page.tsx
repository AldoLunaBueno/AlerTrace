'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Plus, 
  Search, 
  Filter, 
  Edit,
  Trash2,
  Eye,
  Settings,
  Activity,
  Thermometer,
  Droplets,
  Zap,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { api } from '@/lib/api'
import type { SensorResponse as APISensorData } from '@/types'

// NODO PROMPT: AREAS_GESTION - Página de gestión de áreas de producción

interface Area {
  id: string
  nombre: string
  descripcion: string
  color: string
  ubicacion: string
  responsable: string
  fechaCreacion: Date
  estado: 'activa' | 'inactiva' | 'mantenimiento'
  sensores: Sensor[]
  ultimaActividad?: Date
}

interface Sensor {
  id: string
  nombre: string
  tipo: 'temperatura' | 'humedad' | 'ph' | 'presion' | 'flujo' | 'nivel' | 'personalizado'
  unidad: string
  valorActual?: number
  estado: 'activo' | 'inactivo' | 'error'
  ultimaLectura?: Date
  limites: {
    min: number
    max: number
  }
}



const estadosArea = {
  activa: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  inactiva: {
    icon: XCircle,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800'
  },
  mantenimiento: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  }
}

const tiposSensor = {
  temperatura: { icon: Thermometer, color: 'text-red-500' },
  humedad: { icon: Droplets, color: 'text-blue-500' },
  ph: { icon: Activity, color: 'text-green-500' },
  presion: { icon: BarChart3, color: 'text-purple-500' },
  flujo: { icon: Zap, color: 'text-yellow-500' },
  nivel: { icon: BarChart3, color: 'text-indigo-500' },
  personalizado: { icon: Settings, color: 'text-gray-500' },
  // Tipos que vienen de la API
  multisensor: { icon: Activity, color: 'text-orange-500' },
  radiacion: { icon: Zap, color: 'text-yellow-500' },
  // Fallback para tipos desconocidos
  default: { icon: Settings, color: 'text-gray-500' }
}

export default function AreasEmpresaPage() {
  const [areas, setAreas] = useState<Area[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filtroEstado, setFiltroEstado] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [mostrarModal, setMostrarModal] = useState(false)
  const [areaSeleccionada, setAreaSeleccionada] = useState<Area | null>(null)

  const areasFiltradas = areas.filter(area => {
    const coincideEstado = filtroEstado === 'todos' || area.estado === filtroEstado
    const coincideBusqueda = busqueda === '' || 
      area.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      area.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      area.responsable.toLowerCase().includes(busqueda.toLowerCase())
    
    return coincideEstado && coincideBusqueda
  })

  // Cargar datos reales de sensores y crear áreas basadas en ubicaciones
  const cargarDatos = async () => {
    try {
      const response = await api.sensors.getSensors() as any
      
      if (response && Array.isArray(response)) {
        const sensoresData = response as APISensorData[]
        
        // Procesar datos para el mapa de áreas
        const areasMap = new Map()
        
        sensoresData.forEach((sensor: APISensorData) => {
          const ubicacion = sensor.ubicacion_sensor || 'Área General'
          
          if (!areasMap.has(ubicacion)) {
            areasMap.set(ubicacion, {
              id: ubicacion,
              nombre: ubicacion,
              descripcion: `Área de ${ubicacion}`,
              color: '#3B82F6',
              ubicacion: ubicacion,
              responsable: 'Asignado automáticamente',
              fechaCreacion: new Date(),
              estado: 'activa' as const,
              sensores: [],
              ultimaActividad: new Date(),
            })
          }
          
          const area = areasMap.get(ubicacion)
          area.sensores.push({
            id: sensor.id_sensor.toString(),
            nombre: sensor.nombre,
            tipo: sensor.tipo as any,
            unidad: obtenerUnidadSensor(sensor.tipo),
            valorActual: 0, // Los valores de lectura vienen de otro endpoint
            estado: sensor.activo ? 'activo' : 'inactivo',
            ultimaLectura: sensor.ultima_lectura || new Date(),
            limites: { min: 0, max: 100 }
          })
        })
        
        const areasArray = Array.from(areasMap.values())
        setAreas(areasArray)
      } else {
        setError('No se pudieron cargar los sensores')
      }
    } catch (error) {
      setError('Error al cargar las áreas')
    } finally {
      setLoading(false)
    }
  }

  const obtenerUnidadSensor = (tipo: string): string => {
    switch (tipo.toLowerCase()) {
      case 'temperatura': return '°C'
      case 'humedad_aire':
      case 'humedad_suelo': 
      case 'humedad': return '%'
      case 'ph_suelo':
      case 'ph': return 'pH'
      case 'radiacion_solar':
      case 'radiacion': return 'W/m²'
      case 'nutrientes': return 'ppm'
      default: return ''
    }
  }

  const obtenerConfigSensor = (tipo: string) => {
    const tipoNormalizado = tipo.toLowerCase()
    const config = (tiposSensor as any)[tipoNormalizado]
    return config || tiposSensor.default
  }

  const obtenerValorSensor = (sensor: APISensorData, tipo: string): number => {
    // Los valores de lecturas vienen de otro endpoint separado
    return 0
  }

  // Funciones helper


  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const createArea = async (areaData: Partial<Area>) => {
    // TODO: Implementar creación de área
    console.log('API: Creating area...', areaData)
  }

  const updateArea = async (id: string, areaData: Partial<Area>) => {
    // TODO: Implementar actualización de área
    console.log('API: Updating area...', id, areaData)
  }

  const deleteArea = async (id: string) => {
    // TODO: Implementar eliminación de área
    console.log('API: Deleting area...', id)
  }

  const estadisticas = {
    total: areas.length,
    activas: areas.filter(a => a.estado === 'activa').length,
    enMantenimiento: areas.filter(a => a.estado === 'mantenimiento').length,
    totalSensores: areas.reduce((acc, area) => acc + area.sensores.length, 0)
  }

  const handleCrearArea = () => {
    setAreaSeleccionada(null)
    setMostrarModal(true)
  }

  const handleEditarArea = (area: Area) => {
    setAreaSeleccionada(area)
    setMostrarModal(true)
  }

  const handleEliminarArea = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta área?')) {
      setAreas(areas.filter(area => area.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mr-2 md:mr-3" />
            Sensores
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Gestión modular de sensores organizados por áreas de producción
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => alert('Funcionalidad de añadir sensor en desarrollo. Por ahora puedes ver los sensores existentes en las áreas.')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Activity className="h-4 w-4 mr-2" />
            Añadir Sensor
          </button>
          <button
            onClick={handleCrearArea}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Área
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Áreas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total}</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Activas</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.activas}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Mantenimiento</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.enMantenimiento}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sensores</p>
              <p className="text-2xl font-bold text-purple-600">{estadisticas.totalSensores}</p>
            </div>
            <Activity className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar áreas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="todos">Todos los estados</option>
            <option value="activa">Activas</option>
            <option value="inactiva">Inactivas</option>
            <option value="mantenimiento">En mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Estados de carga */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando sensores...
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200">{error}</p>
          <button 
            onClick={cargarDatos}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && areasFiltradas.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No hay sensores configurados aún.</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Los sensores se agruparán automáticamente por área cuando se detecten.</p>
        </div>
      )}

      {/* Lista de áreas */}
      {!loading && !error && areasFiltradas.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {areasFiltradas.map((area) => {
          const EstadoIcon = estadosArea[area.estado].icon
          const estadoConfig = estadosArea[area.estado]
          
          return (
            <div key={area.id} className="dashboard-card p-6 hover:shadow-lg transition-shadow">
              {/* Header del área */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: area.color }}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {area.nombre}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {area.ubicacion}
                    </p>
                  </div>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${estadoConfig.bgColor} ${estadoConfig.color}`}>
                  <EstadoIcon className="h-3 w-3 mr-1" />
                  {area.estado}
                </div>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {area.descripcion}
              </p>

              {/* Información adicional */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium mr-2">Responsable:</span>
                  {area.responsable}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium mr-2">Sensores:</span>
                  {area.sensores.length} configurados
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  Última actividad: {area.ultimaActividad?.toLocaleString('es-PE')}
                </div>
              </div>

              {/* Sensores */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Sensores ({area.sensores.length})
                </h4>
                <div className="space-y-1">
                  {area.sensores.slice(0, 3).map((sensor) => {
                    const sensorConfig = obtenerConfigSensor(sensor.tipo)
                    const SensorIcon = sensorConfig.icon
                    const sensorColor = sensorConfig.color
                    
                    return (
                      <div key={sensor.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <SensorIcon className={`h-3 w-3 ${sensorColor}`} />
                          <span className="text-gray-600 dark:text-gray-400">{sensor.nombre}</span>
                        </div>
                        <span className={`px-1 py-0.5 rounded text-xs ${
                          sensor.estado === 'activo' ? 'bg-green-100 text-green-800' :
                          sensor.estado === 'inactivo' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {sensor.estado}
                        </span>
                      </div>
                    )
                  })}
                  {area.sensores.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      +{area.sensores.length - 3} sensores más...
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditarArea(area)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </button>
                <button
                  onClick={() => {/* TODO: Implementar vista de sensores */}}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Sensores
                </button>
                <button
                  onClick={() => handleEliminarArea(area.id)}
                  className="flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
          })}
        </div>
      )}

      {/* Modal para crear/editar área */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {areaSeleccionada ? 'Editar Área' : 'Nueva Área'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Área
                </label>
                <input
                  type="text"
                  defaultValue={areaSeleccionada?.nombre || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Zona de Secado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  defaultValue={areaSeleccionada?.descripcion || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                  placeholder="Descripción del área..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex space-x-2">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  defaultValue={areaSeleccionada?.ubicacion || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Planta Principal - Nivel 1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Responsable
                </label>
                <input
                  type="text"
                  defaultValue={areaSeleccionada?.responsable || ''}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Nombre del responsable"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setMostrarModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // TODO: Implementar guardado
                  setMostrarModal(false)
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {areaSeleccionada ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
