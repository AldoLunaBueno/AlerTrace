import { useState } from "react";
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  colorClass: string;
  status?: "good" | "warning" | "critical";
}

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  colorClass,
  status = "good",
}: SensorCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    good: "text-primary",
    warning: "text-yellow-600",
    critical: "text-destructive",
  };

  const cardAlertBackground =
    status === "warning"
      ? "bg-yellow-500/40"
      : status === "critical"
      ? "bg-red-500/40"
      : "";

  return (
    <Card
      className={cn(
        "overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in cursor-pointer",
        cardAlertBackground // Fondo de alerta según status
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-0 relative">
        {/* Barra superior */}
        <div className={cn("h-2", colorClass)} />

        {/* Botón flecha */}
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted z-10"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {/* Contenido base (icono + título) */}
        <div className="p-4 flex flex-col items-center text-center">
          <div className={cn("p-3 rounded-full mb-2", colorClass)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-semibold">{title}</p>
        </div>

        {/* Contenido expandible */}
        {expanded && (
          <div className="px-4 pb-4 text-center space-y-1">
            <p className="text-xl font-bold text-foreground">
              {value}
              <span className="text-xs font-normal text-muted-foreground ml-1">
                {unit}
              </span>
            </p>
            <p className={cn("text-xs font-medium", statusColors[status])}>
              Estado: {status}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
