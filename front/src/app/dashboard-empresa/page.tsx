'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { KpiCardsEmpresa } from '@/components/dashboard/kpi-cards-empresa'
import { AlertasResumen } from '@/components/dashboard/alertas-resumen'
import { SensoresStatus } from '@/components/dashboard/sensores-status'

export default function DashboardEmpresa() {
  const router = useRouter()
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    // Actualizar timestamp cada 30 segundos
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard Principal
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
            Monitoreo en tiempo real de la planta de procesamiento
          </p>
        </div>
        <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
          Última actualización: {lastUpdate.toLocaleTimeString('es-PE')}
        </div>
        <div className="md:hidden text-xs text-gray-500 dark:text-gray-400">
          Actualizado: {lastUpdate.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* KPIs principales */}
      <KpiCardsEmpresa />

      {/* Grid de resúmenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <AlertasResumen />
      </div>

      {/* Estado de equipos */}
      <SensoresStatus />
    </div>
  )
}
