'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Instagram, Linkedin, Twitter } from 'lucide-react'
import { AlertRaceLogo } from '../AlertRaceLogo'

export function Footer() {
  const currentYear = new Date().getFullYear()

      const footerLinks = {
        product: [
          { name: 'Características', href: '#features' },
          { name: 'Precios', href: '/pricing' },
          { name: 'API', href: '/api' },
          { name: 'Integraciones', href: '#integrations' }
        ],
        support: [
          { name: 'Centro de Ayuda', href: '/help' },
          { name: 'Documentación', href: '/docs' },
          { name: 'Contacto', href: '#contact' },
          { name: 'Estado del Sistema', href: '/status' }
        ],
        legal: [
          { name: 'Privacidad', href: '/privacy' },
          { name: 'Términos', href: '/terms' },
          { name: 'Cookies', href: '/cookies' },
          { name: 'Seguridad', href: '/security' }
        ]
      }

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4 sm:gap-6">
            <Link href="/" className="flex items-center">
              <AlertRaceLogo
                width={210}
                height={30}
                className="h-6 sm:h-7 w-auto"
                forceDark={true}
              />
            </Link>
            <p className="text-gray-400 max-w-sm text-sm sm:text-base">
              Plataforma de trazabilidad diseñada para optimizar cadenas productivas
              con tecnología IoT avanzada.
            </p>

            {/* Contact Info */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <div className="flex items-center text-gray-400 gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">alertrace25@gmail.com</span>
              </div>
              <div className="flex items-center text-gray-400 gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href="https://wa.me/51940701652"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-[#50AAD8] transition-colors"
                >
                  +51 940 701 652
                </a>
              </div>
              <div className="flex items-center text-gray-400 gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">Lima, Perú</span>
              </div>
            </div>
          </div>

              {/* Product */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <h3 className="text-base sm:text-lg font-semibold">Producto</h3>
                <ul className="flex flex-col gap-2">
                  {footerLinks.product.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>


          {/* Support */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h3 className="text-base sm:text-lg font-semibold">Soporte</h3>
            <ul className="flex flex-col gap-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

              {/* Legal */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <h3 className="text-base sm:text-lg font-semibold">Legal</h3>
                <ul className="flex flex-col gap-2">
                  {footerLinks.legal.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Media */}
              <div className="flex flex-col gap-4 sm:gap-6">
                <h3 className="text-base sm:text-lg font-semibold">Redes Sociales</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/alertrace?igsh=YzljYTk1ODg3Zg=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#50AAD8] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@alertrace?_t=ZS-90L6CNw2j2m&_r=1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#50AAD8] transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/alertrace/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#50AAD8] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5 sm:h-6 sm:w-6" />
                  </a>
                  <a
                    href="https://x.com/AlerTrace_"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#50AAD8] transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Síguenos para las últimas actualizaciones
                </p>
              </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {currentYear} AlertRace. Todos los derechos reservados.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Términos
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors text-xs sm:text-sm"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
