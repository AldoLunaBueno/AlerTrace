'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

export function CtaSection() {
  const benefits = [
    'Trazabilidad completa',
    'Integración total',
    'Monitoreo en tiempo real',
    'Control centralizado',
    'Soporte especializado'
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-[#50AAD8] to-[#50AAD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center flex flex-col gap-4 sm:gap-6">
              {/* Header */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-4">
                ¿Listo para Transformar tu Cadena Productiva?
              </h2>
              <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto px-4">
                Descubre cómo puedes optimizar toda tu cadena productiva
                con AlerTrace. Comienza tu prueba gratuita hoy mismo.
              </p>

              {/* Benefits */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-white/20 ${
                      index === benefits.length - 1 && benefits.length % 2 === 1 ? 'col-span-2 md:col-span-1' : ''
                    }`}
                  >
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white flex-shrink-0" />
                    <span className="text-white text-xs sm:text-sm font-medium ml-2">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#50AAD8] font-bold text-base sm:text-lg rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Comenzar Prueba Gratuita
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold text-base sm:text-lg rounded-xl hover:bg-white/10 transition-colors"
                >
                  Hablar con un Experto
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="text-gray-100 text-xs sm:text-sm flex flex-col gap-3 sm:gap-6 px-4">
                <p>
                  ✓ Sin compromiso • ✓ Configuración en 5 minutos • ✓ Soporte disponible
                </p>
                <p>
                  Plataforma diseñada para optimizar cadenas productivas de cualquier tamaño
                </p>
              </div>
            </div>
      </div>
    </section>
  )
}
