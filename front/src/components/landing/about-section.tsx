'use client'

import { Factory, Target, Zap, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export function AboutSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Cambio automático de slides cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3) // 3 slides total
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  const values = [
    {
      icon: Factory,
      title: 'Integración Completa',
      description: 'Conectamos todos los eslabones de tu cadena productiva, desde la producción hasta la distribución final.'
    },
    {
      icon: Target,
      title: 'Precisión Total',
      description: 'Nuestra tecnología IoT permite mediciones precisas y decisiones basadas en datos en cada etapa del proceso.'
    },
    {
      icon: Zap,
      title: 'Innovación Constante',
      description: 'Utilizamos las últimas tecnologías para ofrecer soluciones innovadoras a los desafíos de la cadena productiva moderna.'
    },
    {
      icon: Shield,
      title: 'Confiabilidad Total',
      description: 'Garantizamos la seguridad de tus datos y la disponibilidad del sistema para que puedas confiar en nosotros 24/7.'
    }
  ]

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center flex flex-col gap-4 sm:gap-6 mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white px-4">
            Acerca de AlerTrace
          </h2>
          <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto px-4">
            Una plataforma innovadora diseñada para revolucionar las cadenas productivas a través de la tecnología IoT, 
            conectando todos los eslabones desde la producción hasta el consumidor final.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-12 sm:mb-16">
          <div className="flex flex-col gap-4 sm:gap-6 px-4">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Nuestra Visión
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              En AlerTrace, creemos que la tecnología puede transformar las cadenas productivas completas, 
              haciéndolas más eficientes, transparentes y rentables. Nuestro objetivo es 
              conectar todos los eslabones de la cadena productiva con herramientas de monitoreo avanzadas.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              La plataforma está diseñada para empresas agrícolas y manufactureras que buscan 
              implementar soluciones IoT que permitan trazabilidad completa, optimización de recursos 
              y toma de decisiones informadas en cada etapa del proceso productivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="/registro"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-[#50AAD8] text-white font-semibold rounded-lg hover:bg-[#50AAD8]/90 transition-colors text-sm sm:text-base"
              >
                Únete Ahora
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Contáctanos
              </a>
            </div>
          </div>
          
          {/* Carrusel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700 mx-4 lg:mx-0">
            <div className="relative">
              {/* Carrusel Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {/* Slide 1: ¿Por qué elegir AlerTrace? */}
                  <div className="w-full flex-shrink-0 px-2 sm:px-4">
                    <div className="py-4 sm:py-8">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                        ¿Por qué elegir AlerTrace?
                      </h4>
                      <ul className="space-y-3 sm:space-y-4">
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Integración completa de cadena productiva</strong> desde producción agrícola hasta manufactura
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Trazabilidad total</strong> con análisis de datos en tiempo real
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Soporte técnico especializado</strong> para implementación y mantenimiento
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Escalabilidad total</strong> desde pequeñas empresas hasta grandes corporaciones
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Slide 2: Tecnología IoT */}
                  <div className="w-full flex-shrink-0 px-2 sm:px-4">
                    <div className="py-4 sm:py-8">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                        Tecnología IoT Avanzada
                      </h4>
                      <ul className="space-y-3 sm:space-y-4">
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Sensores inteligentes</strong> con conectividad 4G/LoRaWAN
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Batería de larga duración</strong> hasta 5 años de autonomía
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Resistencia IP67</strong> para condiciones extremas
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Instalación plug-and-play</strong> en menos de 15 minutos
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Slide 3: Soporte y Servicio */}
                  <div className="w-full flex-shrink-0 px-2 sm:px-4">
                    <div className="py-4 sm:py-8">
                      <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center">
                        Soporte y Servicio
                      </h4>
                      <ul className="space-y-3 sm:space-y-4">
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Soporte 24/7</strong> con técnicos especializados
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Capacitación incluida</strong> para tu equipo técnico
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Mantenimiento preventivo</strong> programado
                          </span>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                            <div className="w-2 h-2 bg-[#50AAD8] dark:bg-[#50AAD8] rounded-full"></div>
                          </div>
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            <strong>Garantía extendida</strong> de 3 años
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Navigation Dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentSlide === index 
                        ? 'bg-[#50AAD8]' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>


        {/* Values */}
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center px-4">
            Nuestros Valores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div
                  key={index}
                  className="text-center bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg"
                >
                  <div className="bg-[#50AAD8]/10 dark:bg-[#50AAD8]/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#50AAD8] dark:text-[#50AAD8]" />
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
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
