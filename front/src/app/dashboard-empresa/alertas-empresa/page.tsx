'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Info, 
  Filter, 
  Search,
  Bell,
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Zap,
  Settings,
  Eye,
  CheckCircle2
} from 'lucide-react'

interface Alerta {
  id: string
  tipo: 'critica' | 'advertencia' | 'info' | 'exito'
  titulo: string
  descripcion: string
  equipo: string
  ubicacion: string
  fechaHora: Date
  leida: boolean
  variable?: string
  valor?: number
  unidad?: string
  limite?: number
}

// Datos simulados de alertas
const alertasMock: Alerta[] = [
  {
    id: '1',
    tipo: 'critica',
    titulo: 'Temperatura crítica en secador principal',
    descripcion: 'La temperatura del secador principal ha excedido el límite crítico de 60°C',
    equipo: 'Secador Principal',
    ubicacion: 'Área de Secado - Nivel 2',
    fechaHora: new Date('2025-01-15T19:00:00'),
    leida: false,
    variable: 'Temperatura Aire',
    valor: 62.3,
    unidad: '°C',
    limite: 60
  },
  {
    id: '2',
    tipo: 'advertencia',
    titulo: 'Humedad producto alta',
    descripcion: 'La humedad del producto está por encima del rango óptimo',
    equipo: 'Secador Secundario',
    ubicacion: 'Área de Secado - Nivel 1',
    fechaHora: new Date('2025-01-15T18:30:00'),
    leida: false,
    variable: 'Humedad Producto',
    valor: 9.8,
    unidad: '%',
    limite: 9
  },
  {
    id: '3',
    tipo: 'critica',
    titulo: 'Presión excesiva en prensa',
    descripcion: 'La presión de la prensa cold-press ha superado los límites de seguridad',
    equipo: 'Prensa Cold-Press',
    ubicacion: 'Área de Extracción',
    fechaHora: new Date('2025-01-15T17:00:00'),
    leida: true,
    variable: 'Presión Prensa',
    valor: 320.5,
    unidad: 'bar',
    limite: 300
  },
  {
    id: '4',
    tipo: 'info',
    titulo: 'Mantenimiento programado',
    descripcion: 'Mantenimiento preventivo programado para el equipo de filtración',
    equipo: 'Sistema de Filtración',
    ubicacion: 'Área de Procesamiento',
    fechaHora: new Date('2025-01-15T15:00:00'),
    leida: true,
    variable: 'Estado Equipo',
    valor: 100,
    unidad: '%',
    limite: 100
  },
  {
    id: '5',
    tipo: 'exito',
    titulo: 'Lote completado exitosamente',
    descripcion: 'El lote LOT-2024-015 ha sido procesado sin incidencias',
    equipo: 'Línea de Producción',
    ubicacion: 'Área de Empaque',
    fechaHora: new Date('2025-01-15T14:30:00'),
    leida: true,
    variable: 'Lotes Procesados',
    valor: 15,
    unidad: 'unidades',
    limite: 20
  }
]

const tiposAlerta = {
  critica: {
    icon: AlertTriangle,
    color: 'text-red-500',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  advertencia: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  info: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  exito: {
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800'
  }
}

export default function AlertasEmpresaPage() {
  const [alertas, setAlertas] = useState<Alerta[]>(alertasMock)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')
  const [filtroLeidas, setFiltroLeidas] = useState<string>('todos')
  const [busqueda, setBusqueda] = useState('')

  const alertasFiltradas = alertas.filter(alerta => {
    const coincideTipo = filtroTipo === 'todos' || alerta.tipo === filtroTipo
    const coincideLeidas = filtroLeidas === 'todos' || 
      (filtroLeidas === 'leidas' && alerta.leida) ||
      (filtroLeidas === 'no-leidas' && !alerta.leida)
    const coincideBusqueda = busqueda === '' || 
      alerta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      alerta.equipo.toLowerCase().includes(busqueda.toLowerCase())
    
    return coincideTipo && coincideLeidas && coincideBusqueda
  })

  const estadisticas = {
    total: alertas.length,
    noLeidas: alertas.filter(a => !a.leida).length,
    criticas: alertas.filter(a => a.tipo === 'critica').length,
    advertencias: alertas.filter(a => a.tipo === 'advertencia').length
  }

  const marcarComoLeida = (id: string) => {
    setAlertas(alertas.map(alerta => 
      alerta.id === id ? { ...alerta, leida: true } : alerta
    ))
  }

  const marcarTodasComoLeidas = () => {
    setAlertas(alertas.map(alerta => ({ ...alerta, leida: true })))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Bell className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mr-2 md:mr-3" />
            Sistema de Alertas
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Monitoreo y gestión de alertas del sistema industrial
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={marcarTodasComoLeidas}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Marcar Todas como Leídas
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Alertas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">No Leídas</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.noLeidas}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Críticas</p>
              <p className="text-2xl font-bold text-red-600">{estadisticas.criticas}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        <div className="dashboard-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Advertencias</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.advertencias}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
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
              placeholder="Buscar alertas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="todos">Todos los tipos</option>
            <option value="critica">Críticas</option>
            <option value="advertencia">Advertencias</option>
            <option value="info">Información</option>
            <option value="exito">Éxito</option>
          </select>
          <select
            value={filtroLeidas}
            onChange={(e) => setFiltroLeidas(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="todos">Todas</option>
            <option value="no-leidas">No leídas</option>
            <option value="leidas">Leídas</option>
          </select>
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="space-y-4">
        {alertasFiltradas.map((alerta) => {
          const tipoConfig = tiposAlerta[alerta.tipo]
          const TipoIcon = tipoConfig.icon
          
          return (
            <div 
              key={alerta.id} 
              className={`dashboard-card p-6 border-l-4 ${tipoConfig.borderColor} hover:shadow-lg transition-shadow ${
                !alerta.leida ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${tipoConfig.bgColor}`}>
                    <TipoIcon className={`h-5 w-5 ${tipoConfig.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {alerta.titulo}
                      </h3>
                      {!alerta.leida && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Nueva
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {alerta.descripcion}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Settings className="h-4 w-4 mr-2" />
                        <span><strong>Equipo:</strong> {alerta.equipo}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span><strong>Ubicación:</strong> {alerta.ubicacion}</span>
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span><strong>Fecha:</strong> {alerta.fechaHora.toLocaleString('es-PE')}</span>
                      </div>
                    </div>
                    {alerta.variable && alerta.valor && (
                      <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {alerta.variable}
                          </span>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {alerta.valor} {alerta.unidad}
                          </span>
                        </div>
                        {alerta.limite && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Límite: {alerta.limite} {alerta.unidad}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!alerta.leida && (
                    <button
                      onClick={() => marcarComoLeida(alerta.id)}
                      className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar como Leída
                    </button>
                  )}
                  <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {alertasFiltradas.length === 0 && (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay alertas
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se encontraron alertas con los filtros seleccionados
          </p>
        </div>
      )}
    </div>
  )
}
