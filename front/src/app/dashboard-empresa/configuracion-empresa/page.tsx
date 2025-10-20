'use client'

import { useState, useEffect } from 'react'
import { User, MapPin, Phone, Mail, Settings, Bell, Shield, Save, Eye, EyeOff, Key, Building } from 'lucide-react'
import { api } from '@/lib/api'

interface PerfilEmpresa {
  nombre: string
  email: string
  telefono: string
  direccion: string
  ciudad: string
  region: string
  ruc: string
  tipoEmpresa: string
  fechaRegistro: string
  representanteLegal: string
}

interface ConfiguracionNotificaciones {
  alertasCriticas: boolean
  alertasSensores: boolean
  alertasLotes: boolean
  alertasCalidad: boolean
  alertasMantenimiento: boolean
  alertasProduccion: boolean
}



export default function ConfiguracionEmpresaPage() {
  const [perfil, setPerfil] = useState<PerfilEmpresa | null>(null)
  const [notificaciones, setNotificaciones] = useState<ConfiguracionNotificaciones>({
    alertasCriticas: true,
    alertasSensores: true,
    alertasLotes: true,
    alertasCalidad: true,
    alertasMantenimiento: false,
    alertasProduccion: true
  })
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [tabActiva, setTabActiva] = useState<'perfil' | 'notificaciones' | 'seguridad'>('perfil')
  const [guardando, setGuardando] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar datos de la empresa desde la API
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const userData = await api.auth.getMe() as any
        
        // Convertir datos de la API al formato esperado para empresa
        setPerfil({
          nombre: userData.nombre || 'Empresa',
          email: userData.email || '',
          telefono: userData.telefono || '',
          direccion: userData.direccion || '',
          ciudad: userData.ciudad || '',
          region: userData.region || '',
          ruc: userData.ruc || '',
          tipoEmpresa: userData.tipo_empresa || 'Manufacturera',
          fechaRegistro: userData.fecha_registro || new Date().toISOString().split('T')[0],
          representanteLegal: userData.representante_legal || ''
        })
      } catch (err) {
        console.error('Error al cargar datos de la empresa:', err)
        setError('Error al cargar los datos del perfil de la empresa')
      } finally {
        setLoading(false)
      }
    }

    loadCompanyData()
  }, [])

  const tabs = [
    { id: 'perfil', nombre: 'Perfil', icono: Building },
    { id: 'notificaciones', nombre: 'Notificaciones', icono: Bell },
    { id: 'seguridad', nombre: 'Seguridad', icono: Shield }
  ]

  const guardarConfiguracion = async (seccion: string) => {
    setGuardando(true)
    setTimeout(() => {
      setGuardando(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
          <span className="text-lg text-gray-600 dark:text-gray-400">Cargando configuración de la empresa...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <h3 className="text-lg font-semibold">Error al cargar configuración</h3>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!perfil) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No hay datos de perfil disponibles</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Configuración</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gestiona el perfil de la empresa y preferencias del sistema</p>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-row space-x-2 sm:space-x-8 px-4 sm:px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icono = tab.icono
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id as any)}
                  className={`${
                    tabActiva === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } whitespace-nowrap py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center justify-center flex-shrink-0`}
                >
                  <Icono className="w-4 h-4 mr-2" />
                  {tab.nombre}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Pestaña Perfil */}
          {tabActiva === 'perfil' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de la Empresa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre de la Empresa
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={perfil.nombre}
                        onChange={(e) => setPerfil(prev => prev ? { ...prev, nombre: e.target.value } : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      RUC
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={perfil.ruc}
                        onChange={(e) => setPerfil(prev => prev ? { ...prev, ruc: e.target.value } : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={perfil.email}
                        onChange={(e) => setPerfil(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        value={perfil.telefono}
                        onChange={(e) => setPerfil(prev => prev ? { ...prev, telefono: e.target.value } : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dirección
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={perfil.direccion}
                        onChange={(e) => setPerfil(prev => prev ? { ...prev, direccion: e.target.value } : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={perfil.ciudad}
                      onChange={(e) => setPerfil(prev => prev ? { ...prev, ciudad: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Región
                    </label>
                    <input
                      type="text"
                      value={perfil.region}
                      onChange={(e) => setPerfil(prev => prev ? { ...prev, region: e.target.value } : null)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Representante Legal
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={perfil.representanteLegal}
                        onChange={(e) => setPerfil(prev => prev ? { ...prev, representanteLegal: e.target.value } : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => guardarConfiguracion('perfil')}
                  disabled={guardando}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {guardando ? 'Guardando...' : 'Guardar Perfil'}
                </button>
              </div>
            </div>
          )}

          {/* Pestaña Notificaciones */}
          {tabActiva === 'notificaciones' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuración de Notificaciones</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Alertas Críticas</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recibir notificaciones de alertas críticas del sistema</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.alertasCriticas}
                        onChange={(e) => setNotificaciones({ ...notificaciones, alertasCriticas: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Alertas de Sensores</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones sobre el estado de los sensores</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.alertasSensores}
                        onChange={(e) => setNotificaciones({ ...notificaciones, alertasSensores: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Alertas de Lotes</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones sobre el procesamiento de lotes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.alertasLotes}
                        onChange={(e) => setNotificaciones({ ...notificaciones, alertasLotes: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Alertas de Calidad</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones sobre controles de calidad</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.alertasCalidad}
                        onChange={(e) => setNotificaciones({ ...notificaciones, alertasCalidad: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Alertas de Mantenimiento</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Recordatorios de mantenimiento programado</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.alertasMantenimiento}
                        onChange={(e) => setNotificaciones({ ...notificaciones, alertasMantenimiento: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Alertas de Producción</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones sobre el estado de la producción</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.alertasProduccion}
                        onChange={(e) => setNotificaciones({ ...notificaciones, alertasProduccion: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => guardarConfiguracion('notificaciones')}
                  disabled={guardando}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {guardando ? 'Guardando...' : 'Guardar Notificaciones'}
                </button>
              </div>
            </div>
          )}

          {/* Pestaña Seguridad */}
          {tabActiva === 'seguridad' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuración de Seguridad</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cambiar Contraseña
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type={mostrarContrasena ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        className="w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {mostrarContrasena ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="password"
                        placeholder="Confirmar nueva contraseña"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="font-medium text-blue-900 dark:text-blue-100">Recomendaciones de Seguridad</h3>
                        <ul className="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• Usa una contraseña de al menos 8 caracteres</li>
                          <li>• Incluye mayúsculas, minúsculas, números y símbolos</li>
                          <li>• No compartas tus credenciales de acceso</li>
                          <li>• Cambia tu contraseña regularmente</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => guardarConfiguracion('seguridad')}
                  disabled={guardando}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {guardando ? 'Guardando...' : 'Cambiar Contraseña'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
