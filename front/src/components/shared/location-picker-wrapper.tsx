'use client'

import dynamic from 'next/dynamic'

const LocationPickerComponent = dynamic(
  () => import('./location-picker').then(mod => ({ default: mod.LocationPicker })),
  {
    loading: () => <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>,
    ssr: false
  }
)

export function LocationPickerWrapper(props: any) {
  return <LocationPickerComponent {...props} />
}
