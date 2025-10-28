'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { TelemetriaRealtime } from '@/components/dashboard/telemetria-realtime'
import { CultivosActivos } from '@/components/dashboard/cultivos-activos'
import { AlertasResumen } from '@/components/dashboard/alertas-resumen'
import { SensoresStatus } from '@/components/dashboard/sensores-status'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { mockApi } from '@/lib/mockData'
import { useAuth } from '@/lib/hooks/useLocalStorage'
import type { KpiData } from '@/types'

export default function DashboardPage() {
  const [kpiData, setKpiData] = useState<KpiData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Verificar autenticación
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    loadDashboardData()
  }, [router, isAuthenticated])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const kpis = await mockApi.getKpis()
      setKpiData(kpis)
      setError(null)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Principal
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitorea el estado de tus cultivos y sensores en tiempo real
        </p>
      </div>

      {/* KPIs */}
      {kpiData && <KpiCards data={kpiData} />}

      {/* Grid de componentes principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telemetría en tiempo real */}
        <div className="lg:col-span-2">
          <TelemetriaRealtime />
        </div>

        {/* Cultivos activos */}
        <div>
          <CultivosActivos />
        </div>

        {/* Alertas */}
        <div>
          <AlertasResumen />
        </div>

        {/* Estado de sensores */}
        <div className="lg:col-span-2">
          <SensoresStatus />
        </div>
      </div>
    </div>
  )
}
