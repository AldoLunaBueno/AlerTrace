'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Bell, Filter, Search, Eye, EyeOff, Settings, RefreshCw, Thermometer, Droplets, Sun, Sprout, Wind } from 'lucide-react'

interface AlertaAgricultor {
  id: string
  tipo: 'temperatura' | 'humedad' | 'riego' | 'plaga' | 'nutriente' | 'clima' | 'sistema'
  severidad: 'info' | 'advertencia' | 'critica'
  titulo: string
  descripcion: string
  ubicacion: string
  sensor?: string
  valor?: {
    actual: number
    limite: number
    unidad: string
  }
  recomendacion: string
  timestamp: Date
  leida: boolean
  resuelta: boolean
}

const alertasMock: AlertaAgricultor[] = [
  {
    id: '1',
    tipo: 'temperatura',
    severidad: 'advertencia',
    titulo: 'Temperatura del aire elevada',
    descripcion: 'La temperatura del aire en el Campo 1 ha superado los 32°C, lo que puede generar estrés térmico en las plantas.',
    ubicacion: 'Campo 1 - Sector A',
    sensor: 'Sensor de Temperatura Aire TA-001',
    valor: {
      actual: 34.5,
      limite: 32.0,
      unidad: '°C'
    },
    recomendacion: 'Programar riegos más frecuentes y cortos; usar cobertura/sombra temporal en horas pico.',
    timestamp: new Date('2025-01-15T18:30:00'),
    leida: false,
    resuelta: false
  },
  {
    id: '2',
    tipo: 'humedad',
    severidad: 'critica',
    titulo: 'Humedad del suelo crítica',
    descripcion: 'La humedad del suelo ha caído por debajo del 15% VWC, indicando estrés hídrico severo con riesgo de marchitez.',
    ubicacion: 'Campo 2 - Sector B',
    sensor: 'Sensor de Humedad Suelo HS-002',
    valor: {
      actual: 12.3,
      limite: 15.0,
      unidad: '% VWC'
    },
    recomendacion: 'RIEGO INMEDIATO REQUERIDO. Activar sistema de riego; priorizar bloques más críticos; comprobar bombas y presiones.',
    timestamp: new Date('2025-01-15T17:45:00'),
    leida: true,
    resuelta: false
  },
  {
    id: '3',
    tipo: 'clima',
    severidad: 'advertencia',
    titulo: 'Humedad relativa alta',
    descripcion: 'La humedad relativa del aire ha alcanzado el 85%, creando condiciones propicias para enfermedades fúngicas.',
    ubicacion: 'Campo 3 - Sector C',
    sensor: 'Sensor de Humedad Relativa HR-003',
    valor: {
      actual: 85.2,
      limite: 80.0,
      unidad: '%'
    },
    recomendacion: 'Favorecer ventilación; evitar riegos nocturnos o de alta duración; minimizar mojado foliar.',
    timestamp: new Date('2025-01-15T16:20:00'),
    leida: true,
    resuelta: false
  },
  {
    id: '4',
    tipo: 'sistema',
    severidad: 'critica',
    titulo: 'Índice UV extremo',
    descripcion: 'El índice UV ha alcanzado nivel 11, representando alto riesgo de daño por radiación en las plantas.',
    ubicacion: 'Campo 1 - Todos los sectores',
    sensor: 'Sensor de Radiación UV UV-004',
    valor: {
      actual: 11.2,
      limite: 10.0,
      unidad: 'UV'
    },
    recomendacion: 'Evitar labores expuestas en horas pico; sombreo inmediato en áreas sensibles; proteger personal de campo.',
    timestamp: new Date('2025-01-15T14:15:00'),
    leida: false,
    resuelta: false
  },
  {
    id: '5',
    tipo: 'temperatura',
    severidad: 'info',
    titulo: 'Temperatura del aire óptima',
    descripcion: 'La temperatura del aire se mantiene en el rango óptimo de 22-28°C para el crecimiento del cultivo.',
    ubicacion: 'Campo 2 - Sector A',
    sensor: 'Sensor de Temperatura Aire TA-005',
    valor: {
      actual: 25.8,
      limite: 28.0,
      unidad: '°C'
    },
    recomendacion: 'Mantener manejo actual; continuar monitoreo regular.',
    timestamp: new Date('2025-01-15T12:00:00'),
    leida: true,
    resuelta: true
  },
  {
    id: '6',
    tipo: 'humedad',
    severidad: 'advertencia',
    titulo: 'Exceso de humedad en suelo',
    descripcion: 'La humedad del suelo ha superado el 40% VWC, indicando riesgo de anoxia radicular.',
    ubicacion: 'Campo 3 - Sector B',
    sensor: 'Sensor de Humedad Suelo HS-006',
    valor: {
      actual: 42.8,
      limite: 40.0,
      unidad: '% VWC'
    },
    recomendacion: 'Reducir frecuencia/duración de riegos; favorecer drenaje superficial; revisar válvulas y fugas.',
    timestamp: new Date('2025-01-15T10:30:00'),
    leida: false,
    resuelta: false
  }
]

