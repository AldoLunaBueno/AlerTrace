'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  LogIn,
  AlertCircle,
  CheckCircle,
  Factory,
  Sprout
} from 'lucide-react'
import Link from 'next/link'
import LottieAnimation from '@/components/LottieAnimation'

interface LoginData {
  email: string
  password: string
  tipoUsuario: 'industria' | 'agricultor'
}

export default function LoginPage() {
  const router = useRouter()
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    tipoUsuario: 'industria'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<LoginData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Colores dinámicos según el tipo de usuario
  const getThemeColors = () => {
    if (loginData.tipoUsuario === 'industria') {
      return {
        primary: 'blue',
        primaryHex: '#2563eb',
        primaryDark: '#1d4ed8',
        primaryLight: '#dbeafe',
        primaryText: 'text-blue-600',
        primaryBg: 'bg-blue-50',
        primaryBorder: 'border-blue-200',
        primaryRing: 'ring-blue-500',
        primaryHover: 'hover:text-blue-800',
        primaryFocus: 'focus:ring-blue-500'
      }
    } else {
      return {
        primary: 'green',
        primaryHex: '#16a34a',
        primaryDark: '#15803d',
        primaryLight: '#dcfce7',
        primaryText: 'text-green-600',
        primaryBg: 'bg-green-50',
        primaryBorder: 'border-green-200',
        primaryRing: 'ring-green-500',
        primaryHover: 'hover:text-green-800',
        primaryFocus: 'focus:ring-green-500'
      }
    }
  }

  const colors = getThemeColors()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setLoginData(prev => ({ ...prev, [name]: value }))
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name as keyof LoginData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
    if (loginError) {
      setLoginError('')
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginData> = {}

    if (!loginData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!loginData.password) {
      newErrors.password = 'La contraseña es requerida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setLoginError('')
    
    try {
      // Llamada real al API del backend
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8002'
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // Guardar token de autenticación real
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('userEmail', loginData.email)
        localStorage.setItem('userId', data.user_id)
        
        // Obtener información del usuario para determinar el tipo real
        const userResponse = await fetch(`${apiUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${data.access_token}`
          }
        })
        
        if (userResponse.ok) {
          const userData = await userResponse.json()
          // El rol del usuario determina el tipo: 'admin_empresa' o 'agricultor'
          const isEmpresa = userData.rol && userData.rol.includes('empresa')
          const realUserType = isEmpresa ? 'empresa' : 'trabajador'
          
          // VALIDACIÓN CRÍTICA: Verificar que el tipo de usuario coincida con la pestaña seleccionada
          const expectedUserType = loginData.tipoUsuario === 'industria' ? 'empresa' : 'trabajador'
          
          if (realUserType !== expectedUserType) {
            // El tipo de usuario no coincide con la pestaña seleccionada
            const correctTab = realUserType === 'empresa' ? 'industria' : 'agricultor'
            const correctTabName = realUserType === 'empresa' ? 'Industria' : 'Agricultor'
            const currentTabName = loginData.tipoUsuario === 'industria' ? 'Industria' : 'Agricultor'
            
            setLoginError(`❌ Error de acceso: Este usuario es de tipo "${correctTabName}". Haz clic en la pestaña "${correctTabName}" arriba para continuar.`)
            
            // Auto-cambiar a la pestaña correcta después de 2 segundos
            setTimeout(() => {
              setLoginData(prev => ({ ...prev, tipoUsuario: correctTab }))
              setLoginError('')
            }, 3000)
            
            setIsLoading(false)
            return
          }
          
          // Guardar el tipo real del usuario
          localStorage.setItem('userType', realUserType === 'empresa' ? 'industria' : 'agricultor')
          localStorage.setItem('userRole', userData.rol)
          localStorage.setItem('userName', userData.nombre || userData.email)
          localStorage.setItem('idTrabajador', userData.id_trabajador)
          localStorage.setItem('idEmpresa', userData.id_empresa)
          
          // Redirigir al dashboard correspondiente basado en el tipo REAL
          if (realUserType === 'empresa') {
            router.push('/dashboard-empresa')
          } else {
            router.push('/dashboard-agricultor')
          }
        } else {
          setLoginError('Error al obtener información del usuario')
        }
      } else {
        const errorData = await response.json()
        setLoginError(errorData.detail || 'Credenciales incorrectas')
      }
    } catch (error) {
      console.error('Error en el login:', error)
      setLoginError('Error al iniciar sesión. Inténtalo de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-[#81D4FF] dark:from-gray-900 dark:to-gray-800">
        <div className="w-full h-full flex gap-8 items-stretch p-8">
          {/* Columna de animación */}
          <div className="w-full hidden lg:block h-full">
            <LottieAnimation
              className="w-full h-full"
            />
          </div>

        {/* Columna del formulario */}
        <div className="w-fit h-full flex flex-col justify-center">
          {/* Botón de regreso */}
          <Link 
            href="/"
            className="inline-flex items-center text-white hover:text-white/80 dark:text-white dark:hover:text-white/80 mb-6 transition-colors text-lg font-semibold"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>

          {/* Tarjeta de login */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full w-[448px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Accede a tu plataforma AlerTrace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Usuario */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tipo de Usuario
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLoginData(prev => ({ ...prev, tipoUsuario: 'industria' }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    loginData.tipoUsuario === 'industria'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Factory className={`h-6 w-6 mx-auto mb-2 ${
                    loginData.tipoUsuario === 'industria' ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Industria
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Planta de producción
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLoginData(prev => ({ ...prev, tipoUsuario: 'agricultor' }))}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    loginData.tipoUsuario === 'agricultor'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <Sprout className={`h-6 w-6 mx-auto mb-2 ${
                    loginData.tipoUsuario === 'agricultor' ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Agricultor
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Campo agrícola
                  </div>
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Error general */}
            {loginError && (
              <div className={`border rounded-lg p-4 ${
                loginError.includes('Error de acceso') 
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-start">
                  <AlertCircle className={`h-5 w-5 mr-2 mt-0.5 ${
                    loginError.includes('Error de acceso') ? 'text-orange-500' : 'text-red-500'
                  }`} />
                  <div className="flex-1">
                    <p className={`text-sm ${
                      loginError.includes('Error de acceso') 
                        ? 'text-orange-700 dark:text-orange-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      {loginError}
                    </p>
                    {loginError.includes('Error de acceso') && (
                      <p className="text-xs text-orange-600 dark:text-orange-500 mt-2">
                        💡 La pestaña se cambiará automáticamente en unos segundos.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recordar contraseña */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className={`h-4 w-4 ${colors.primaryText} ${colors.primaryRing} border-gray-300 rounded`}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Recordarme
                </label>
              </div>
              <Link href="/forgot-password" className={`text-sm ${colors.primaryText} ${colors.primaryHover}`}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón de login */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Cuentas demo */}
          <div className={`mt-6 p-4 ${colors.primaryBg} rounded-lg`}>
            <h3 className={`text-sm font-medium ${colors.primaryText} mb-2`}>
              Cuentas de demostración:
            </h3>
            <div className={`text-xs ${colors.primaryText} space-y-1`}>
              <div><strong>Industria:</strong> admin@agrotech.com / secret123</div>
              <div><strong>Agricultor Admin:</strong> juan@agrosacha.pe / secret123</div>
              <div><strong>Agricultor Worker:</strong> maria@agrosacha.pe / secret123</div>
            </div>
          </div>

          {/* Enlace a registro */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿No tienes cuenta?{' '}
              <Link href="/registro" className={`${colors.primaryText} ${colors.primaryHover} font-medium`}>
                Crear cuenta
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}