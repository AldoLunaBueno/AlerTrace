'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  Activity, 
  AlertTriangle, 
  BarChart3,
  Settings,
  Factory,
  LogOut,
  User,
  Building2,
  Users
} from 'lucide-react'

export function SidebarEmpresa() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    // Limpiar datos de sesión
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    router.push('/')
  }
  
  const navigation = [
    { name: 'General', href: '/dashboard-empresa', icon: LayoutDashboard },
    { name: 'Sensores', href: '/dashboard-empresa/areas', icon: Factory },
    { name: 'Personal', href: '/dashboard-empresa/personal', icon: Users },
    { name: 'Alertas', href: '/dashboard-empresa/alertas-empresa', icon: AlertTriangle },
    { name: 'Configuración', href: '/dashboard-empresa/configuracion-empresa', icon: Settings }
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 shadow-lg h-screen fixed left-0 top-0 z-40">
      {/* Logo y título */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
            <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              SachaTrace
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Industria
            </p>
          </div>
        </div>
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
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
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
          <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {localStorage.getItem('userName') || 'Empresa'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {localStorage.getItem('userEmail') || 'empresa@sachatrace.com'}
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
