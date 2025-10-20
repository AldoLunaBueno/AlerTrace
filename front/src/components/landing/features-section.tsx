'use client'

import { 
  Factory, 
  Package, 
  MapPin, 
  Bell, 
  Smartphone,
  Cloud,
  Activity
} from 'lucide-react'

export function FeaturesSection() {
  const features = [
    {
      icon: Factory,
      title: 'Producción Agrícola',
      description: 'Monitorea cultivos, condiciones del suelo y variables ambientales con sensores IoT avanzados.'
    },
    {
      icon: Package,
      title: 'Procesamiento y Manufactura',
      description: 'Supervisa líneas de producción, calidad del producto y eficiencia operativa en tiempo real.'
    },
    {
      icon: Activity,
      title: 'Monitoreo de Calidad',
      description: 'Supervisa parámetros de calidad en tiempo real durante todo el proceso productivo.'
    },
    {
      icon: MapPin,
      title: 'Geolocalización Global',
      description: 'Visualiza toda tu cadena productiva en mapas interactivos con ubicaciones precisas.'
    },
    {
      icon: Bell,
      title: 'Alertas Inteligentes',
      description: 'Recibe notificaciones inmediatas cuando algo requiera atención en cualquier etapa.'
    },
    {
      icon: Smartphone,
      title: 'Control Móvil',
      description: 'Gestiona toda tu operación desde cualquier dispositivo, en cualquier momento.'
    },
    {
      icon: Cloud,
      title: 'Infraestructura Escalable',
      description: 'Almacenamiento seguro en la nube con respaldos automáticos y acceso global 24/7.'
    }
  ]

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-4 sm:gap-6 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-4">
            Soluciones para Toda la Cadena Productiva
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Desde la producción agrícola hasta la manufactura, 
            AlerTrace conecta todos los eslabones de tu cadena productiva.
          </p>
        </div>

        {/* Features Grid */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 px-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="text-center bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 w-full sm:w-[calc(50%-0.5rem)] md:w-[286px] flex-shrink-0 flex flex-col gap-4 sm:gap-6"
              >
                <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#50AAD8] dark:text-[#50AAD8]" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
