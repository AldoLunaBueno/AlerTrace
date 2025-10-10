'use client'

import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet'
import { Icon } from 'leaflet'
import { Search, MapPin, Loader2 } from 'lucide-react'

// Importar estilos de Leaflet
import 'leaflet/dist/leaflet.css'

// Configurar iconos por defecto de Leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Suprimir advertencias de APIs obsoletas
if (typeof window !== 'undefined') {
  const originalConsoleWarn = console.warn
  console.warn = (...args) => {
    // Filtrar advertencias específicas de Leaflet
    if (args[0] && typeof args[0] === 'string' && 
        (args[0].includes('mozPressure') || args[0].includes('PointerEvent'))) {
      return
    }
    originalConsoleWarn.apply(console, args)
  }
}

interface LocationData {
  lat: number
  lng: number
  address: string
  city?: string
  region?: string
}

interface LocationPickerProps {
  initialLocation?: LocationData
  onLocationChange: (location: LocationData) => void
  placeholder?: string
}

interface SearchSuggestion {
  display_name: string
  lat: string
  lon: string
  place_id: string
}

// Componente para manejar clicks en el mapa
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
    },
  })
  return null
}

export function LocationPicker({ initialLocation, onLocationChange, placeholder = "Buscar ubicación..." }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || { lat: -12.0464, lng: -77.0428, address: 'Lima, Perú' }
  )
  const [isSearching, setIsSearching] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  // Función para buscar lugares usando Nominatim
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=pe&addressdetails=1`
      )
      const data = await response.json()
      setSuggestions(data)
    } catch (error) {
      console.error('Error buscando lugares:', error)
      setSuggestions([])
    } finally {
      setIsSearching(false)
    }
  }

  // Función para obtener dirección desde coordenadas (geocodificación inversa)
  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        const locationData: LocationData = {
          lat,
          lng,
          address: data.display_name,
          city: data.address?.city || data.address?.town || data.address?.village,
          region: data.address?.state || data.address?.region
        }
        setSelectedLocation(locationData)
        onLocationChange(locationData)
      }
    } catch (error) {
      console.error('Error en geocodificación inversa:', error)
    } finally {
      setIsGeocoding(false)
    }
  }

  // Manejar búsqueda con debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchQuery.trim()) {
        searchPlaces(searchQuery)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  // Manejar selección de sugerencia
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    const locationData: LocationData = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
      address: suggestion.display_name,
      city: suggestion.display_name.split(',')[0]?.trim(),
      region: suggestion.display_name.split(',')[1]?.trim()
    }
    
    setSelectedLocation(locationData)
    setSearchQuery(suggestion.display_name)
    setShowSuggestions(false)
    setSuggestions([])
    onLocationChange(locationData)
  }

  // Manejar click en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    reverseGeocode(lat, lng)
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Sugerencias de búsqueda */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSuggestionSelect(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-900 dark:text-white truncate">
                    {suggestion.display_name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="relative">
        <div className="h-64 w-full rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <MapContainer
            center={[selectedLocation?.lat || -12.0464, selectedLocation?.lng || -77.0428]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                <Popup>
                  <div className="text-sm">
                    <p className="font-medium">{selectedLocation.address}</p>
                    {selectedLocation.city && (
                      <p className="text-gray-600">{selectedLocation.city}</p>
                    )}
                    {selectedLocation.region && (
                      <p className="text-gray-600">{selectedLocation.region}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )}
            
            <MapClickHandler onLocationSelect={handleMapClick} />
          </MapContainer>
        </div>
        
        {isGeocoding && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              <span className="text-sm text-gray-600">Obteniendo dirección...</span>
            </div>
          </div>
        )}
      </div>

      {/* Información de la ubicación seleccionada */}
      {selectedLocation && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <MapPin className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Ubicación seleccionada:
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {selectedLocation.address}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instrucciones */}
      <div className="text-xs text-gray-500 dark:text-gray-400">
        💡 Busca una ubicación en el campo de texto o haz clic en el mapa para seleccionar una dirección
      </div>
    </div>
  )
}
