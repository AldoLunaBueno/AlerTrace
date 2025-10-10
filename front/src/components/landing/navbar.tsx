'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { AlertRaceLogo } from '../AlertRaceLogo'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <AlertRaceLogo 
                width={140} 
                height={35} 
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
            >
              Características
            </Link>
            <Link
              href="#about"
              className="text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
            >
              Acerca
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
            >
              Contacto
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/registro"
              className="bg-[#50AAD8] text-white px-4 py-2 rounded-lg hover:bg-[#50AAD8]/90 transition-colors"
            >
              Registrarse
            </Link>
          </div>
          

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-sacha-600 dark:hover:text-sacha-400"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div>
                <Link
                  href="#features"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Características
                </Link>
                <Link
                  href="#about"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Acerca
                </Link>
                <Link
                  href="#contact"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
              <div className="mt-2 space-y-1">
                <Link
                  href="/login"
                  className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-[#50AAD8] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/registro"
                  className="block px-3 py-2 bg-[#50AAD8] text-white rounded-lg hover:bg-[#50AAD8]/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
