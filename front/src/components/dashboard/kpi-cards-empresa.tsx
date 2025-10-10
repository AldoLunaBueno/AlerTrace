'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react'

interface KpiDataEmpresa {
  rendimientoExtraccion: number
  tiempoEnRango: number
  mermas: number
  lotesProcesados: number
  alertasAbiertas: number
}

export function KpiCardsEmpresa() {
  const [kpiData, setKpiData] = useState<KpiDataEmpresa>({
    rendimientoExtraccion: 87.5,
    tiempoEnRango: 94.2,
    mermas: 12.5,
    lotesProcesados: 24,
    alertasAbiertas: 3
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        setLoading(true)
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000))
        setKpiData({
          rendimientoExtraccion: 87.5,
          tiempoEnRango: 94.2,
          mermas: 12.5,
          lotesProcesados: 24,
          alertasAbiertas: 3
        })
      } catch (error) {
        console.error('Error al cargar KPIs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchKpis()
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchKpis, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatPercentage = (value: number) => {
    return `${value}%`
  }

  const formatNumber = (value: number) => {
    return value.toLocaleString()
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {/* Rendimiento de extracción */}
      <div className="kpi-card empresa-gradient">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Rendimiento Extracción
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(kpiData.rendimientoExtraccion)}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +2.3% vs mes anterior
              </span>
            </div>
          </div>
          <div className="h-12 w-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Tiempo en rango */}
      <div className="kpi-card empresa-gradient">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Tiempo en Rango
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(kpiData.tiempoEnRango)}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +1.8% vs mes anterior
              </span>
            </div>
          </div>
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      {/* Mermas */}
      <div className="kpi-card empresa-gradient">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Mermas
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatPercentage(kpiData.mermas)}
            </p>
            <div className="flex items-center mt-2">
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm text-red-600 dark:text-red-400">
                -0.5% vs mes anterior
              </span>
            </div>
          </div>
          <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      {/* Lotes procesados */}
      <div className="kpi-card empresa-gradient">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Lotes Procesados
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {formatNumber(kpiData.lotesProcesados)}
            </p>
            <div className="flex items-center mt-2">
              <Package className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Este mes
              </span>
            </div>
          </div>
          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
            <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
