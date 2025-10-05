'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Wind,
  MapPin,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sprout,
  Eye,
  AlertCircle,
  Zap
} from 'lucide-react'
import api from '@/lib/api'
import type { SensorData as APISensorData } from '@/lib/api'

// Funciones helper para convertir datos de la API
const getValorSensor = (sensor: APISensorData): number => {
  switch (sensor.tipo) {
    case 'temperatura':
      return sensor.temperatura || 25
    case 'humedad':
      return sensor.humedad_aire || sensor.humedad_suelo || 60
    case 'ph':
      return sensor.ph || 6.5
    case 'radiacion':
      return sensor.radiacion_solar || 0
    case 'multisensor':
      return sensor.temperatura || 25 // Valor por defecto para multisensor
    case 'humedad_suelo':
      return sensor.humedad_suelo || 60
    case 'ph_suelo':
      return sensor.ph || 6.5
    case 'radiacion_solar':
      return sensor.radiacion_solar || 800
    case 'gps_tracker':
      return sensor.bateria_nivel || 85 // Para GPS, mostramos nivel de batería
    default:
      return 25 // Valor fijo en lugar de aleatorio
  }
}

const getUnidadPorTipo = (tipo: string): string => {
  switch (tipo) {
    case 'temperatura': return '°C'
    case 'humedad': return '%'
    case 'ph': return 'pH'
    case 'radiacion': return 'W/m²'
    case 'multisensor': return '°C'
    case 'humedad_suelo': return '%'
    case 'ph_suelo': return 'pH'
    case 'radiacion_solar': return 'W/m²'
    case 'gps_tracker': return '%'
    case 'nutrientes': return 'ppm'
    case 'luz': return '%'
    default: return ''
  }
}

const getRangoPorTipo = (tipo: string): { min: number; max: number } => {
  switch (tipo) {
    case 'temperatura': return { min: 15, max: 35 }
    case 'humedad': return { min: 40, max: 90 }
    case 'ph': return { min: 5.5, max: 7.5 }
    case 'radiacion': return { min: 0, max: 1000 }
    case 'multisensor': return { min: 15, max: 35 }
    case 'humedad_suelo': return { min: 30, max: 80 }
    case 'ph_suelo': return { min: 5.5, max: 7.5 }
    case 'radiacion_solar': return { min: 200, max: 1200 }
    case 'gps_tracker': return { min: 0, max: 100 }
    case 'nutrientes': return { min: 100, max: 500 }
    case 'luz': return { min: 60, max: 100 }
    default: return { min: 0, max: 100 }
  }
}

const getIconoPorTipo = (tipo: string) => {
  switch (tipo) {
    case 'temperatura': return Thermometer
    case 'humedad': return Droplets
    case 'ph': return Sprout
    case 'radiacion': return Sun
    case 'multisensor': return Thermometer
    case 'humedad_suelo': return Droplets
    case 'ph_suelo': return Sprout
    case 'radiacion_solar': return Sun
    case 'gps_tracker': return MapPin
    case 'nutrientes': return Sprout
    case 'luz': return Sun
    default: return Activity
  }
}

