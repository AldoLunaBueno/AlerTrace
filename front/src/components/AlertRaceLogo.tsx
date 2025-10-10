import Image from 'next/image'

interface AlertRaceLogoProps {
  className?: string;
  width?: number;
  height?: number;
  showText?: boolean;
  variant?: 'full' | 'icon-only' | 'text-only';
  forceLight?: boolean; // Para forzar la versión clara
  forceDark?: boolean;  // Para forzar la versión oscura
  darkMode?: boolean;   // Para indicar si está en modo oscuro
}

export function AlertRaceLogo({ 
  className = "", 
  width = 120, 
  height = 30,
  showText = true,
  variant = 'full',
  forceLight = false,
  forceDark = false,
  darkMode = false
}: AlertRaceLogoProps) {
  // Determinar qué versión del logo usar
  const getLogoSrc = () => {
    if (forceLight) return '/alertrace-logo.svg'
    if (forceDark) return '/alertrace-logo-grices.svg'
    
    // Si está en modo oscuro o el fondo es oscuro, usar la versión gris
    if (darkMode) return '/alertrace-logo-grices.svg'
    
    // Por defecto usar la versión clara
    return '/alertrace-logo.svg'
  }

  if (variant === 'text-only') {
    return (
      <span className={`font-bold text-xl ${className}`}>
        AlertRace
      </span>
    )
  }

  if (variant === 'icon-only') {
    return (
      <div className={`relative ${className}`}>
        <Image
          src={getLogoSrc()}
          alt="AlertRace"
          width={width}
          height={height}
          className="object-contain"
        />
      </div>
    )
  }

  // Variant 'full' (default)
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src={getLogoSrc()}
        alt="AlertRace"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  )
}
