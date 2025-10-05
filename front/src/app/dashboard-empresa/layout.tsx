'use client'

import { SidebarEmpresa } from '@/components/dashboard/sidebar-empresa'
import { NotificationsDropdown } from '@/components/shared/notifications-dropdown'
import { BottomNavEmpresa } from '@/components/mobile/bottom-nav-empresa'
import RouteGuard from '@/components/shared/route-guard'

export default function DashboardEmpresaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard requiredUserType="empresa" fallbackRoute="/dashboard-agricultor">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar - oculto en móvil */}
        <div className="hidden md:block">
          <SidebarEmpresa />
        </div>
        
        {/* Área principal con navbar integrada */}
        <div className="flex-1 md:ml-64">
          {/* Navbar responsiva que respeta el sidebar */}
          <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                      <span className="hidden sm:inline">SachaTrace - Sistema Industrial</span>
                      <span className="sm:hidden">Sistema Industrial</span>
                    </h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <NotificationsDropdown userType="empresa" />
                  <div className="hidden md:block text-sm text-gray-500 dark:text-gray-400">
                    Empresa Industrial
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Contenido principal */}
          <main className="p-4 md:p-6 pb-20 md:pb-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Bottom Navigation - solo visible en móvil */}
      <BottomNavEmpresa />
    </div>
    </RouteGuard>
  )
}
