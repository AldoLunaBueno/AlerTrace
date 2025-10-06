'use client'

import { Activity, AlertTriangle, Leaf, Database } from 'lucide-react'
import type { KpiData } from '@/types'

interface KpiCardsProps {
  data: KpiData
}

export function KpiCards({ data }: KpiCardsProps) {
  const kpis = [
    {
      title: 'Total Sensores',
      value: data.totalSensores,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Sensores Activos',
      value: data.sensoresActivos,
      icon: Database,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Alertas Pendientes',
      value: data.alertasPendientes,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      title: 'Cultivos Activos',
      value: data.cultivosActivos,
      icon: Leaf,
      color: 'text-sacha-600 dark:text-sacha-400',
      bgColor: 'bg-sacha-100 dark:bg-sacha-900/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center">
              <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {kpi.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
