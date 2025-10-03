'use client'

import Link from 'next/link'
import { ArrowRight, Leaf, BarChart3, Smartphone, Globe } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-sacha-50 to-green-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-sacha-100 dark:bg-sacha-900/20 rounded-full text-sacha-700 dark:text-sacha-300 text-sm font-medium mb-8">
            <Leaf className="h-4 w-4 mr-2" />
            Sistema de Trazabilidad Agrícola
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Monitorea tus cultivos con{' '}
            <span className="text-sacha-600 dark:text-sacha-400">
              tecnología IoT
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            SachaTrace te permite supervisar en tiempo real el estado de tus cultivos, 
            recibir alertas inteligentes y optimizar el rendimiento de tu producción agrícola.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/registro"
              className="inline-flex items-center px-8 py-3 bg-sacha-600 text-white font-semibold rounded-lg hover:bg-sacha-700 transition-colors"
            >
              Comenzar Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ver Características
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-sacha-100 dark:bg-sacha-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-sacha-600 dark:text-sacha-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Análisis en Tiempo Real
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Supervisa temperatura, humedad, pH y más variables críticas
              </p>
            </div>

            <div className="text-center">
              <div className="bg-sacha-100 dark:bg-sacha-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-sacha-600 dark:text-sacha-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Acceso Móvil
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Controla tu sistema desde cualquier lugar con nuestra app móvil
              </p>
            </div>

            <div className="text-center">
              <div className="bg-sacha-100 dark:bg-sacha-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-sacha-600 dark:text-sacha-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Alertas Inteligentes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Recibe notificaciones cuando algo requiera tu atención
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
