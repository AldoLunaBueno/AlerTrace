'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function RevolutionCtaSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#50AAD8] to-[#50AAD8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center flex flex-col gap-4 sm:gap-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white px-4">
                Únete a la Revolución Productiva
              </h2>
              <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto px-4">
                AlerTrace está diseñado para transformar la forma en que las empresas gestionan sus cadenas productivas.
                Con tecnología IoT de última generación y análisis de datos en tiempo real,
                la plataforma ayuda a maximizar la eficiencia y trazabilidad en cada eslabón.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
                <Link
                  href="/registro"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#50AAD8] font-bold text-base sm:text-lg rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Comenzar Gratis
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                </Link>
                <Link
                  href="#about"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-bold text-base sm:text-lg rounded-xl hover:bg-white/10 transition-colors"
                >
                  Conoce Más
                </Link>
              </div>
            </div>
      </div>
    </section>
  )
}
