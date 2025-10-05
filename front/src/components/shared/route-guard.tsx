'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { AlertCircle, Loader2 } from 'lucide-react'

interface RouteGuardProps {
  children: React.ReactNode
  requiredUserType: 'empresa' | 'trabajador'
  fallbackRoute: string
}

export default function RouteGuard({ children, requiredUserType, fallbackRoute }: RouteGuardProps) {
  const router = useRouter()
  const [isValidating, setIsValidating] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const validateUserAccess = async () => {
      try {
        setIsValidating(true)
        setError(null)

        // Verificar si hay token
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/login')
          return
        }

        // Obtener información real del usuario desde la API
        const userData = await api.auth.getCurrentUser()
        
        // Verificar que el tipo de usuario coincida con lo requerido
        const userType = userData.user_type
        
        if (userType !== requiredUserType) {
          // Usuario intentando acceder a dashboard incorrecto
          setError(`Acceso denegado: Este dashboard es solo para ${requiredUserType === 'empresa' ? 'empresas' : 'trabajadores'}`)
          
          // Redirigir al dashboard correcto después de 3 segundos
          setTimeout(() => {
            if (userType === 'empresa') {
              router.push('/dashboard-empresa')
            } else {
              router.push('/dashboard-agricultor')
            }
          }, 3000)
          
          return
        }

        // Usuario autorizado
        setIsAuthorized(true)

      } catch (error) {
        console.error('Error validating user access:', error)
        setError('Error al validar acceso del usuario')
        
        // Si hay error de autenticación, redirigir al login
        setTimeout(() => {
          localStorage.removeItem('token')
          router.push('/login')
        }, 2000)
      } finally {
        setIsValidating(false)
      }
    }

    validateUserAccess()
  }, [requiredUserType, router, fallbackRoute])

  // Mostrar loading mientras valida
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Validando acceso...</p>
        </div>
      </div>
    )
  }

  // Mostrar error si no está autorizado
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-800 mb-2">Acceso Denegado</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <p className="text-sm text-red-600">Redirigiendo al dashboard correcto...</p>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar contenido si está autorizado
  return isAuthorized ? <>{children}</> : null
}