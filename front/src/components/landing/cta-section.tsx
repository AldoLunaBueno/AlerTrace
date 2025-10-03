'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function CtaSection() {
  const benefits = [
    'Monitoreo en tiempo real',
    'Alertas inteligentes',
    'Reportes detallados',
    'Acceso móvil 24/7',
    'Soporte técnico especializado'
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-sacha-600 to-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Header */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para Transformar tu Agricultura?
          </h2>
          <p className="text-xl text-sacha-100 mb-8 max-w-3xl mx-auto">
            Únete a cientos de agricultores que ya están optimizando sus cultivos 
            con SachaTrace. Comienza tu prueba gratuita hoy mismo.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
              >
                <CheckCircle className="h-5 w-5 text-white mr-2 flex-shrink-0" />
                <span className="text-white text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/registro"
              className="inline-flex items-center px-8 py-4 bg-white text-sacha-600 font-bold text-lg rounded-xl hover:bg-sacha-50 transition-colors shadow-lg"
            >
              Comenzar Prueba Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-xl hover:bg-white/10 transition-colors"
            >
              Hablar con un Experto
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="text-sacha-100 text-sm">
            <p className="mb-2">
              ✓ Sin compromiso • ✓ Configuración en 5 minutos • ✓ Soporte 24/7
            </p>
            <p>
              Más de 500 agricultores confían en SachaTrace para optimizar sus cultivos
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
