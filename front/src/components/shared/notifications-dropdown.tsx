'use client'

import { useState } from 'react'
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success'
  timestamp: Date
  read: boolean
}

interface NotificationsDropdownProps {
  userType: 'empresa' | 'agricultor'
}

export function NotificationsDropdown({ userType }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState<Notification[]>(userType === 'agricultor' ? [
    {
      id: '1',
      title: 'Alerta Crítica: Temperatura Alta',
      message: 'Temperatura del aire alcanzó 32°C en Campo Norte - Requiere atención inmediata',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
      read: false
    },
    {
      id: '2',
      title: 'Humedad del Suelo Baja',
      message: 'Humedad del suelo en Sector A está en 15% VWC - Considerar riego',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
      read: false
    },
    {
      id: '3',
      title: 'Índice UV Alto',
      message: 'Índice UV actual: 8 - Evitar labores de campo en horas pico',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
      read: false
    },
  ] : [
    {
      id: '1',
      title: 'Sensor Desconectado',
      message: 'El sensor de temperatura en Zona A está offline',
      type: 'warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
      read: false
    },
    {
      id: '3',
      title: 'Mantenimiento Programado',
      message: 'Recordatorio: Mantenimiento de equipos mañana a las 8:00 AM',
      type: 'info',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `Hace ${minutes} min`
    } else if (hours < 24) {
      return `Hace ${hours} h`
    } else {
      return `Hace ${days} días`
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          userType === 'agricultor' 
            ? 'text-green-600 hover:text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-400 dark:hover:bg-green-900/20' 
            : 'text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400'
        }`}
      >
        <Bell className={`h-6 w-6 transition-all duration-200 ${
          userType === 'agricultor' 
            ? 'hover:fill-green-600 dark:hover:fill-green-400' 
            : ''
        }`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notificaciones
                </h3>
                {unreadCount > 0 && (
                  <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                    {unreadCount} sin leer
                  </span>
                )}
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay notificaciones
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors ${
                        !notification.read ? 'bg-gray-100 dark:bg-gray-800/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-sm font-medium ${
                              !notification.read 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className={`w-2 h-2 rounded-full ${
                                userType === 'agricultor' ? 'bg-red-500' : 'bg-blue-500'
                              }`}></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button className="w-full text-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}