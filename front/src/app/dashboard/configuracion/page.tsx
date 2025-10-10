'use client'

import { useState } from 'react'
import { Settings, User, Bell, Shield, Save } from 'lucide-react'

export default function ConfiguracionPage() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    alerts: {
      temperatura: true,
      humedad: true,
      ph: true,
      radiacion: false
    },
    profile: {
      nombre: 'Agricultor Demo',
      email: 'demo@sachatrace.com',
      telefono: '+51 999 999 999'
    }
  })

  const handleSave = async () => {
    try {
      // Aquí iría la lógica para guardar la configuración
      console.log('Guardando configuración:', settings)
      alert('Configuración guardada exitosamente')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error al guardar la configuración')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Configuración
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Personaliza tu experiencia y configura las preferencias del sistema
            </p>
          </div>
          <button
            onClick={handleSave}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-sacha-600 text-white rounded-lg hover:bg-sacha-700 transition-colors"
          >
            <Save className="h-5 w-5 mr-2" />
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración de Perfil */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg">
                <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                Perfil de Usuario
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={settings.profile.nombre}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, nombre: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.profile.email}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={settings.profile.telefono}
                onChange={(e) => setSettings({
                  ...settings,
                  profile: { ...settings.profile, telefono: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Configuración de Notificaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                Notificaciones
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notificaciones por Email
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recibe alertas importantes por correo electrónico
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, email: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notificaciones Push
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recibe notificaciones en tiempo real en el navegador
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, push: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notificaciones SMS
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recibe alertas críticas por mensaje de texto
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: { ...settings.notifications, sms: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Configuración de Alertas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                Tipos de Alertas
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alertas de Temperatura
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Notificar cuando la temperatura se salga del rango óptimo
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.alerts.temperatura}
                onChange={(e) => setSettings({
                  ...settings,
                  alerts: { ...settings.alerts, temperatura: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alertas de Humedad
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Notificar cuando la humedad se salga del rango óptimo
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.alerts.humedad}
                onChange={(e) => setSettings({
                  ...settings,
                  alerts: { ...settings.alerts, humedad: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alertas de pH
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Notificar cuando el pH del suelo se salga del rango óptimo
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.alerts.ph}
                onChange={(e) => setSettings({
                  ...settings,
                  alerts: { ...settings.alerts, ph: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Alertas de Radiación Solar
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Notificar cuando la radiación solar se salga del rango óptimo
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.alerts.radiacion}
                onChange={(e) => setSettings({
                  ...settings,
                  alerts: { ...settings.alerts, radiacion: e.target.checked }
                })}
                className="h-4 w-4 text-sacha-600 focus:ring-sacha-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Configuración del Sistema */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="bg-gray-100 dark:bg-gray-900/20 p-2 rounded-lg">
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white ml-3">
                Sistema
              </h3>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Intervalo de Actualización (segundos)
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white">
                <option value="30">30 segundos</option>
                <option value="60">1 minuto</option>
                <option value="300">5 minutos</option>
                <option value="600">10 minutos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white">
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idioma
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sacha-500 focus:border-sacha-500 dark:bg-gray-700 dark:text-white">
                <option value="es">Español</option>
                <option value="en">English</option>
                <option value="pt">Português</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
