'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { api } from '@/lib/api'
import type { AlertaResponse } from '@/types'

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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Cargar notificaciones leídas del localStorage al inicio
    const savedReadNotifications = localStorage.getItem(`readNotifications_${userType}`)
    const readNotificationsSet = savedReadNotifications 
      ? new Set<string>(JSON.parse(savedReadNotifications) as string[])
      : new Set<string>()
    
    setReadNotifications(readNotificationsSet)

    const fetchNotifications = async (currentReadNotifications: Set<string>) => {
      try {
        const alertas: AlertaResponse[] = await api.alertas.getAlertas()
        
        // Convertir las alertas más recientes (últimas 10) a notificaciones
        // Solo mostrar alertas no resueltas
        const recentAlertas = alertas
          .filter(alerta => !alerta.resuelta)
          .sort((a: AlertaResponse, b: AlertaResponse) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
          .slice(0, 10)
        
        const notificationsFromAlertas: Notification[] = recentAlertas.map((alerta: AlertaResponse) => ({
          id: alerta.id_alerta.toString(),
          title: alerta.titulo,
          message: alerta.mensaje,
          type: alerta.severidad === 'critica' ? 'warning' : alerta.severidad === 'alta' ? 'warning' : 'info',
          timestamp: new Date(alerta.fecha_creacion),
          read: currentReadNotifications.has(alerta.id_alerta.toString()) // Usar el Set actualizado
        }))
        
        setNotifications(notificationsFromAlertas)
      } catch (error) {
        console.error('Error fetching notifications:', error)
        setNotifications([])
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications(readNotificationsSet)
    
    // Actualizar notificaciones cada 30 segundos usando el estado actual de readNotifications
    const interval = setInterval(() => {
      const currentSavedReadNotifications = localStorage.getItem(`readNotifications_${userType}`)
      const currentReadNotificationsSet = currentSavedReadNotifications 
        ? new Set<string>(JSON.parse(currentSavedReadNotifications) as string[])
        : new Set<string>()
      fetchNotifications(currentReadNotificationsSet)
    }, 30000)
    
    return () => clearInterval(interval)
  }, [userType])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (notificationId: string) => {
    const newReadNotifications = new Set(readNotifications)
    newReadNotifications.add(notificationId)
    setReadNotifications(newReadNotifications)
    
    // Guardar en localStorage
    localStorage.setItem(`readNotifications_${userType}`, JSON.stringify(Array.from(newReadNotifications)))
    
    // Actualizar el estado de la notificación
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ))
  }

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id)
    const newReadNotifications = new Set(Array.from(readNotifications).concat(allIds))
    setReadNotifications(newReadNotifications)
    
    // Guardar en localStorage
    localStorage.setItem(`readNotifications_${userType}`, JSON.stringify(Array.from(newReadNotifications)))
    
    // Actualizar todas las notificaciones como leídas
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  const resolveAlert = async (notificationId: string) => {
    try {
      const response = await api.alertas.resolveAlerta(parseInt(notificationId))
      
      // Remover la notificación de la lista ya que ahora está resuelta
      setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
      
      // También remover del localStorage de leídas
      const newReadNotifications = new Set(Array.from(readNotifications))
      newReadNotifications.delete(notificationId)
      setReadNotifications(newReadNotifications)
      localStorage.setItem(`readNotifications_${userType}`, JSON.stringify(Array.from(newReadNotifications)))
      
      // Actualizar inmediatamente las notificaciones desde la API
      setTimeout(async () => {
        try {
          const alertas: AlertaResponse[] = await api.alertas.getAlertas()
          const currentSavedReadNotifications = localStorage.getItem(`readNotifications_${userType}`)
          const currentReadNotificationsSet = currentSavedReadNotifications 
            ? new Set<string>(JSON.parse(currentSavedReadNotifications) as string[])
            : new Set<string>()
          
          const recentAlertas = alertas
            .filter(alerta => !alerta.resuelta)
            .sort((a: AlertaResponse, b: AlertaResponse) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime())
            .slice(0, 10)
          
          const notificationsFromAlertas: Notification[] = recentAlertas.map((alerta: AlertaResponse) => ({
            id: alerta.id_alerta.toString(),
            title: alerta.titulo,
            message: alerta.mensaje,
            type: alerta.severidad === 'critica' ? 'warning' : alerta.severidad === 'alta' ? 'warning' : 'info',
            timestamp: new Date(alerta.fecha_creacion),
            read: currentReadNotificationsSet.has(alerta.id_alerta.toString())
          }))
          
          setNotifications(notificationsFromAlertas)
          
          // Mostrar mensaje si el problema persiste
          if (response && typeof response === 'object' && 'problema_persiste' in response) {
            if (response.problema_persiste) {
              // Podrías mostrar una notificación toast aquí
              console.info('Se detectó que el problema persiste. Se ha generado una nueva alerta.')
            }
          }
          
        } catch (error) {
          console.error('Error refreshing notifications:', error)
        }
      }, 1000) // Esperar 1 segundo para que la API procese la nueva alerta si es necesario
      
    } catch (error) {
      console.error('Error resolving alert:', error)
    }
  }

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
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                      >
                        Marcar todas como leídas
                      </button>
                      <span className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                        {unreadCount} sin leer
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 dark:border-green-400 mx-auto"></div>
                  <p className="mt-2 text-sm">Cargando notificaciones...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No hay notificaciones
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${
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
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-xs text-gray-400 dark:text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </p>
                            <div className="flex items-center space-x-2">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    markAsRead(notification.id)
                                  }}
                                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 px-2 py-1 rounded"
                                >
                                  Marcar leída
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  resolveAlert(notification.id)
                                }}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-2 py-1 rounded"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>
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