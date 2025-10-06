import { useState } from "react";
import { LucideIcon, ChevronDown, ChevronUp } from "lucide-react";
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
    good: "text-green-600",
    warning: "text-yellow-600",
    critical: "text-red-600",
  };

  const cardAlertBackground =
    status === "warning"
      ? "bg-yellow-500/40"
      : status === "critical"
      ? "bg-red-500/40"
      : "";

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer",
        cardAlertBackground
      )}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Barra superior */}
      <div className={cn("h-2", colorClass)} />

      <div className="p-0 relative">
        {/* Botón flecha */}
        <button
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-10"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {/* Contenido base (icono + título) */}
        <div className="p-4 flex flex-col items-center text-center">
          <div className={cn("p-3 rounded-full mb-2", colorClass)}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
        </div>

        {/* Contenido expandible */}
        {expanded && (
          <div className="px-4 pb-4 text-center space-y-1">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {value}
              <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-1">
                {unit}
              </span>
            </p>
            <p className={cn("text-xs font-medium", statusColors[status])}>
              Estado: {status}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
