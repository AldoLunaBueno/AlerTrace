'use client'

import { TrendingUp, Users, Leaf, Award } from 'lucide-react'

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: '95%',
      label: 'Aumento en Productividad',
      description: 'Agricultores reportan mejoras significativas en sus cultivos'
    },
    {
      icon: Users,
      value: '500+',
      label: 'Agricultores Activos',
      description: 'Confían en SachaTrace para sus cultivos'
    },
    {
      icon: Leaf,
      value: '10,000+',
      label: 'Hectáreas Monitoreadas',
      description: 'Superficie total bajo supervisión inteligente'
    },
    {
      icon: Award,
      value: '99.9%',
      label: 'Tiempo de Actividad',
      description: 'Garantizamos la disponibilidad del sistema'
    }
  ]

  return (
    <section className="py-20 bg-sacha-600 dark:bg-sacha-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resultados que Hablan por Sí Solos
          </h2>
          <p className="text-xl text-sacha-100 max-w-3xl mx-auto">
            Los números demuestran el impacto positivo de SachaTrace en la agricultura moderna.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-white mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-sacha-100">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-4">
              Únete a la Revolución Agrícola
            </h3>
            <p className="text-sacha-100 mb-6">
              SachaTrace está transformando la forma en que los agricultores gestionan sus cultivos. 
              Con tecnología IoT de última generación y análisis de datos en tiempo real, 
              estamos ayudando a maximizar el rendimiento y la eficiencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/registro"
                className="inline-flex items-center px-6 py-3 bg-white text-sacha-600 font-semibold rounded-lg hover:bg-sacha-50 transition-colors"
              >
                Comenzar Gratis
              </a>
              <a
                href="#about"
                className="inline-flex items-center px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Conoce Más
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
