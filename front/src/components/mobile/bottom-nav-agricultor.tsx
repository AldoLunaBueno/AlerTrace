'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Thermometer, 
  Sprout, 
  AlertTriangle, 
  Settings
} from 'lucide-react'

export function BottomNavAgricultor() {
  const pathname = usePathname()

  const navigation = [
    { name: 'General', href: '/dashboard-agricultor', icon: LayoutDashboard },
    { name: 'Alertas', href: '/dashboard-agricultor/alertas-agricultor', icon: AlertTriangle },
    { name: 'Clima', href: '/dashboard-agricultor/clima', icon: Thermometer },
    { name: 'Configuración', href: '/dashboard-agricultor/configuracion-agricultor', icon: Settings }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors ${
                isActive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