export default function AlertasAgricultorPage() {
  const [alertas, setAlertas] = useState<AlertaAgricultor[]>(alertasMock)
  const [filtroSeveridad, setFiltroSeveridad] = useState<'todos' | 'info' | 'advertencia' | 'critica'>('todos')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'temperatura' | 'humedad' | 'clima' | 'sistema'>('todos')
  const [busqueda, setBusqueda] = useState('')
  const [alertasFiltradas, setAlertasFiltradas] = useState<AlertaAgricultor[]>(alertasMock)
  const [recomendacionesVisibles, setRecomendacionesVisibles] = useState<{ [key: string]: boolean }>({})
  const [filtroFechaResueltas, setFiltroFechaResueltas] = useState<'todos' | 'hoy' | 'semana' | 'mes'>('todos')
  const [filtroSeveridadResueltas, setFiltroSeveridadResueltas] = useState<'todos' | 'info' | 'advertencia' | 'critica'>('todos')
  const [filtroTipoResueltas, setFiltroTipoResueltas] = useState<'todos' | 'temperatura' | 'humedad' | 'clima' | 'sistema'>('todos')

  useEffect(() => {
    let filtradas = alertas.filter(alerta => !alerta.resuelta) // Excluir alertas resueltas

    // Filtro por severidad
    if (filtroSeveridad !== 'todos') {
      filtradas = filtradas.filter(alerta => alerta.severidad === filtroSeveridad)
    }

    // Filtro por tipo
    if (filtroTipo !== 'todos') {
      filtradas = filtradas.filter(alerta => alerta.tipo === filtroTipo)
    }

    // Filtro por búsqueda
    if (busqueda) {
      filtradas = filtradas.filter(alerta =>
        alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        alerta.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        alerta.ubicacion.toLowerCase().includes(busqueda.toLowerCase())
      )
    }

    setAlertasFiltradas(filtradas)
  }, [alertas, filtroSeveridad, filtroTipo, busqueda])

  const marcarComoResuelta = (id: string) => {
    setAlertas(prev => prev.map(alerta =>
      alerta.id === id ? { ...alerta, resuelta: true, leida: true } : alerta
    ))
  }

  const marcarCardComoLeida = (id: string) => {
    setAlertas(prev => prev.map(alerta =>
      alerta.id === id && !alerta.leida ? { ...alerta, leida: true } : alerta
    ))
  }

  const toggleRecomendacion = (id: string) => {
    setRecomendacionesVisibles(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const getAlertasResueltasFiltradas = () => {
    let resueltas = alertas.filter(alerta => alerta.resuelta)
    
    // Filtro por fecha
    if (filtroFechaResueltas !== 'todos') {
      const ahora = new Date()
      const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
      const inicioSemana = new Date(hoy)
      inicioSemana.setDate(hoy.getDate() - hoy.getDay())
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
      
      resueltas = resueltas.filter(alerta => {
        const fechaAlerta = new Date(alerta.timestamp)
        switch (filtroFechaResueltas) {
          case 'hoy':
            return fechaAlerta >= hoy
          case 'semana':
            return fechaAlerta >= inicioSemana
          case 'mes':
            return fechaAlerta >= inicioMes
          default:
            return true
        }
      })
    }

    // Filtro por severidad
    if (filtroSeveridadResueltas !== 'todos') {
      resueltas = resueltas.filter(alerta => alerta.severidad === filtroSeveridadResueltas)
    }

    // Filtro por tipo
    if (filtroTipoResueltas !== 'todos') {
      resueltas = resueltas.filter(alerta => alerta.tipo === filtroTipoResueltas)
    }
    
    return resueltas
  }

  const getSeveridadStyles = (severidad: string) => {
    switch (severidad) {
      case 'critica':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-600 dark:text-red-400',
          badge: 'bg-red-50/90 border border-red-300 text-red-800 dark:bg-red-900/10 dark:border-red-700 dark:text-red-300'
        }
      case 'advertencia':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-50/90 border border-yellow-300 text-yellow-800 dark:bg-yellow-900/10 dark:border-yellow-700 dark:text-yellow-300'
        }
      default:
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-50/90 border border-blue-300 text-blue-800 dark:bg-blue-900/10 dark:border-blue-700 dark:text-blue-300'
        }
    }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'temperatura':
        return <Thermometer className="w-5 h-5" />
      case 'humedad':
        return <Droplets className="w-5 h-5" />
      case 'riego':
        return <Droplets className="w-5 h-5" />
      case 'plaga':
        return <Sprout className="w-5 h-5" />
      case 'nutriente':
        return <Sprout className="w-5 h-5" />
      case 'clima':
        return <Sun className="w-5 h-5" />
      case 'sistema':
        return <Settings className="w-5 h-5" />
      default:
        return <AlertTriangle className="w-5 h-5" />
    }
  }

  const getSensorColor = (tipo: string) => {
    switch (tipo) {
      case 'temperatura':
        return 'bg-orange-500'
      case 'humedad':
        return 'bg-blue-500'
      case 'clima':
        return 'bg-yellow-500'
      case 'sistema':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getSensorIconColor = (tipo: string) => {
    switch (tipo) {
      case 'temperatura':
        return 'text-orange-500'
      case 'humedad':
        return 'text-blue-500'
      case 'clima':
        return 'text-yellow-500'
      case 'sistema':
        return 'text-purple-500'
      default:
        return 'text-gray-500'
    }
  }

  const estadisticas = {
    total: alertas.length,
    noLeidas: alertas.filter(a => !a.leida).length,
    criticas: alertas.filter(a => a.severidad === 'critica' && !a.resuelta).length,
    resueltas: alertas.filter(a => a.resuelta).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Alertas del Campo</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitorea las alertas y notificaciones de tu cultivo</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{estadisticas.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Sin Leer</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{estadisticas.noLeidas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Críticas</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{estadisticas.criticas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-[54px] h-[54px] bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-2 sm:ml-3">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Resueltas</p>
              <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{estadisticas.resueltas}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            {alertasFiltradas.length} de {alertas.length} alertas
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
            {/* Filtro por Severidad */}
            <select
              value={filtroSeveridad}
              onChange={(e) => setFiltroSeveridad(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-auto min-w-fit"
            >
              <option value="todos">Tipo de alerta</option>
              <option value="critica">Críticas</option>
              <option value="advertencia">Advertencias</option>
              <option value="info">Información</option>
            </select>

            {/* Filtro por Tipo */}
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-auto min-w-fit"
            >
              <option value="todos">Tipo de sensor</option>
              <option value="temperatura">Temperatura</option>
              <option value="humedad">Humedad Suelo</option>
              <option value="clima">Humedad Relativa</option>
              <option value="sistema">Índice UV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertasFiltradas.map((alerta) => {
          const estilos = getSeveridadStyles(alerta.severidad)
          return (
            <div
              key={alerta.id}
              onClick={() => marcarCardComoLeida(alerta.id)}
              className={`relative cursor-pointer ${estilos.bg} ${estilos.border} rounded-lg border px-6 py-5 hover:shadow-md transition-shadow`}
            >
              {/* Barra lateral de identificación del sensor */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getSensorColor(alerta.tipo)}`}></div>
              
              <div className="flex flex-col">
                <div className="flex-1">
                  <div className="flex items-start space-x-3 mb-2">
                    <div className={`w-[54px] h-[54px] rounded-lg ${getSensorColor(alerta.tipo)} bg-opacity-20 flex items-center justify-center`}>
                      <div className={`${getSensorIconColor(alerta.tipo)}`}>
                        {getTipoIcon(alerta.tipo)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between space-x-2">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {alerta.titulo}
                        </h3>
                        {!alerta.leida && (
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${estilos.badge}`}>
                          {alerta.severidad.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">
                        {alerta.ubicacion} • {alerta.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className={`${estilos.text} mb-3 text-sm sm:text-base break-words`}>
                    {alerta.descripcion}
                  </p>

                  {alerta.valor && (
                    <div className="mb-3 p-3 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                          Valor actual: {alerta.valor.actual} {alerta.valor.unidad}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          Límite: {alerta.valor.limite} {alerta.valor.unidad}
                        </span>
                      </div>
                      {alerta.sensor && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
                          Sensor: {alerta.sensor}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Recomendación condicional en desktop */}
                  {recomendacionesVisibles[alerta.id] && (
                    <div className="hidden md:block bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <h4 className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                        Recomendación:
                      </h4>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 break-words">
                        {alerta.recomendacion}
                      </p>
                    </div>
                  )}
                  {/* Recomendación condicional en móvil */}
                  {recomendacionesVisibles[alerta.id] && (
                    <div className="md:hidden bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                      <h4 className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                        Recomendación:
                      </h4>
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 break-words">
                        {alerta.recomendacion}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-row flex-wrap gap-2 items-center mt-4 justify-end">
                  {!alerta.resuelta && (
                    <>
                      {/* Botón recomendación (secundario) */}
                      <button
                        onClick={() => toggleRecomendacion(alerta.id)}
                        className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg"
                      >
                        {recomendacionesVisibles[alerta.id] ? (
                          <>
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Ocultar
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            Recomendación
                          </>
                        )}
                      </button>

                      {/* Botón resuelto (primario) */}
                      <button
                        onClick={() => marcarComoResuelta(alerta.id)}
                        className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Resuelto
                      </button>
                    </>
                  )}
                  {alerta.resuelta && (
                    <div className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg w-full sm:w-auto">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Resuelta
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {alertasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay alertas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron alertas con los filtros seleccionados.
          </p>
        </div>
      )}

      {/* Alertas Resueltas */}
      {alertas.filter(alerta => alerta.resuelta).length > 0 && (
        <div className="mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Alertas Resueltas
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                {getAlertasResueltasFiltradas().length} resueltas
              </span>
            </div>
            
            {/* Filtros para alertas resueltas */}
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <select
                value={filtroFechaResueltas}
                onChange={(e) => setFiltroFechaResueltas(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-auto min-w-fit"
              >
                <option value="todos">Todas las fechas</option>
                <option value="hoy">Hoy</option>
                <option value="semana">Esta semana</option>
                <option value="mes">Este mes</option>
              </select>

              <select
                value={filtroSeveridadResueltas}
                onChange={(e) => setFiltroSeveridadResueltas(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-auto min-w-fit"
              >
                <option value="todos">Tipo de alerta</option>
                <option value="critica">Críticas</option>
                <option value="advertencia">Advertencias</option>
                <option value="info">Información</option>
              </select>

              <select
                value={filtroTipoResueltas}
                onChange={(e) => setFiltroTipoResueltas(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-auto min-w-fit"
              >
                <option value="todos">Tipo de sensor</option>
                <option value="temperatura">Temperatura</option>
                <option value="humedad">Humedad Suelo</option>
                <option value="clima">Humedad Relativa</option>
                <option value="sistema">Índice UV</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {getAlertasResueltasFiltradas().map((alerta) => {
                const estilos = getSeveridadStyles(alerta.severidad)
                return (
                  <div
                    key={alerta.id}
                    className={`relative cursor-pointer ${estilos.bg} ${estilos.border} rounded-lg border px-6 py-5 hover:shadow-md transition-shadow opacity-75`}
                  >
                    {/* Barra lateral de identificación del sensor */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${getSensorColor(alerta.tipo)}`}></div>
                    
                    <div className="flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-start space-x-3 mb-2">
                          <div className={`w-[54px] h-[54px] rounded-lg ${getSensorColor(alerta.tipo)} bg-opacity-20 flex items-center justify-center`}>
                            <div className={`${getSensorIconColor(alerta.tipo)}`}>
                              {getTipoIcon(alerta.tipo)}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between space-x-2">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {alerta.titulo}
                              </h3>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                                Resuelta
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {alerta.descripcion}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{alerta.timestamp.toLocaleString('es-ES')}</span>
                              <span className={`${estilos.badge}`}>
                                {alerta.severidad}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {alerta.recomendacion && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>Recomendación:</strong> {alerta.recomendacion}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}