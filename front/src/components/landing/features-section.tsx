'use client'

import { 
  Thermometer, 
  Droplets, 
  Activity, 
  MapPin, 
  Bell, 
  BarChart3,
  Smartphone,
  Cloud
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Thermometer,
      title: 'Monitoreo de Temperatura',
      description: 'Supervisa la temperatura ambiente y del suelo en tiempo real con sensores IoT avanzados.',
      color: 'text-red-500'
    },
    {
      icon: Droplets,
      title: 'Control de Humedad',
      description: 'Mantén el nivel óptimo de humedad del aire y suelo para maximizar el rendimiento.',
      color: 'text-blue-500'
    },
    {
      icon: Activity,
      title: 'Análisis de pH',
      description: 'Monitorea el pH del suelo para asegurar las condiciones óptimas para tus cultivos.',
      color: 'text-green-500'
    },
    {
      icon: MapPin,
      title: 'Geolocalización',
      description: 'Visualiza la ubicación exacta de cada sensor y cultivo en mapas interactivos.',
      color: 'text-purple-500'
    },
    {
      icon: Bell,
      title: 'Alertas Inteligentes',
      description: 'Recibe notificaciones inmediatas cuando los valores se salgan del rango óptimo.',
      color: 'text-yellow-500'
    },
    {
      icon: BarChart3,
      title: 'Reportes y Análisis',
      description: 'Genera reportes detallados y análisis de tendencias para tomar decisiones informadas.',
      color: 'text-indigo-500'
    },
    {
      icon: Smartphone,
      title: 'App Móvil',
      description: 'Accede a toda la información desde tu dispositivo móvil, en cualquier momento y lugar.',
      color: 'text-pink-500'
    },
    {
      icon: Cloud,
      title: 'Almacenamiento en la Nube',
      description: 'Tus datos están seguros en la nube con respaldos automáticos y acceso 24/7.',
      color: 'text-cyan-500'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Características Principales
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre todas las herramientas que SachaTrace pone a tu disposición 
            para optimizar la gestión de tus cultivos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-sacha-50 dark:bg-sacha-900/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Listo para comenzar?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Únete a cientos de agricultores que ya están optimizando sus cultivos con SachaTrace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/registro"
                className="inline-flex items-center px-6 py-3 bg-sacha-600 text-white font-semibold rounded-lg hover:bg-sacha-700 transition-colors"
              >
                Comenzar Ahora
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Contactar Ventas
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
