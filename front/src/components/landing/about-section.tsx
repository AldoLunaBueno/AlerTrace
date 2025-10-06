'use client'

import { Leaf, Target, Zap, Shield } from 'lucide-react'

export function AboutSection() {
  const values = [
    {
      icon: Leaf,
      title: 'Sostenibilidad',
      description: 'Promovemos prácticas agrícolas sostenibles que respetan el medio ambiente y aseguran la viabilidad a largo plazo.'
    },
    {
      icon: Target,
      title: 'Precisión',
      description: 'Nuestra tecnología permite mediciones precisas y decisiones basadas en datos concretos para optimizar cada aspecto de tus cultivos.'
    },
    {
      icon: Zap,
      title: 'Innovación',
      description: 'Utilizamos las últimas tecnologías IoT y análisis de datos para ofrecer soluciones innovadoras a los desafíos agrícolas modernos.'
    },
    {
      icon: Shield,
      title: 'Confiabilidad',
      description: 'Garantizamos la seguridad de tus datos y la disponibilidad del sistema para que puedas confiar en nosotros 24/7.'
    }
  ]

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Acerca de SachaTrace
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Somos una empresa dedicada a revolucionar la agricultura a través de la tecnología IoT, 
            proporcionando herramientas inteligentes para optimizar la producción agrícola.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Nuestra Misión
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              En SachaTrace, creemos que la tecnología puede transformar la agricultura, 
              haciéndola más eficiente, sostenible y rentable. Nuestro objetivo es 
              democratizar el acceso a herramientas de monitoreo avanzadas para 
              agricultores de todos los tamaños.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Trabajamos con agricultores, cooperativas y empresas agrícolas para 
              implementar soluciones IoT que permitan un monitoreo preciso del estado 
              de los cultivos, optimización de recursos y toma de decisiones informadas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/registro"
                className="inline-flex items-center px-6 py-3 bg-sacha-600 text-white font-semibold rounded-lg hover:bg-sacha-700 transition-colors"
              >
                Únete Ahora
              </a>
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Contáctanos
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              ¿Por qué elegir SachaTrace?
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-sacha-100 dark:bg-sacha-900/20 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-sacha-600 dark:bg-sacha-400 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Tecnología IoT de última generación</strong> para monitoreo preciso
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sacha-100 dark:bg-sacha-900/20 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-sacha-600 dark:bg-sacha-400 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Análisis de datos en tiempo real</strong> para decisiones informadas
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sacha-100 dark:bg-sacha-900/20 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-sacha-600 dark:bg-sacha-400 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Soporte técnico especializado</strong> para implementación y mantenimiento
                </span>
              </li>
              <li className="flex items-start">
                <div className="bg-sacha-100 dark:bg-sacha-900/20 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-sacha-600 dark:bg-sacha-400 rounded-full"></div>
                </div>
                <span className="text-gray-600 dark:text-gray-300">
                  <strong>Escalabilidad</strong> desde pequeñas parcelas hasta grandes operaciones
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Values */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="text-center bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
                >
                  <div className="bg-sacha-100 dark:bg-sacha-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-sacha-600 dark:text-sacha-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
