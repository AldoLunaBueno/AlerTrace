'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Download, Calendar, TrendingUp, Activity } from 'lucide-react'
import { mockApi } from '@/lib/mockData'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export default function ReportesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    loadReportData()
  }, [])

  const loadReportData = async () => {
    try {
      setIsLoading(true)
      // Simular carga de datos de reportes
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReportData({
        totalSensores: 12,
        sensoresActivos: 10,
        alertasResueltas: 15,
        alertasPendientes: 3,
        cultivosActivos: 8,
        hectareasTotales: 45.5
      })
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async (type: string) => {
    try {
      // Aquí iría la lógica para generar reportes
      console.log(`Generando reporte: ${type}`)
      // Simular descarga
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`Reporte ${type} generado exitosamente`)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error al generar el reporte')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Reportes y Análisis
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Genera reportes detallados sobre el rendimiento de tus cultivos y sensores
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
      </div>

      {/* Resumen de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Sensores</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData?.totalSensores || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Cultivos Activos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData?.cultivosActivos || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-sacha-100 dark:bg-sacha-900/20 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-sacha-600 dark:text-sacha-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Hectáreas Totales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reportData?.hectareasTotales || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reportes disponibles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reporte de Sensores */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reporte de Sensores
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Análisis detallado del rendimiento de tus sensores IoT
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Sensores Activos</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reportData?.sensoresActivos || 0} / {reportData?.totalSensores || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tasa de Actividad</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reportData?.totalSensores ? Math.round((reportData.sensoresActivos / reportData.totalSensores) * 100) : 0}%
                </span>
              </div>
              <button
                onClick={() => generateReport('sensores')}
                className="w-full flex items-center justify-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Reporte de Alertas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reporte de Alertas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Estadísticas de alertas y su resolución
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Alertas Resueltas</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reportData?.alertasResueltas || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Alertas Pendientes</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reportData?.alertasPendientes || 0}
                </span>
              </div>
              <button
                onClick={() => generateReport('alertas')}
                className="w-full flex items-center justify-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Reporte de Cultivos */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reporte de Cultivos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Análisis del rendimiento de tus cultivos
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Cultivos Activos</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reportData?.cultivosActivos || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Superficie Total</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {reportData?.hectareasTotales || 0} ha
                </span>
              </div>
              <button
                onClick={() => generateReport('cultivos')}
                className="w-full flex items-center justify-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte
              </button>
            </div>
          </div>
        </div>

        {/* Reporte General */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Reporte General
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Resumen completo del sistema
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Período</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Últimos 30 días
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Estado del Sistema</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  Operativo
                </span>
              </div>
              <button
                onClick={() => generateReport('general')}
                className="w-full flex items-center justify-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Reporte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Gráficos de Rendimiento
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Gráfico de tendencias</p>
            </div>
          </div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">Gráfico de actividad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
