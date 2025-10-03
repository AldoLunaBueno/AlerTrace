'use client'

import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets, Eye, EyeOff, RefreshCw, TrendingUp, TrendingDown, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react'

interface ClimaData {
  temperatura: number
  humedad: number
  presion: number
  viento: {
    velocidad: number
    direccion: string
  }
  uv: number
  visibilidad: number
  condicion: string
  descripcion: string
  ultimaActualizacion: Date
  pronostico: {
    fecha: Date
    tempMax: number
    tempMin: number
    condicion: string
    precipitacion: number
  }[]
}

const climaMock: ClimaData = {
  temperatura: 28.5,
  humedad: 72,
  presion: 1013.25,
  viento: {
    velocidad: 12,
    direccion: 'NE'
  },
  uv: 7,
  visibilidad: 15,
  condicion: 'Parcialmente Nublado',
  descripcion: 'Cielo parcialmente nublado con vientos moderados',
  ultimaActualizacion: new Date('2025-01-15T19:00:00'),
  pronostico: [
    {
      fecha: new Date('2025-01-16T00:00:00'),
      tempMax: 32,
      tempMin: 24,
      condicion: 'Soleado',
      precipitacion: 0
    },
    {
      fecha: new Date('2025-01-17T00:00:00'),
      tempMax: 30,
      tempMin: 22,
      condicion: 'Parcialmente Nublado',
      precipitacion: 15
    },
    {
      fecha: new Date('2025-01-18T00:00:00'),
      tempMax: 28,
      tempMin: 20,
      condicion: 'Lluvia Ligera',
      precipitacion: 45
    },
    {
      fecha: new Date('2025-01-19T00:00:00'),
      tempMax: 31,
      tempMin: 23,
      condicion: 'Soleado',
      precipitacion: 0
    },
    {
      fecha: new Date('2025-01-20T00:00:00'),
      tempMax: 33,
      tempMin: 25,
      condicion: 'Soleado',
      precipitacion: 0
    }
  ]
}

