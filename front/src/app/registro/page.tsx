'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Factory, 
  Sprout,
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import LottieAnimation from '@/components/LottieAnimation'

interface FormData {
  nombre: string
  email: string
  password: string
  confirmPassword: string
  tipoUsuario: 'industria' | 'agricultor'
  empresa?: string
  telefono?: string
}

export default function RegistroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'industria',
    empresa: '',
    telefono: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [isLoading, setIsLoading] = useState(false)

  // Colores dinámicos según el tipo de usuario
  const getThemeColors = () => {
    if (formData.tipoUsuario === 'industria') {
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
    setFormData(prev => ({ ...prev, [name]: value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (formData.tipoUsuario === 'industria' && !formData.empresa?.trim()) {
      newErrors.empresa = 'El nombre de la empresa es requerido'
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
    
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Guardar token de autenticación
      const tokenType = formData.tipoUsuario === 'industria' ? 'demo-token-industria' : 'demo-token-agricultor'
      localStorage.setItem('token', tokenType)
      localStorage.setItem('userType', formData.tipoUsuario)
      localStorage.setItem('userEmail', formData.email)
      localStorage.setItem('userName', formData.nombre)
      
      // Redirigir según el tipo de usuario
      if (formData.tipoUsuario === 'industria') {
        router.push('/dashboard-empresa')
      } else {
        router.push('/dashboard-agricultor')
      }
    } catch (error) {
      console.error('Error en el registro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-[#81D4FF] dark:from-gray-900 dark:to-gray-800">
        <div className="w-full h-full flex gap-8 items-stretch p-8">
          {/* Columna de animación */}
          <div className="w-full hidden lg:block">
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

          {/* Tarjeta de registro */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 w-full lg:w-[448px]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crear Cuenta
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Únete a la plataforma AlerTrace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contenedor scrolleable para los campos del formulario */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent space-y-6">
              {/* Tipo de Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tipo de Usuario
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tipoUsuario: 'industria' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.tipoUsuario === 'industria'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Factory className={`h-6 w-6 mx-auto mb-2 ${
                      formData.tipoUsuario === 'industria' ? 'text-blue-600' : 'text-gray-400'
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
                    onClick={() => setFormData(prev => ({ ...prev, tipoUsuario: 'agricultor' }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.tipoUsuario === 'agricultor'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Sprout className={`h-6 w-6 mx-auto mb-2 ${
                      formData.tipoUsuario === 'agricultor' ? 'text-green-600' : 'text-gray-400'
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

              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Tu nombre completo"
                  />
                </div>
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.nombre}
                  </p>
                )}
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
                    value={formData.email}
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

              {/* Empresa (solo para industria) */}
              {formData.tipoUsuario === 'industria' && (
                <div>
                  <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nombre de la Empresa
                  </label>
                  <div className="relative">
                    <Factory className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="empresa"
                      name="empresa"
                      value={formData.empresa}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                        errors.empresa ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  {errors.empresa && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.empresa}
                    </p>
                  )}
                </div>
              )}

              {/* Teléfono */}
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Teléfono (Opcional)
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                  placeholder="+51 999 999 999"
                />
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
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Mínimo 6 caracteres"
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

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 ${colors.primaryFocus} focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${colors.primary === 'blue' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'} text-white py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Crear Cuenta
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
              <div><strong>Industria:</strong> demo@industria.com / demo123</div>
              <div><strong>Agricultor:</strong> demo@agricultor.com / demo123</div>
            </div>
          </div>

          {/* Enlace a login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className={`${colors.primaryText} ${colors.primaryHover} font-medium`}>
                Iniciar sesión
              </Link>
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}