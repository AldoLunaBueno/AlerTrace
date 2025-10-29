'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  BarChart3,
  Settings,
  LogOut,
  User,
  MapPin,
  Database,
  Leaf
} from 'lucide-react'
import { AlertRaceLogo } from '../AlertRaceLogo'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Sensores', href: '/dashboard/sensores', icon: Activity },
    { name: 'Cultivos', href: '/dashboard/cultivos', icon: Leaf },
    { name: 'Mapa', href: '/dashboard/mapa', icon: MapPin },
    { name: 'Alertas', href: '/dashboard/alertas', icon: AlertTriangle },
    { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
    { name: 'Configuración', href: '/dashboard/configuracion', icon: Settings }
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 z-40">
      {/* Logo y título */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center">
          <AlertRaceLogo 
            width={120} 
            height={30} 
            className="h-6 w-auto"
          />
        </Link>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 ml-1">
          Sistema Agrícola
        </p>
      </div>
      
      {/* Navegación */}
      <nav className="mt-6 px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-sacha-50 text-sacha-700 border-r-2 border-sacha-700 dark:bg-sacha-900/20 dark:text-sacha-400'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Información del usuario */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sacha-100 dark:bg-sacha-900/20 p-2 rounded-full">
            <User className="h-5 w-5 text-sacha-600 dark:text-sacha-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Agricultor
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Usuario Activo
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}