export default function ClimaPage() {
  const [clima, setClima] = useState<ClimaData>(climaMock)
  const [mostrarDetalles, setMostrarDetalles] = useState(true)
  const [cargando, setCargando] = useState(false)

  const actualizarClima = async () => {
    setCargando(true)
    // Simulación de actualización
    setTimeout(() => {
      setClima(prev => ({
        ...prev,
        temperatura: prev.temperatura + (Math.random() - 0.5) * 2,
        humedad: Math.max(0, Math.min(100, prev.humedad + (Math.random() - 0.5) * 10)),
        ultimaActualizacion: new Date(Date.now())
      }))
      setCargando(false)
    }, 1000)
  }

  const getCondicionIcon = (condicion: string) => {
    switch (condicion.toLowerCase()) {
      case 'soleado':
        return <Sun className="w-6 h-6 text-yellow-500" />
      case 'parcialmente nublado':
        return <Cloud className="w-6 h-6 text-gray-500" />
      case 'lluvia ligera':
        return <CloudRain className="w-6 h-6 text-blue-500" />
      case 'lluvia':
        return <CloudRain className="w-6 h-6 text-blue-600" />
      default:
        return <Cloud className="w-6 h-6 text-gray-500" />
    }
  }

  const getUVColor = (uv: number) => {
    if (uv <= 2) return 'text-green-600'
    if (uv <= 5) return 'text-yellow-600'
    if (uv <= 7) return 'text-orange-600'
    if (uv <= 10) return 'text-red-600'
    return 'text-purple-600'
  }

  const getUVDescripcion = (uv: number) => {
    if (uv <= 2) return 'Bajo'
    if (uv <= 5) return 'Moderado'
    if (uv <= 7) return 'Alto'
    if (uv <= 10) return 'Muy Alto'
    return 'Extremo'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Condiciones Climáticas</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Monitorea el clima y pronósticos para tu cultivo</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMostrarDetalles(!mostrarDetalles)}
            className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            {mostrarDetalles ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {mostrarDetalles ? 'Ocultar Detalles' : 'Mostrar Detalles'}
          </button>
          <button
            onClick={actualizarClima}
            disabled={cargando}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${cargando ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Condiciones Actuales */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-6 text-white overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            {getCondicionIcon(clima.condicion)}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold truncate">{clima.condicion}</h2>
              <p className="text-blue-100 text-sm sm:text-base truncate">{clima.descripcion}</p>
            </div>
          </div>
          <div className="text-left sm:text-right flex-shrink-0">
            <div className="text-3xl sm:text-4xl font-bold">{clima.temperatura}°C</div>
            <p className="text-blue-100 text-xs sm:text-sm">
              Actualizado: {clima.ultimaActualizacion.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {mostrarDetalles && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 overflow-hidden">
            <div className="bg-white/20 rounded-lg p-3 min-w-0">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">Humedad</span>
              </div>
              <div className="text-lg sm:text-xl font-bold mt-1">{clima.humedad}%</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 min-w-0">
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">Viento</span>
              </div>
              <div className="text-lg sm:text-xl font-bold mt-1">{clima.viento.velocidad} km/h</div>
              <div className="text-xs text-blue-100 truncate">{clima.viento.direccion}</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 min-w-0">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">Presión</span>
              </div>
              <div className="text-lg sm:text-xl font-bold mt-1">{clima.presion} hPa</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 min-w-0">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="text-xs sm:text-sm truncate">UV</span>
              </div>
              <div className="text-lg sm:text-xl font-bold mt-1">{clima.uv}</div>
              <div className="text-xs text-blue-100 truncate">{getUVDescripcion(clima.uv)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Pronóstico 5 Días */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pronóstico 5 Días
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {clima.pronostico.map((dia, index) => (
              <div
                key={index}
                className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center hover:shadow-md transition-shadow ${
                  index === clima.pronostico.length - 1 && clima.pronostico.length % 2 === 1 ? 'col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {dia.fecha.toLocaleDateString('es-ES', { 
                    weekday: 'short', 
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
                <div className="flex justify-center mb-2">
                  {getCondicionIcon(dia.condicion)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {dia.condicion}
                </div>
                <div className="flex justify-center space-x-2 mb-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {dia.tempMax}°
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {dia.tempMin}°
                  </span>
                </div>
                {dia.precipitacion > 0 && (
                  <div className="flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <CloudRain className="w-4 h-4 mr-1" />
                    <span className="text-sm">{dia.precipitacion}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recomendaciones Agrícolas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recomendaciones para el Cultivo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    Condiciones Favorables
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    La temperatura actual es óptima para el crecimiento del Sacha Inchi. 
                    La humedad del suelo se mantiene en niveles adecuados.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Precauciones
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    El índice UV es alto. Considera aplicar sombra temporal durante las 
                    horas de mayor radiación solar.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start">
                <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Riego
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Se recomienda riego por goteo temprano en la mañana. 
                    Evitar el riego durante las horas de mayor temperatura.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <div className="flex items-start">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                    Crecimiento
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Las condiciones actuales favorecen el desarrollo vegetativo. 
                    Ideal para aplicar fertilizante foliar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Datos Históricos */}
      {mostrarDetalles && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Datos Históricos (Últimas 24h)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Temperatura</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Máxima</span>
                    <span className="font-medium text-red-600">32.1°C</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mínima</span>
                    <span className="font-medium text-blue-600">24.3°C</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Promedio</span>
                    <span className="font-medium text-gray-900 dark:text-white">28.2°C</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Humedad</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Máxima</span>
                    <span className="font-medium text-blue-600">85%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mínima</span>
                    <span className="font-medium text-yellow-600">45%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Promedio</span>
                    <span className="font-medium text-gray-900 dark:text-white">68%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Precipitación</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Acumulada</span>
                    <span className="font-medium text-blue-600">2.5 mm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Intensidad Max</span>
                    <span className="font-medium text-green-600">5.2 mm/h</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duración</span>
                    <span className="font-medium text-gray-900 dark:text-white">30 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}