const getColorPorTipo = (tipo: string): string => {
  switch (tipo) {
    case 'temperatura': return 'text-red-600'
    case 'humedad': return 'text-blue-600'
    case 'ph': return 'text-purple-600'
    case 'radiacion': return 'text-orange-600'
    case 'multisensor': return 'text-red-600'
    case 'humedad_suelo': return 'text-blue-600'
    case 'ph_suelo': return 'text-purple-600'
    case 'radiacion_solar': return 'text-orange-600'
    case 'gps_tracker': return 'text-green-600'
    case 'nutrientes': return 'text-green-600'
    case 'luz': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}

const getBgColorPorTipo = (tipo: string): string => {
  switch (tipo) {
    case 'temperatura': return 'bg-red-100 dark:bg-red-900/20'
    case 'humedad': return 'bg-blue-100 dark:bg-blue-900/20'
    case 'ph': return 'bg-purple-100 dark:bg-purple-900/20'
    case 'radiacion': return 'bg-orange-100 dark:bg-orange-900/20'
    case 'multisensor': return 'bg-red-100 dark:bg-red-900/20'
    case 'humedad_suelo': return 'bg-blue-100 dark:bg-blue-900/20'
    case 'ph_suelo': return 'bg-purple-100 dark:bg-purple-900/20'
    case 'radiacion_solar': return 'bg-orange-100 dark:bg-orange-900/20'
    case 'gps_tracker': return 'bg-green-100 dark:bg-green-900/20'
    case 'nutrientes': return 'bg-green-100 dark:bg-green-900/20'
    case 'luz': return 'bg-orange-100 dark:bg-orange-900/20'
    default: return 'bg-gray-100 dark:bg-gray-900/20'
  }
}

interface SensorData {
  id: string
  nombre: string
  descripcion: string
  valor: number
  unidad: string
  estado: 'normal' | 'advertencia' | 'critico'
  tipo: string
  rango: { min: number; max: number }
  ubicacion: string
  icon: any
  color: string
  bgColor: string
  timestamp: Date
  tendencia: 'subiendo' | 'bajando' | 'estable'
  bateria?: number
  historial: { fecha: Date; valor: number }[]
}

interface ClimaData {
  temperatura: number
  humedad: number
  velocidadViento: number
  precipitacion: number
  uvIndex: number
}





export default function DashboardAgricultor() {
  const router = useRouter()
  const [sensores, setSensores] = useState<SensorData[]>([])
  const [clima, setClima] = useState<ClimaData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSensors, setExpandedSensors] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Cargar datos reales de la API
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Cargar sensores reales
        const sensoresData = await api.sensors.getSensors()
        
        // Convertir datos de la API al formato esperado por el componente
        const sensoresFormatted: SensorData[] = sensoresData.map(sensor => {
          const valor = getValorSensor(sensor)
          return {
            id: sensor.id_sensor.toString(),
            nombre: sensor.nombre || `Sensor ${sensor.tipo}`,
            descripcion: `Sensor de ${sensor.tipo.replace('_', ' ')}`,
            valor: valor,
            unidad: getUnidadPorTipo(sensor.tipo),
            estado: sensor.activo ? 'normal' : 'critico',
            tipo: sensor.tipo,
            rango: getRangoPorTipo(sensor.tipo),
            ubicacion: sensor.ubicacion_sensor || 'Sin ubicación',
            icon: getIconoPorTipo(sensor.tipo),
            color: getColorPorTipo(sensor.tipo),
            bgColor: getBgColorPorTipo(sensor.tipo),
            timestamp: new Date(sensor.ultima_lectura || Date.now()),
            tendencia: 'estable' as const,
            bateria: sensor.bateria_nivel || 0,
            historial: [
              { fecha: new Date(Date.now() - 3600000), valor: valor - 0.1 },
              { fecha: new Date(Date.now() - 1800000), valor: valor },
              { fecha: new Date(), valor: valor }
            ]
          }
        })
        
        setSensores(sensoresFormatted)
        
      } catch (err) {
        console.error('Error al cargar datos:', err)
        setError('Error al cargar los datos de sensores')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const formatearHora = (fecha: Date) => {
    const hora = fecha.getHours().toString().padStart(2, '0')
    const minutos = fecha.getMinutes().toString().padStart(2, '0')
    return `${hora}:${minutos}`
  }

  const getSensorStatusColor = (estado: string) => {
    switch (estado) {
      case 'normal':
        return '#22c55e'
      case 'advertencia':
        return '#DFAF24'
      case 'critico':
        return '#EC4E4E'
      default:
        return '#6b7280'
    }
  }

  const getTendenciaIcon = (tendencia: string) => {
    switch (tendencia) {
      case 'subiendo':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'bajando':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      case 'estable':
        return <Activity className="h-4 w-4 text-blue-500" />
      default:
        return <Zap className="h-4 w-4 text-gray-500" />
    }
  }

  const getTendenciaColor = (tendencia: string) => {
    switch (tendencia) {
      case 'subiendo':
        return 'text-green-600'
      case 'bajando':
        return 'text-red-600'
      case 'estable':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  const calcularProgreso = (valor: number, min: number, max: number) => {
    return ((valor - min) / (max - min)) * 100
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'normal':
        return 'text-green-600 bg-green-100 dark:bg-green-900/20'
      case 'advertencia':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20'
      case 'critico':
        return 'text-red-600 bg-red-100 dark:bg-red-900/20'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20'
    }
  }

  const getSensorTypeColor = (sensorType: string) => {
    switch (sensorType) {
      case 'temperatura':
        return '#ef4444'
      case 'humedad':
        return '#3b82f6'
      case 'ph':
        return '#8b5cf6'
      case 'luz':
        return '#f59e0b'
      default:
        return '#6b7280'
    }
  }

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'normal':
        return <CheckCircle className="h-4 w-4" />
      case 'advertencia':
        return <AlertTriangle className="h-4 w-4" />
      case 'critico':
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const [animatingSensors, setAnimatingSensors] = useState<Set<string>>(new Set())

  const toggleSensorExpansion = (sensorId: string) => {
    const isCurrentlyExpanded = expandedSensors.has(sensorId)
    
    if (!isCurrentlyExpanded) {
      setExpandedSensors(prev => {
        const newSet = new Set(prev)
        newSet.add(sensorId)
        return newSet
      })
      setAnimatingSensors(prev => new Set(prev).add(sensorId))
      
      setTimeout(() => {
        setAnimatingSensors(prev => {
          const newSet = new Set(prev)
          newSet.delete(sensorId)
          return newSet
        })
      }, 300)
    } else {
      setExpandedSensors(prev => {
        const newSet = new Set(prev)
        newSet.delete(sensorId)
        return newSet
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Sprout className="h-6 w-6 md:h-8 md:w-8 text-green-600 mr-2 md:mr-3" />
            Mi Campo
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Monitoreo de tu producción agrícola
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ubicación</p>
            <p className="font-medium text-gray-900 dark:text-white flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              San Martín, Perú
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Última actualización</p>
            <p className="font-medium text-gray-900 dark:text-white flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {formatearHora(new Date())}
            </p>
          </div>
        </div>
        {/* Información móvil */}
        <div className="md:hidden flex items-center justify-between text-sm">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">San Martín, Perú</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-gray-600 dark:text-gray-400">{formatearHora(new Date())}</span>
          </div>
        </div>
      </div>

      {/* Sensores del Campo */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
          Sensores del Campo
        </h2>
        <div className="mb-6 flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Humedad Tierra</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Luz Solar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
            <span className="text-gray-600 dark:text-gray-400">pH</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
            <span className="text-gray-600 dark:text-gray-400">Temperatura del Ambiente</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {sensores.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((sensor) => {
            const Icon = sensor.icon
            const progreso = calcularProgreso(sensor.valor, sensor.rango.min, sensor.rango.max)
            const isExpanded = expandedSensors.has(sensor.id)
            const isAnimating = animatingSensors.has(sensor.id)
            
            return (
              <div
                key={sensor.id}
                data-expanded={isExpanded}
                className={`rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer  ${
                  isExpanded 
                    ? 'bg-white dark:bg-gray-800 h-full'
                    : sensor.estado === 'normal' 
                      ? 'bg-green-50 dark:bg-green-900/20 h-80'
                      : 'h-80'
                }`}
                style={!isExpanded && sensor.estado !== 'normal' ? {
                  backgroundColor: sensor.estado === 'advertencia' ? '#DFAF24' : '#EC4E4E'
                } : {}}
              >
                {/* Barra de color superior */}
                <div 
                  className="top-0 left-0 right-0 h-6 rounded-t-xl"
                  style={{ backgroundColor: getSensorTypeColor(sensor.tipo) }}
                ></div>
                
                {/* Contenedor de información con borde verde */}
                <div className={`p-5 ${sensor.estado === 'normal' && !isExpanded ? 'bg-green-50 dark:bg-green-900/20 border-l border-r border-b border-green-500 rounded-b-xl' : sensor.estado === 'advertencia' && !isExpanded ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l border-r border-b border-yellow-500 rounded-b-xl' : sensor.estado === 'critico' && !isExpanded ? 'bg-red-50 dark:bg-red-900/20 border-l border-r border-b border-red-500 rounded-b-xl' : ''}`} style={{ height: 'calc(100% - 24px)' }}>
                {isExpanded && !isAnimating ? (
                  // Estado expandido: información completa
                  <div className="flex flex-col h-full animate-in fade-in duration-200">
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4 pt-2">
                        <div className={`p-3 rounded-lg ${sensor.bgColor}`}>
                          <Icon className={`h-6 w-6 ${sensor.color}`} />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getEstadoColor(sensor.estado)}`}>
                          {sensor.estado === 'normal' ? (
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          ) : sensor.estado === 'advertencia' ? (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          <span className="capitalize">{sensor.estado}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {sensor.nombre}
                      </h3>
                      
                      <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {sensor.descripcion}
                      </p>
                      
                      <div className="flex items-baseline space-x-2 mb-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {sensor.valor}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {sensor.unidad}
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>{sensor.rango.min}{sensor.unidad}</span>
                          <span>{sensor.rango.max}{sensor.unidad}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(Math.max(progreso, 0), 100)}%`,
                              backgroundColor: sensor.estado === 'normal' ? '#22c55e' :
                                             sensor.estado === 'advertencia' ? '#DFAF24' : '#EC4E4E'
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Ubicación:</span>
                          <span className="text-gray-900 dark:text-white flex items-start text-left">
                            <MapPin className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="leading-tight text-left">
                              {sensor.ubicacion.split(' - ').map((part, index) => (
                                <span key={index} className="block">
                                  {part}
                                </span>
                              ))}
                            </span>
                          </span>
                        </div>
                        
                        <div className="hidden sm:flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Tendencia:</span>
                          <span className={`flex items-center ${getTendenciaColor(sensor.tendencia)}`}>
                            {getTendenciaIcon(sensor.tendencia)}
                            <span className="ml-1 capitalize">{sensor.tendencia}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Actualizado:</span>
                          <span className="text-gray-900 dark:text-white">
                            {formatearHora(sensor.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón para colapsar */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button 
                        onClick={() => toggleSensorExpansion(sensor.id)}
                        className="w-full flex items-center justify-center transition-colors border border-green-500 rounded-lg py-2"
                        style={{ color: '#22c55e' }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.color = '#16a34a'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.color = '#22c55e'}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver menos
                      </button>
                    </div>
                  </div>
                ) : isAnimating ? (
                  // Estado animando
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className={`p-4 rounded-lg ${sensor.bgColor}`}>
                          <Icon className={`h-8 w-8 ${sensor.color}`} />
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-bold text-center ${sensor.color} px-2`}>
                        {sensor.nombre}
                      </h3>
                    </div>
                    
                    <div className="mt-auto p-2">
                      <button 
                        onClick={() => toggleSensorExpansion(sensor.id)}
                        className="w-full px-4 py-2 bg-white hover:bg-gray-100 border border-green-500 rounded-lg transition-colors flex items-center justify-center"
                        style={{ color: '#16a34a' }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver más
                      </button>
                    </div>
                  </div>
                ) : (
                  // Estado colapsado
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center py-4">
                      <div className="flex items-center justify-center mb-4">
                        <div className={`p-4 rounded-lg ${sensor.bgColor}`}>
                          <Icon className={`h-8 w-8 ${sensor.color}`} />
                        </div>
                      </div>
                      
                      <h3 className={`text-lg font-bold text-center ${sensor.color} px-2`}>
                        {sensor.nombre}
                      </h3>
                    </div>
                    
                    <div className="mt-auto p-2">
                      <button 
                        onClick={() => toggleSensorExpansion(sensor.id)}
                        className={`w-full px-4 py-2 bg-white hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center ${
                          sensor.estado === 'normal' ? 'border border-green-500' :
                          sensor.estado === 'advertencia' ? 'border border-yellow-500' :
                          'border border-red-500'
                        }`}
                        style={{ 
                          color: sensor.estado === 'normal' ? '#16a34a' :
                                 sensor.estado === 'advertencia' ? '#eab308' :
                                 '#dc2626'
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver más
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Recomendaciones para tu Campo
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              Las condiciones del suelo son óptimas para el crecimiento de tus cultivos
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              La humedad del aire está alta. Considera mejorar la ventilación si es posible
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-700 dark:text-gray-300">
              El índice UV está en nivel moderado. Ideal para la fotosíntesis
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
