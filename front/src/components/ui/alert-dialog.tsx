
import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import type { SensorReading } from "@/hooks/useSensorData"

// --- Rangos ideales ---
const ranges = {
  temperature: { min: 18, max: 30 },
  humidity: { min: 40, max: 70 },
  ph: { min: 5.5, max: 7.5 },
  npk: { min: 200, max: 800 },
  soilHumidity: { min: 30, max: 70 },
  sunlight: { min: 20, max: 90 },
}

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> & { data: SensorReading }
>(({ className, data, ...props }, ref) => {
  // 🔎 Verifica qué parámetros están fuera de rango
  const alerts = Object.entries(ranges).filter(([key, range]) => {
    const value = data[key as keyof SensorReading] as number
    return value < range.min || value > range.max
  })

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background p-6 shadow-lg sm:rounded-lg space-y-4",
          className
        )}
        {...props}
      >
        <h2 className="text-lg font-semibold">⚠️ Alerta de Sensores</h2>
        {alerts.length > 0 ? (
          <ul className="space-y-2">
            {alerts.map(([key, range]) => {
              const value = data[key as keyof SensorReading]
              return (
                <li
                  key={key}
                  className="text-sm font-medium text-red-600 bg-red-100 p-2 rounded-md"
                >
                  {key}: {value} (fuera de rango {range.min} - {range.max})
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-sm text-green-600">✅ Todos los parámetros están en rango</p>
        )}
        <div className="flex justify-end gap-2">
          <AlertDialogPrimitive.Cancel
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Cerrar
          </AlertDialogPrimitive.Cancel>
        </div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
}
