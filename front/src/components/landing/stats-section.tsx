'use client'

import { TrendingUp, Users, Factory, Award } from 'lucide-react'

export function StatsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: '85%',
      label: 'Mejora en Eficiencia',
      description: 'Empresas pueden lograr optimización en toda su cadena productiva'
    },
    {
      icon: Users,
      value: '200+',
      label: 'Capacidad de Conexión',
      description: 'Plataforma diseñada para conectar múltiples empresas y operaciones'
    },
    {
      icon: Factory,
      value: '25+',
      label: 'Sectores Cubiertos',
      description: 'Agricultura, manufactura y procesamiento industrial'
    },
    {
      icon: Award,
      value: '99.9%',
      label: 'Tiempo de Actividad',
      description: 'Garantizamos la disponibilidad del sistema'
    }
  ]

  return (
    <section className="py-20 bg-sacha-600 dark:bg-sacha-700 hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-6 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Resultados que Hablan por Sí Solos
          </h2>
          <p className="text-xl text-sacha-100 max-w-3xl mx-auto">
            Los números demuestran el impacto positivo de AlerTrace en las cadenas productivas modernas.
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
              Únete a la Revolución Productiva
            </h3>
            <p className="text-sacha-100 mb-6">
              AlerTrace está transformando la forma en que las empresas gestionan sus cadenas productivas. 
              Con tecnología IoT de última generación y análisis de datos en tiempo real, 
              estamos ayudando a maximizar la eficiencia y trazabilidad en cada eslabón.
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
