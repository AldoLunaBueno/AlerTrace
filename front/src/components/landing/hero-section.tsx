'use client'

import Link from 'next/link'
import { ArrowRight, Factory, BarChart3, Smartphone, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

export function HeroSection() {
  const [videoSource, setVideoSource] = useState('/VideoHero.mp4')

  useEffect(() => {
    const updateVideoSource = () => {
      if (window.innerWidth <= 768) {
        setVideoSource('/video-alertrace-movil.mp4')
      } else {
        setVideoSource('/VideoHero.mp4')
      }
    }

    // Set initial video source
    updateVideoSource()

    // Add resize listener
    window.addEventListener('resize', updateVideoSource)

    // Cleanup
    return () => window.removeEventListener('resize', updateVideoSource)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Video Background */}
      <video
        key={videoSource}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center"
      >
        <source src={videoSource} type="video/mp4" />
        {/* Fallback para navegadores que no soportan video */}
        <div className="absolute inset-0 bg-gradient-to-br from-sacha-50 to-green-100 dark:from-gray-900 dark:to-gray-800"></div>
      </video>
      
      {/* Overlay negro con opacidad */}
      <div className="absolute inset-0 bg-black bg-opacity-45 z-10"></div>
      
      {/* Contenido del hero */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center flex flex-col gap-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
            Optimiza toda tu{' '}
            <span className="text-[#50AAD8]">
              cadena productiva
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-100 max-w-3xl mx-auto px-4">
            Desde la producción agrícola hasta la manufactura, AlerTrace conecta todos los eslabones 
            de tu cadena productiva con tecnología IoT para maximizar la eficiencia y trazabilidad.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
        <Link
          href="/registro"
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[#50AAD8] text-white font-semibold rounded-lg hover:bg-[#50AAD8]/90 transition-colors"
        >
          Comenzar Gratis
          <ArrowRight className="h-5 w-5 ml-2" />
        </Link>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 border border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              Ver Características
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center flex flex-col gap-4 sm:gap-6">
              <div className="bg-white/20 backdrop-blur-sm w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto border border-white/30">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Monitoreo Integral
              </h3>
              <p className="text-sm sm:text-base text-gray-100">
                Desde cultivos hasta líneas de producción, supervisa cada etapa
              </p>
            </div>

            <div className="text-center flex flex-col gap-4 sm:gap-6">
              <div className="bg-white/20 backdrop-blur-sm w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto border border-white/30">
                <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Control Centralizado
              </h3>
              <p className="text-sm sm:text-base text-gray-100">
                Gestiona toda tu operación desde una sola plataforma
              </p>
            </div>

            <div className="text-center flex flex-col gap-4 sm:gap-6 sm:col-span-2 md:col-span-1">
              <div className="bg-white/20 backdrop-blur-sm w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto border border-white/30">
                <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Trazabilidad Completa
              </h3>
              <p className="text-sm sm:text-base text-gray-100">
                Rastrea cada producto desde el origen hasta el consumidor final
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
